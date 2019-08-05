import { put, call, take, race, all, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ActionTypes } from './actions';

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
      return emit({type: 'WEBSOCKET_CONNECTED'})
    };

    socket.onmessage = (e: any) => {
      console.log('handleUpdates', e);
      return emit(e)
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
    console.log('internal', data);
    socket.send(JSON.stringify({ type: 'getLiveEvents', primaryMarkets: false }))
  }
}

function* externalListener(socketChannel: any) {
  while (true) {
    const action = yield take(socketChannel);
    if (action.type === 'WEBSOCKET_CONNECTED') {
      yield put({type: 'WEBSOCKET_CONNECTED'});
    } else {
      console.log('external action', JSON.parse(action.data));
      yield put(JSON.parse(action.data));
    }
  }
}
