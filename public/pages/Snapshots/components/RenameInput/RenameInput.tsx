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

import { EuiFormRow, EuiFieldText, EuiSpacer, EuiText, EuiLink } from "@elastic/eui";
import React, { useState, ChangeEvent } from "react";
import { RESTORE_SNAPSHOT_DOCUMENTATION_URL } from "../../../../utils/constants";
import { BAD_RENAME_PATTERN_TEXT, BAD_RENAME_REPLACEMENT_TEXT, RENAME_HELP_TEXT, PATTERN_HELP_TEXT } from "../../constants";
interface RenameInputProps {
  getRenamePattern: (prefix: string) => void;
  getRenameReplacement: (prefix: string) => void;
  showPatternError: boolean;
  showRenameError: boolean;
}

const RenameInput = ({ getRenamePattern, getRenameReplacement, showPatternError, showRenameError }: RenameInputProps) => {
  const [renamePattern, setRenamePattern] = useState("(.+)");
  const [renameReplacement, setRenameReplacement] = useState("restored_$1");

  const onPatternChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRenamePattern(e.target.value);
    getRenamePattern(e.target.value);
  };

  const onReplacementChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRenameReplacement(e.target.value);
    getRenameReplacement(e.target.value);
  };

  const patternLabel = (
    <>
      <EuiText size="xs">
        <h4>Rename Pattern</h4>
      </EuiText>
      <EuiText size="xs" style={{ padding: "0px 0px 5px 0px", fontWeight: "200" }}>
        {`${PATTERN_HELP_TEXT}} `}
        <EuiLink href={RESTORE_SNAPSHOT_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer" external={true}>
          Learn more
        </EuiLink>
      </EuiText>
    </>
  );

  const renameLabel = (
    <>
      <EuiText size="xs">
        <h4>Rename Replacement</h4>
      </EuiText>
      <EuiText size="xs" style={{ padding: "0px 0px 5px 0px", fontWeight: "200" }}>
        {`${RENAME_HELP_TEXT} `}
        <EuiLink href={RESTORE_SNAPSHOT_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer" external={true}>
          Learn more
        </EuiLink>
      </EuiText>
    </>
  );

  return (
    <>
      <EuiSpacer size="l" />
      <EuiFormRow error={BAD_RENAME_PATTERN_TEXT} isInvalid={showPatternError} label={patternLabel} id="rename_pattern">
        <EuiFieldText value={renamePattern} onChange={onPatternChange} isInvalid={showPatternError} data-test-subj="renamePatternInput" />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow error={BAD_RENAME_REPLACEMENT_TEXT} isInvalid={showRenameError} label={renameLabel} id="rename_replacement">
        <EuiFieldText
          value={renameReplacement}
          onChange={onReplacementChange}
          isInvalid={showRenameError}
          data-test-subj="renameReplacementInput"
        />
      </EuiFormRow>
    </>
  );
};

export default RenameInput;
