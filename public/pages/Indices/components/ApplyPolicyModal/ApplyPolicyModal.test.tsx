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
import { render, waitFor } from "@testing-library/react";
import ApplyPolicyModal from "./ApplyPolicyModal";
import { browserServicesMock, coreServicesMock, httpClientMock } from "../../../../../test/mocks";
import { CoreServicesContext } from "../../../../components/core_services";

// TODO: fireEvent for applyPolicy, but need to figure out how to get react-testing-library to work
//  with the combo_box in modal

describe("<ApplyPolicyModal /> spec", () => {
  it("renders the component", async () => {
    httpClientMock.post = jest.fn().mockResolvedValue({ ok: true, response: { policies: [{ policy: "some_policy", id: "some_id" }] } });
    render(<ApplyPolicyModal onClose={() => {}} services={browserServicesMock} indices={[]} />);

    // EuiOverlayMask appends an element to the body so we should have three (used to be two, after upgrading appears to have 3 now), an empty div from react-test-library
    // and our EuiOverlayMask element
    expect(document.body.children).toHaveLength(3);
    expect(document.body.children[2]).toMatchSnapshot();
  });

  it("successfully calls search policies on mount", async () => {
    httpClientMock.get = jest.fn().mockResolvedValue({ ok: true, response: { policies: [{ policy: "some_policy", id: "some_id" }] } });
    const spy = jest.spyOn(browserServicesMock.indexService, "searchPolicies");
    render(
      <CoreServicesContext.Provider value={coreServicesMock}>
        <ApplyPolicyModal onClose={() => {}} services={browserServicesMock} indices={[]} />
      </CoreServicesContext.Provider>
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("", true);
    expect(coreServicesMock.notifications.toasts.addDanger).not.toHaveBeenCalled();
  });

  it("adds danger toaster on safe error", async () => {
    httpClientMock.get = jest.fn().mockResolvedValue({ ok: false, error: "some error" });
    const spy = jest.spyOn(browserServicesMock.indexService, "searchPolicies");
    render(
      <CoreServicesContext.Provider value={coreServicesMock}>
        <ApplyPolicyModal onClose={() => {}} services={browserServicesMock} indices={[]} />
      </CoreServicesContext.Provider>
    );

    // wait 1 tick for the searchPolicies promise to resolve
    await waitFor(() => {});

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("", true);
    expect(coreServicesMock.notifications.toasts.addDanger).toHaveBeenCalledTimes(1);
    expect(coreServicesMock.notifications.toasts.addDanger).toHaveBeenCalledWith("some error");
  });

  it("adds danger toaster on unsafe error", async () => {
    httpClientMock.get = jest.fn().mockRejectedValue(new Error("testing error"));
    const spy = jest.spyOn(browserServicesMock.indexService, "searchPolicies");
    render(
      <CoreServicesContext.Provider value={coreServicesMock}>
        <ApplyPolicyModal onClose={() => {}} services={browserServicesMock} indices={[]} />
      </CoreServicesContext.Provider>
    );

    // wait 1 tick for the searchPolicies promise to resolve
    await waitFor(() => {});

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("", true);
    expect(coreServicesMock.notifications.toasts.addDanger).toHaveBeenCalledTimes(1);
    expect(coreServicesMock.notifications.toasts.addDanger).toHaveBeenCalledWith("testing error");
  });
});
