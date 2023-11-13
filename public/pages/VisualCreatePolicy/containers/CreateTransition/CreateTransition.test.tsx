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

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import CreateTransition from "./CreateTransition";
import { UITransition } from "../../../../../models/interfaces";

describe("<CreateTransition /> spec", () => {
  it("renders the component", () => {
    const transition: UITransition = { id: "some_id", transition: { state_name: "hot", conditions: { min_index_age: "30d" } } };
    const { container } = render(
      <CreateTransition
        editTransition={transition}
        onCloseCreateTransition={() => {}}
        onClickSaveTransition={() => {}}
        stateOptions={["hot", "warm", "cold"]}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
