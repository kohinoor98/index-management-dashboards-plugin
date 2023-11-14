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
import { render, fireEvent } from "@testing-library/react";
import OpenIndexModal from "./OpenIndexModal";

describe("<OpenIndexModal /> spec", () => {
  it("renders the component", async () => {
    render(<OpenIndexModal selectedItems={[]} visible onConfirm={() => {}} onClose={() => {}} />);

    expect(document.body.children).toMatchSnapshot();
  });

  it("calls close when cancel button clicked", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<OpenIndexModal selectedItems={[]} visible onConfirm={() => {}} onClose={onClose} />);
    fireEvent.click(getByTestId("Open Cancel button"));
    expect(onClose).toHaveBeenCalled();
  });
});
