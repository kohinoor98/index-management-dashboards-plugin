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

import moment from "moment";
import { FieldItem } from "../../../../models/interfaces";
import { COMPARISON_OPERATORS } from "./constants";

const timeunits = {
  isMilliseconds(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "milliseconds" || stringToCheck.trim().toLowerCase() === "ms";
  },
  isSeconds(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "seconds" || stringToCheck.trim().toLowerCase() === "s";
  },
  isMinutes(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "minutes" || stringToCheck.trim() === "m";
  },
  isHours(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "hours" || stringToCheck.trim().toLowerCase() === "h";
  },
  isDays(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "days" || stringToCheck.trim().toLowerCase() === "d";
  },
  isWeeks(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "weeks" || stringToCheck.trim().toLowerCase() === "w";
  },
  isMonths(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "months" || stringToCheck.trim() === "M";
  },
  isQuarters(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "quarters" || stringToCheck.trim().toLowerCase() === "q";
  },
  isYears(stringToCheck: string): boolean {
    return stringToCheck.trim().toLowerCase() === "years" || stringToCheck.trim().toLowerCase() === "y";
  },
} as const;

export const buildIntervalScheduleText = (continuous: boolean, interval: number, intervalTimeUnit: string): string => {
  let scheduleText = "";
  if (continuous) {
    scheduleText += "Continuous, every " + interval + " " + parseTimeunit(intervalTimeUnit);
  } else {
    scheduleText += "Not continuous";
  }
  return scheduleText;
};

export const buildCronScheduleText = (continuous: boolean, cronExpression: string): string => {
  let scheduleText = "";
  if (continuous) {
    scheduleText += "Continuous, defined by cron expression: " + cronExpression;
  } else {
    scheduleText += "Not continuous";
  }
  return scheduleText;
};

export const parseTimeunit = (timeunit: string): string => {
  if (timeunits.isMilliseconds(timeunit)) return "millisecond(s)";
  else if (timeunits.isSeconds(timeunit)) return "second(s)";
  else if (timeunits.isMinutes(timeunit)) return "minute(s)";
  else if (timeunits.isHours(timeunit)) return "hour(s)";
  else if (timeunits.isDays(timeunit)) return "day(s)";
  else if (timeunits.isWeeks(timeunit)) return "week";
  else if (timeunits.isMonths(timeunit)) return "month";
  else if (timeunits.isQuarters(timeunit)) return "quarter";
  else if (timeunits.isYears(timeunit)) return "year";

  return timeunit;
};

export const delayTimeUnitToMS = (delay: number, timeunit: string): number => {
  if (timeunits.isSeconds(timeunit)) {
    return moment.duration(delay, "seconds").asMilliseconds();
  } else if (timeunits.isMinutes(timeunit)) {
    return moment.duration(delay, "minutes").asMilliseconds();
  } else if (timeunits.isHours(timeunit)) {
    return moment.duration(delay, "hours").asMilliseconds();
  } else if (timeunits.isDays(timeunit)) {
    return moment.duration(delay, "days").asMilliseconds();
  } else {
    return delay;
  }
};

export const msToDelayTimeUnit = (delay: number, timeunit: string): number => {
  if (timeunits.isSeconds(timeunit)) {
    return moment.duration(delay, "milliseconds").asSeconds();
  } else if (timeunits.isMinutes(timeunit)) {
    return moment.duration(delay, "milliseconds").asMinutes();
  } else if (timeunits.isHours(timeunit)) {
    return moment.duration(delay, "milliseconds").asHours();
  } else if (timeunits.isDays(timeunit)) {
    return moment.duration(delay, "milliseconds").asDays();
  } else {
    return delay;
  }
};

// Returns true if field type is numeric
export const isNumericMapping = (fieldType: string | undefined): boolean => {
  return (
    fieldType === "long" ||
    fieldType === "integer" ||
    fieldType === "short" ||
    fieldType === "byte" ||
    fieldType === "double" ||
    fieldType === "float" ||
    fieldType === "half_float" ||
    fieldType === "scaled_float"
  );
};

export const compareFieldItem = (itemA: FieldItem, itemB: FieldItem): boolean => {
  return itemB.label === itemA.label && itemA.type === itemB.type && itemA.path === itemB.path;
};

export const parseFieldOptions = (prefix: string, mappings: any): FieldItem[] => {
  let fieldsOption: FieldItem[] = [];
  for (const field in mappings) {
    if (mappings.hasOwnProperty(field)) {
      if (mappings[field].type !== "object" && mappings[field].type != null && mappings[field].type !== "nested")
        fieldsOption.push({ label: prefix + field, type: mappings[field].type });
      if (mappings[field].fields != null)
        fieldsOption = fieldsOption.concat(parseFieldOptions(prefix + field + ".", mappings[field].fields));
      if (mappings[field].properties != null)
        fieldsOption = fieldsOption.concat(parseFieldOptions(prefix + field + ".", mappings[field].properties));
    }
  }
  return fieldsOption;
};

export const getOperators = (fieldType: string) =>
  COMPARISON_OPERATORS.reduce(
    (acc, currentOperator) =>
      currentOperator.dataTypes.includes(fieldType) ? [...acc, { text: currentOperator.text, value: currentOperator.value }] : acc,
    []
  );
