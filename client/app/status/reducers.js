import { ACTIONS, REQUEST_STATE } from './constants';
import { update } from '../util/ReducerUtil';

export const mapDataToInitialState = (data = {}) => {
  return Object.assign({
    fileNumberSearch: '',
    requests: {
      fileNumberSearch: {
        status: REQUEST_STATE.NOT_STARTED,
        error: null
      },
      cancel: {
        status: REQUEST_STATE.NOT_STARTED,
        error: null
      }
    },
    appealHistory: null
  }, data);
};

export const statusReducer = (state = mapDataToInitialState(), action) => {
  switch (action.type) {
  case ACTIONS.SET_FILE_NUMBER_SEARCH:
    return update(state, {
      fileNumberSearch: {
        $set: action.payload.fileNumber
      }
    });
  case ACTIONS.FILE_NUMBER_SEARCH_START:
    return update(state, {
      requests: {
        fileNumberSearch: {
          status: {
            $set: REQUEST_STATE.IN_PROGRESS
          }
        }
      }
    });
  case ACTIONS.FILE_NUMBER_SEARCH_SUCCEED:
    return update(state, {
      requests: {
        fileNumberSearch: {
          status: {
            $set: REQUEST_STATE.SUCCEEDED
          }
        }
      },
      appealHistory: {
        $set: action.payload.appealHistory
      }
    });
  case ACTIONS.FILE_NUMBER_SEARCH_FAIL:
    return update(state, {
      requests: {
        fileNumberSearch: {
          status: {
            $set: REQUEST_STATE.FAILED
          },
          error: {
            $set: action.payload.error
          }
        }
      }
    });
  default:
    return state;
  }
};
