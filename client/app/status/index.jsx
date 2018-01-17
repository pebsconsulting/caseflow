import React from 'react';
import StatusFrame from './StatusFrame';
import { statusReducer, mapDataToInitialState } from './reducers';
import ReduxBase from '@department-of-veterans-affairs/appeals-frontend-toolkit/components/ReduxBase';

class Status extends React.PureComponent {
  render() {
    const initialState = mapDataToInitialState(this.props);

    return <ReduxBase initialState={initialState} reducer={statusReducer} analyticsMiddlewareArgs={['status']}>
      <StatusFrame {...this.props} />
    </ReduxBase>;
  }
}

export default Status;
