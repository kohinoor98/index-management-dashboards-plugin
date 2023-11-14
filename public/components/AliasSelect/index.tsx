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

import React, { forwardRef, useRef } from "react";
import { EuiComboBoxProps } from "@elastic/eui";
import RemoteSelect, { RemoteSelectProps } from "../RemoteSelect";
import { ServerResponse } from "../../../server/models/types";
import { filterByMinimatch } from "../../../utils/helper";
import { SYSTEM_ALIAS } from "../../../utils/constants";

export interface AliasSelectProps extends Omit<EuiComboBoxProps<{ label: string; value: string }>, "value" | "onChange"> {
  value?: Record<string, {}>;
  onChange?: (value: AliasSelectProps["value"]) => void;
  refreshOptions: (aliasName: string) => Promise<ServerResponse<Array<{ alias: string; index: string; [key: string]: any }>>>;
  onOptionsChange?: RemoteSelectProps["onOptionsChange"];
}

const AliasSelect = forwardRef((props: AliasSelectProps, ref: React.Ref<HTMLInputElement>) => {
  const { value, onChange, refreshOptions: refreshOptionsFromProps, onOptionsChange } = props;
  const optionsRef = useRef<Array<{ label: string; [key: string]: any }>>([]);
  const refreshOptions: RemoteSelectProps["refreshOptions"] = ({ searchValue }) => {
    return refreshOptionsFromProps(searchValue || "").then((res) => {
      if (res?.ok) {
        return {
          ...res,
          response: [
            ...new Set(res.response.filter((item) => item.alias && !filterByMinimatch(item.alias, SYSTEM_ALIAS)).map((item) => item.alias)),
          ].map((alias) => {
            const findItem = res.response.find((item) => item.alias === alias) as { alias: string };
            return {
              label: findItem.alias,
            };
          }),
        };
      } else {
        return res;
      }
    });
  };
  return (
    <RemoteSelect
      {...(props as Partial<EuiComboBoxProps<any>>)}
      onOptionsChange={(options) => {
        optionsRef.current = options;
        onOptionsChange?.(options);
      }}
      placeholder="Select aliases or specify new aliases."
      customOptionText="Add {searchValue} as a new alias."
      refreshOptions={refreshOptions}
      value={Object.keys(value || {})}
      onChange={(val) => {
        if (onChange) {
          onChange(
            val
              .map((label) => optionsRef.current.find((item) => item.label === label) || { label })
              .reduce((total, { label, ...others }) => ({ ...total, [label]: others || {} }), {})
          );
        }
      }}
    />
  );
});

AliasSelect.displayName = "AliasSelect";

export default AliasSelect;
