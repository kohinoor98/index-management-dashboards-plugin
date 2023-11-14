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
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { EuiCodeEditor, EuiCodeEditorProps, EuiFormRow } from "@elastic/eui";

export interface JSONEditorProps extends Partial<EuiCodeEditorProps> {
  disabled?: boolean;
  value: string;
  onChange?: (value: JSONEditorProps["value"]) => void;
}

export interface IJSONEditorRef {
  validate: () => Promise<string>;
  getValue: () => string;
  setValue: (val: string) => void;
}

const JSONEditor = forwardRef(({ value, onChange, disabled, ...others }: JSONEditorProps, ref: React.Ref<IJSONEditorRef>) => {
  const [tempEditorValue, setTempEditorValue] = useState(value);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const valueRef = useRef(tempEditorValue);
  valueRef.current = tempEditorValue;

  useEffect(() => {
    setTempEditorValue(value);
  }, [value]);

  useImperativeHandle(ref, () => ({
    validate: () =>
      new Promise((resolve, reject) => {
        try {
          JSON.parse(tempEditorValue);
          setConfirmModalVisible(false);
          resolve("");
        } catch (e) {
          setConfirmModalVisible(true);
          reject("Format validate error");
        }
      }),
    getValue: () => valueRef.current,
    setValue: (val) => setTempEditorValue(val),
  }));

  return (
    <>
      <textarea
        readOnly
        style={{ display: "none" }}
        value={tempEditorValue}
        data-test-subj={`${others["data-test-subj"] || "jsonEditor"}-valueDisplay`}
      />
      <EuiCodeEditor
        readOnly={disabled}
        {...others}
        style={{
          ...others.style,
          border: confirmModalVisible ? "1px solid red" : undefined,
        }}
        mode="json"
        value={tempEditorValue}
        onChange={setTempEditorValue}
        onBlur={() => {
          if (others.readOnly) {
            return;
          }
          try {
            JSON.parse(tempEditorValue);
            if (onChange) onChange(tempEditorValue);
            setConfirmModalVisible(false);
          } catch (e) {
            setConfirmModalVisible(true);
          }
        }}
      />
      {confirmModalVisible && (
        <EuiFormRow
          fullWidth
          isInvalid={confirmModalVisible}
          error="Your input does not match the validation of json format, please fix the error line with error aside."
        >
          <></>
        </EuiFormRow>
      )}
    </>
  );
});

export default JSONEditor;
