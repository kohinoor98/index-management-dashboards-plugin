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

import React, { useState } from "react";
import { Criteria, EuiBasicTable, EuiFlyout, EuiFlyoutBody, EuiFlyoutHeader, EuiLink, EuiText } from "@elastic/eui";

export default function IndexPatternDisplay(props: { indexPatterns: string[]; templateName: string }) {
  const [hide, setHide] = useState(true);
  const [tableParams, setTableParams] = useState<Criteria<{ pattern: string }>>({});
  const { index, size } = tableParams.page || {
    index: 0,
    size: 10,
  };

  return (
    <div>
      <span>{props.indexPatterns.slice(0, 3).join(", ")}</span>
      {props.indexPatterns.length <= 3 ? null : (
        <EuiLink style={{ marginLeft: 8 }} data-test-subj={`${props.indexPatterns.length - 3} more`} onClick={() => setHide(!hide)}>
          {props.indexPatterns.length - 3} more
        </EuiLink>
      )}
      {hide ? null : (
        <EuiFlyout onClose={() => setHide(!hide)}>
          <EuiFlyoutHeader hasBorder>
            <EuiText size="m">
              <h2 title={`Index patterns in ${props.templateName} (${props.indexPatterns.length})`}>
                Index patterns in in {props.templateName} ({props.indexPatterns.length})
              </h2>
            </EuiText>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiBasicTable
              data-test-subj="indexPatternsTable"
              columns={[
                {
                  name: "Index pattern",
                  field: "pattern",
                },
              ]}
              items={props.indexPatterns.slice(index * size, (index + 1) * size).map((pattern) => ({ pattern }))}
              onChange={setTableParams}
              pagination={{
                pageIndex: index,
                pageSize: size,
                totalItemCount: props.indexPatterns.length,
              }}
            />
          </EuiFlyoutBody>
        </EuiFlyout>
      )}
    </div>
  );
}
