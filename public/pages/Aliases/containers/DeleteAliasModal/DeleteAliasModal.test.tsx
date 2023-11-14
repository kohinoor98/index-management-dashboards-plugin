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
import { render } from "@testing-library/react";
import DeleteAliasModal from "./DeleteAliasModal";

describe("<DeleteIndexModal /> spec", () => {
  it("renders the component", async () => {
    // the main unit test case is in AliasActions.test.tsx
    render(<DeleteAliasModal selectedItems={[]} visible onDelete={() => {}} onClose={() => {}} />);
    expect(document.body.children).toMatchSnapshot();
  });
});
