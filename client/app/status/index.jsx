import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import perfLogger from 'redux-perf-middleware';
import StatusFrame from './StatusFrame';
import { statusReducer, mapDataToInitialState } from './reducers';
import { getReduxAnalyticsMiddleware } from '../util/getReduxAnalyticsMiddleware';

const Intake = (props) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const initialState = mapDataToInitialState(props);

  const store = createStore(
    statusReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, perfLogger, getReduxAnalyticsMiddleware('status')))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextStatusReducer = require('./reducers');
      store.replaceReducer(nextStatusReducer);
    });
  }

  return <Provider store={store}>
    <StatusFrame {...props} />
  </Provider>;
};

export default Intake;
