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

import { Legacy } from "opensearch-dashboards";
import ismPlugin from "./ismPlugin";
import { CLUSTER, DEFAULT_HEADERS } from "../../utils/constants";

type Server = Legacy.Server;

export default function createISMCluster(server: Server) {
  const { customHeaders, ...rest } = server.config().get("opensearch");
  server.plugins.opensearch.createCluster(CLUSTER.ISM, {
    plugins: [ismPlugin],
    customHeaders: { ...customHeaders, ...DEFAULT_HEADERS },
    ...rest,
  });
}
