import { createSelector } from 'reselect';
import _ from 'lodash';

const getAppeals = (state) => state.appealHistory.data

const getVacolsId = (_state, props) => props.vacolsId

export const makeGetActiveAppeal = () => {
  return createSelector(
    [getAppeals, getVacolsId],
    (appeals, vacolsId) => _.find(appeals, (appeal) => appeal.id === vacolsId)
  )
}
