import { put, call, take, race, all, takeEvery, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ActionTypes, GetOutcomesAction, GetPrimaryMarketsAction } from './actions';
import { displayPrimaryMarketsSelector } from './selectors';

export default function* rootWebsocketSaga() {
  yield takeEvery(ActionTypes.START_WEBSOCKET, startWebsocket);
}

function* startWebsocket() {
  const socket = new WebSocket('ws://localhost:8889');
  while (true) {
    const socketChannel = yield call(handleUpdates, socket);
    const { cancel } = yield race({
      task: all([call(externalListener, socketChannel), call(internalListener, socket)]),
      cancel: take(ActionTypes.CLOSE_WEBSOCKET),
    });
    if (cancel) {
      socketChannel.close();
    }
  }
}

function handleUpdates(socket: any) {
  return eventChannel((emit: any) => {
    socket.onopen = () => {
      console.log('opening...');
      return emit({type: 'WEBSOCKET_CONNECTED'});
    };

    socket.onmessage = (e: any) => {
      return emit(JSON.parse(e.data));
    };

    return () => {
      console.log('close channel');
      socket.close();
    }
  });
}

function* internalListener(socket: any) {
  while (true) {
    const data = yield take(ActionTypes.SOCKET_SEND);
    console.log('internal socket send', data.payload);
    socket.send(JSON.stringify(data.payload));
  }
}

function* externalListener(socketChannel: any) {
  while (true) {
    const action = yield take(socketChannel);
    switch (action.type) {
      case 'WEBSOCKET_CONNECTED': {
        yield put({type: 'WEBSOCKET_CONNECTED'});
        break;
      }
      case 'LIVE_EVENTS_DATA': {
        const displayPrimaryMarkets = yield select(displayPrimaryMarketsSelector());
        yield put(action);
        if (displayPrimaryMarkets) {
          yield put(new GetPrimaryMarketsAction(action.data))
        }
        break;
      }
      case 'MARKET_DATA': {
        yield put(action);
        yield put(new GetOutcomesAction(action.data));
        break;
      }
      case 'OUTCOME_DATA': {
        yield put(action);
        break;
      }
      default: {
        console.log('external action', action);
        yield put(action);
      }
    }
  }
}
