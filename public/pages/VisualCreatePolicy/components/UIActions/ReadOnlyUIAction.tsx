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
import { ReadOnlyAction, UIAction } from "../../../../../models/interfaces";
import { makeId } from "../../../../utils/helpers";
import { ActionType } from "../../utils/constants";

export default class ReadOnlyUIAction implements UIAction<ReadOnlyAction> {
  id: string;
  action: ReadOnlyAction;
  type = ActionType.ReadOnly;

  constructor(action: ReadOnlyAction, id: string = makeId()) {
    this.action = action;
    this.id = id;
  }

  content = () => `Read only`;

  clone = (action: ReadOnlyAction) => new ReadOnlyUIAction(action, this.id);

  isValid = () => true;

  render = (action: UIAction<ReadOnlyAction>, onChangeAction: (action: UIAction<ReadOnlyAction>) => void) => {
    return <div />;
  };

  toAction = () => this.action;
}
