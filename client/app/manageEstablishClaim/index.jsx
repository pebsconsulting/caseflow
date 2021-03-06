import React from 'react';
import ReduxBase from '@department-of-veterans-affairs/caseflow-frontend-toolkit/components/ReduxBase';
import ManageEstablishClaim from './ManageEstablishClaim';
import manageEstablishClaimReducer, { getManageEstablishClaimInitialState } from './reducers';

const ManageEstablishClaimWrapper = (props) => {
  const initialState = getManageEstablishClaimInitialState(props);

  return <ReduxBase reducer={manageEstablishClaimReducer} initialState={initialState}>
    <ManageEstablishClaim {...props} />
  </ReduxBase>;
};

export default ManageEstablishClaimWrapper;
