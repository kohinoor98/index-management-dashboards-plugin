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
import { EuiButton, EuiSpacer, EuiText } from "@elastic/eui";
import React from "react";
import { Modal } from "../../components/Modal";

export const ErrorToastContentForJob = (props: { shortError?: React.ReactChild; fullError?: React.ReactChild }) => {
  const { shortError = null, fullError } = props;
  return (
    <div>
      <div>{shortError}</div>
      {fullError ? (
        <>
          <EuiSpacer />
          <EuiButton
            onClick={
              /* istanbul ignore next */ () => {
                Modal.show({
                  locale: {
                    ok: "Close",
                  },
                  title: shortError || "",
                  content: (
                    <EuiText>
                      <div>{fullError}</div>
                    </EuiText>
                  ),
                });
              }
            }
            style={{ float: "right" }}
            color="danger"
          >
            See full error
          </EuiButton>
        </>
      ) : null}
    </div>
  );
};
