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

import React, { forwardRef } from "react";
import { EuiDelayRender, EuiLoadingContent } from "@elastic/eui";
import type { JSONDiffEditorProps } from "./interface";
import { IJSONEditorRef } from "../JSONEditor";

const LazyBaseEditor = React.lazy(() => (process?.env?.NODE_ENV === "test" ? import("./JSONTextArea") : import("./JSONDiffEditor")));

const Fallback = () => (
  <EuiDelayRender>
    <EuiLoadingContent lines={3} />
  </EuiDelayRender>
);

const JSONDiffEditor = forwardRef((props: JSONDiffEditorProps, ref: React.Ref<IJSONEditorRef>) => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <LazyBaseEditor {...props} ref={ref} />
    </React.Suspense>
  );
});

export default JSONDiffEditor;
export * from "./interface";
