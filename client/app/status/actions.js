import { ACTIONS } from './constants';
import ApiUtil from '../util/ApiUtil';

const analytics = true;

export const setFileNumberSearch = (fileNumber) => ({
  type: ACTIONS.SET_FILE_NUMBER_SEARCH,
  payload: {
    fileNumber
  }
});

export const doFileNumberSearch = (fileNumberSearch) => (dispatch) => {
  dispatch({
    type: ACTIONS.FILE_NUMBER_SEARCH_START,
    meta: { analytics }
  });

  const data = {
    file_number: fileNumberSearch
  };

  return ApiUtil.post('/status', { data }).
    then(
      (response) => {
        const responseObject = JSON.parse(response.text);

        dispatch({
          type: ACTIONS.FILE_NUMBER_SEARCH_SUCCEED,
          payload: {
            appealHistory: responseObject
          },
          meta: { analytics }
        });
      },
      (error) => {
        dispatch({
          type: ACTIONS.FILE_NUMBER_SEARCH_FAIL,
          payload: {
            error: error.status
          },
          meta: {
            analytics: {
              label: error.status
            }
          }
        });

        throw error;
      }
    );
};
