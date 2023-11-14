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
import { RouteComponentProps } from "react-router-dom";
import { FieldInstance } from "../../lib/field";
import { DataStream } from "../../../server/models/interfaces";
import { TemplateItemRemote } from "../../../models/interfaces";

export interface DataStreamDetailProps {
  templateName?: string;
  onCancel?: () => void;
  onSubmitSuccess?: (templateName: string) => void;
  readonly?: boolean;
  history: RouteComponentProps["history"];
}

export interface SubDetailProps extends DataStreamDetailProps {
  field: FieldInstance;
  isEdit: boolean;
}

export interface DataStreamInEdit extends DataStream {
  matchedTemplate?: string;
}

export interface TemplateItem {
  name: string;
  index_template: TemplateItemRemote;
}
