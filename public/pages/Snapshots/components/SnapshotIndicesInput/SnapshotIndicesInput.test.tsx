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

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SnapshotIndicesInput from "./SnapshotIndicesInput";

const testProps = {
  onIndicesSelectionChange: jest.fn(),
  getIndexOptions: jest.fn(),
  onCreateOption: jest.fn(),
  isClearable: true,
};

afterEach(() => {
  cleanup();
});

describe("SnapshotIndicesInput component", () => {
  it("renders without error", () => {
    const { container } = render(
      <SnapshotIndicesInput {...testProps} indexOptions={[]} selectedIndexOptions={[]} selectedRepoValue="test_repo" />
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("accepts user input", () => {
    render(
      <SnapshotIndicesInput
        {...testProps}
        indexOptions={[{ label: "test_index_1" }, { label: "test_index_2" }]}
        selectedIndexOptions={[]}
        selectedRepoValue="test_repo"
      />
    );

    userEvent.type(screen.getByRole("textbox"), "test*{enter}");

    expect(testProps.onCreateOption).toBeCalledTimes(1);
  });

  it("allows user to select indices to restore", async () => {
    render(
      <SnapshotIndicesInput
        {...testProps}
        indexOptions={[{ label: "test_index_1" }, { label: "test_index_2" }]}
        selectedIndexOptions={[]}
        selectedRepoValue="test_repo"
      />
    );
    userEvent.click(screen.getByRole("textbox"));

    expect(screen.getByText("test_index_1")).toBeInTheDocument();
    expect(screen.getByText("test_index_2")).toBeInTheDocument();

    userEvent.click(screen.getByText("test_index_1"));
    userEvent.click(screen.getByText("test_index_2"));

    expect(testProps.onIndicesSelectionChange).toBeCalledTimes(2);
  });
});
