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
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter as Router } from "react-router-dom";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { browserServicesMock, coreServicesMock, apiCallerMock } from "../../../../../test/mocks";
import IndexDetail, { IndexDetailModalProps } from "./IndexDetail";
import { ModalProvider } from "../../../../components/Modal";
import { ServicesContext } from "../../../../services";
import { CoreServicesContext } from "../../../../components/core_services";

function renderWithRouter(props: Omit<IndexDetailModalProps, keyof RouteComponentProps>, initialEntries: string[]) {
  return {
    ...render(
      <Router initialEntries={initialEntries}>
        <CoreServicesContext.Provider value={coreServicesMock}>
          <ServicesContext.Provider value={browserServicesMock}>
            <ModalProvider>
              <Switch>
                <Route path="/:index" render={(routeProps) => <IndexDetail {...props} {...routeProps} />} />
              </Switch>
            </ModalProvider>
          </ServicesContext.Provider>
        </CoreServicesContext.Provider>
      </Router>
    ),
  };
}

describe("container <IndexDetail /> spec", () => {
  beforeEach(() => {
    apiCallerMock(browserServicesMock);
  });
  it("render the component", async () => {
    browserServicesMock.indexService.getIndices = jest.fn(() => {
      return {
        ok: true,
        response: {
          indices: [
            {
              "docs.count": "5",
              "docs.deleted": "2",
              health: "green",
              index: "test_index",
              pri: "1",
              "pri.store.size": "100KB",
              rep: "0",
              status: "open",
              "store.size": "100KB",
              uuid: "some_uuid",
              managed: "",
              managedPolicy: "",
              data_stream: "",
            },
          ],
        },
      } as any;
    }) as typeof browserServicesMock.indexService.getIndices;
    const { container, queryByText } = renderWithRouter({}, [`/test_index`]);

    await waitFor(() => {
      expect(container.firstChild).toMatchSnapshot();
      expect(browserServicesMock.commonService.apiCaller).toBeCalledTimes(1);
      expect(browserServicesMock.commonService.apiCaller).toBeCalledWith({
        endpoint: "indices.get",
        data: {
          index: "test_index",
        },
      });
    });

    userEvent.click(document.getElementById("indexDetailModalAlias") as Element);
    await waitFor(() => {
      expect(queryByText("Index alias")).not.toBeNull();
    });
  });
});
