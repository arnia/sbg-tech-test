import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers';
import rootSaga from './sagas';
import rootWebsocketSaga from './websocketSagas';
import reduxClassActionMiddleware from '../utils/classActionMiddleware';

const sagaMiddleware = createSagaMiddleware();
const websocketSagaMiddleware = createSagaMiddleware();

export default createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      reduxClassActionMiddleware,
      sagaMiddleware,
      websocketSagaMiddleware,
    ),
  ),
);

sagaMiddleware.run(rootSaga);
websocketSagaMiddleware.run(rootWebsocketSaga);