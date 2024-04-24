// @ts-nocheck
import {FORM_ERROR, SubmissionErrors} from 'final-form';
import {isEmpty} from 'lodash';
import dot from 'dot-object';

export type FormSubmitResponse<T> =
  | { errors: SubmissionErrors; response: null }
  | { errors: null; response: T };

export const handleFormSubmit = async <T>(request: Promise<T>): Promise<FormSubmitResponse<T>> => {
  try {
    const response = await request;
    return { response: response, errors: null };
  } catch (err) {
    if (!err.response || !err.response.data) {
      return {
        response: null,
        errors: { [FORM_ERROR]: 'Server side error. Please contact the support.' },
      };
    }
    return { errors: dot.object(errorProcess(err.response.data)), response: null };
  }
};

function matchStringifiedArrayOfEntities(
  string: string
): { arrayName: string; index: number; itemName: string } | null {
  const match = string.match(/(.+)\[(\d+)]\.(.+)/i);

  return match ? { arrayName: match[1], index: parseInt(match[2]), itemName: match[3] } : null;
}

function errorProcess(responseData) {
  if (responseData.code && responseData.code === 401) {
    return { [FORM_ERROR]: responseData.message };
  }
  const res = {};
  if (responseData && responseData.violations) {
    for (const list of responseData.violations) {
      if (list.propertyPath) {
        const match = matchStringifiedArrayOfEntities(list.propertyPath);
        if (match) {
          const realArray: Array<{}> = [];
          if (match.index > 0) {
            for (let i = 0; i < match.index; i++) {
              realArray.push({});
            }
          }
          realArray.push({ [match.itemName]: list.message });
          res[match.arrayName] = realArray;
        } else {
          res[list.propertyPath] = list.message;
        }
      } else {
        res[FORM_ERROR] = list.message;
      }
    }
    if (isEmpty(res)) {
      res[FORM_ERROR] = responseData['reason']; // old: hydra:description
    }
  } else if (responseData && responseData.error) {
    res[FORM_ERROR] = 'Server side error. Please contact the support.';
  } else if (responseData && responseData['reason']) {
    res[FORM_ERROR] = responseData['reason'];
  }

  return isEmpty(res) ? null : res;
}

export const hasError = (field: any, skipTouched = false) => {
  return (field.meta?.touched || skipTouched) && (field.meta?.error || field.meta?.submitError);
};

export const showError = (field: any) => {
  return field.meta?.error || field.meta?.submitError;
};
