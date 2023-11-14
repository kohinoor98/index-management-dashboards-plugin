/*
 *   Copyright OpenSearch Contributors
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import React, { forwardRef, Ref, useRef, useState } from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderHook } from "@testing-library/react-hooks";
import IndexMapping, { IIndexMappingsRef, IndexMappingProps, transformObjectToArray } from "./IndexMapping";
import { MappingsProperties } from "../../../models/interfaces";

const IndexMappingOnChangeWrapper = forwardRef((props: Partial<IndexMappingProps>, ref: Ref<IIndexMappingsRef>) => {
  const [value, setValue] = useState(props.value as any);
  return (
    <IndexMapping
      {...props}
      docVersion="latest"
      ref={ref}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
    />
  );
});

describe("<IndexMapping /> spec", () => {
  it("renders the component", () => {
    const { container } = render(<IndexMapping docVersion="latest" onChange={() => {}} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("render mappings with object type", () => {
    const { container } = render(
      <IndexMapping
        docVersion="latest"
        onChange={() => {}}
        value={{
          properties: [{ fieldName: "object", type: "object", properties: [{ fieldName: "text", type: "text" }] }],
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("render mappings with oldValue in edit mode and all operation works well", async () => {
    const { result } = renderHook(() => {
      const ref = useRef<IIndexMappingsRef>(null);
      const renderResult = render(
        <IndexMappingOnChangeWrapper
          ref={ref}
          isEdit
          oldValue={{
            properties: [{ fieldName: "object", type: "object", properties: [{ fieldName: "text", type: "text" }] }],
          }}
          value={{
            properties: [{ fieldName: "object", type: "object", properties: [{ fieldName: "text", type: "text" }] }],
          }}
        />
      );

      return {
        renderResult,
        ref,
      };
    });
    const { renderResult, ref } = result.current;
    const { getByTestId, getByText, queryByTestId, queryByText } = renderResult;

    // old field disable check
    expect(getByTestId("mapping-visual-editor-0-field-name")).toHaveAttribute("title", "object");
    expect(getByTestId("mapping-visual-editor-0.properties.0-field-name")).toHaveAttribute("title", "text");
    expect(document.querySelector('[data-test-subj="mapping-visual-editor-0-delete-field"]')).toBeNull();
    expect(document.querySelector('[data-test-subj="mapping-visual-editor-0.properties.0-add-sub-field"]')).toBeNull();
    expect(document.querySelector('[data-test-subj="mapping-visual-editor-0.properties.0-delete-field"]')).toBeNull();

    // add a new field
    userEvent.click(getByTestId("createIndexAddFieldButton"));
    // new field should be editable
    expect(getByTestId("mapping-visual-editor-1-field-name")).not.toHaveAttribute("disabled");
    expect(document.querySelector('[data-test-subj="mapping-visual-editor-1-delete-field"]')).not.toBeNull();

    // empty and duplicate validation for field name
    userEvent.click(document.querySelector('[data-test-subj="mapping-visual-editor-1-field-name"]') as Element);
    expect(getByTestId("mapping-visual-editor-1-field-name")).toHaveValue("");
    expect(queryByText("Field name is required, please input")).toBeNull();
    userEvent.type(getByTestId("mapping-visual-editor-1-field-name"), "object");
    await waitFor(() => {
      expect(getByText("Duplicate field name [object], please change your field name")).not.toBeNull();
    });
    await act(async () => {
      expect(await ref.current?.validate()).toEqual("with error");
    });
    userEvent.clear(getByTestId("mapping-visual-editor-1-field-name"));
    userEvent.type(getByTestId("mapping-visual-editor-1-field-name"), "new_object");
    await act(async () => {
      expect(await ref.current?.validate()).toEqual("");
    });

    await waitFor(() => {
      expect(queryByText("Duplicate field name [object], please change your field name")).toBeNull();
    });

    // only show the sub action for type of object
    expect(queryByTestId("mapping-visual-editor-1-add-sub-field")).toBeNull();

    // change type to object
    fireEvent.change(getByTestId("mapping-visual-editor-1-field-type"), {
      target: {
        value: "object",
      },
    });

    // sub action for object
    expect(getByTestId("mapping-visual-editor-1-add-sub-field")).not.toBeNull();
    userEvent.click(getByTestId("mapping-visual-editor-1-add-sub-field"));
    // new sub field check
    expect((getByTestId("mapping-visual-editor-1.properties.0-field-type") as HTMLSelectElement).value).toBe("text");
    await waitFor(() => {
      userEvent.click(getByTestId("mapping-visual-editor-1.properties.0-delete-field"));
    });

    // add a new field
    userEvent.click(getByTestId("createIndexAddFieldButton"));
    // delete the new field
    await waitFor(() => {});
    userEvent.click(getByTestId("mapping-visual-editor-2-delete-field"));
    expect(queryByTestId("mapping-visual-editor-2-delete-field")).toBeNull();

    await userEvent.click(getByTestId("editorTypeJsonEditor").querySelector("input") as Element);
    await waitFor(() => {});
    userEvent.click(getByTestId("previousMappingsJsonButton"));
    await waitFor(() => {});
    expect(queryByTestId("previousMappingsJsonModal-ok")).not.toBeNull();
    userEvent.click(getByTestId("previousMappingsJsonModal-ok"));
    await waitFor(() => {
      expect(queryByTestId("previousMappingsJsonModal-ok")).toBeNull();
    });
  });

  it("it transformObjectToArray", () => {
    expect(
      transformObjectToArray({
        test: {
          type: "text",
          properties: {
            test_children: {
              type: "text",
            },
          },
        },
      })
    ).toEqual([
      {
        fieldName: "test",
        type: "text",
        properties: [
          {
            fieldName: "test_children",
            type: "text",
          },
        ],
      },
    ] as MappingsProperties);
  });
});
