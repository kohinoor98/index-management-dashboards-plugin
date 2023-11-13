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

// Code from https://github.com/elastic/eui
// Used under the Apache-2.0 license.

import React, { Component } from "react";
import { EuiSuperDatePicker } from "@elastic/eui";
import AsyncInterval from "./AsyncInterval";

interface EuiRefreshPickerProps {
  isPaused: boolean;
  refreshInterval: number;
  onRefresh: Function;
  onRefreshChange: Function;
}

// Some of this code is from EUI library, but cannot be used until we are at 7.2+
// This is a temporary import for 7.0 and 7.1
export default class EuiRefreshPicker extends Component<EuiRefreshPickerProps> {
  asyncInterval: AsyncInterval | undefined;

  componentDidMount = () => {
    if (!this.props.isPaused) {
      this.startInterval(this.props.refreshInterval);
    }
  };

  componentWillUnmount = () => {
    this.stopInterval();
  };

  onRefreshChange = ({ refreshInterval, isPaused }: { refreshInterval: number; isPaused: boolean }) => {
    this.stopInterval();
    if (!isPaused) {
      this.startInterval(refreshInterval);
    }
    if (this.props.onRefreshChange) {
      this.props.onRefreshChange({ refreshInterval, isPaused });
    }
  };

  stopInterval = () => {
    if (this.asyncInterval) {
      this.asyncInterval.stop();
    }
  };

  startInterval = (refreshInterval: number) => {
    const { onRefresh } = this.props;
    if (onRefresh) {
      const handler = () => {
        onRefresh({ refreshInterval });
      };
      this.asyncInterval = new AsyncInterval(handler, refreshInterval);
    }
  };

  // Current version of EuiSuperDatePicker requires onTimeChange even if we don't use it
  onTimeChange = () => {};

  render() {
    return (
      <EuiSuperDatePicker
        isAutoRefreshOnly
        isPaused={this.props.isPaused}
        refreshInterval={this.props.refreshInterval}
        onRefreshChange={this.onRefreshChange}
        onTimeChange={this.onTimeChange}
      />
    );
  }
}
