import { takeEvery, all, call, put, select } from 'redux-saga/effects';
import { ActionTypes, GetOutcomesAction, GetMarketsAction, SocketSendAction } from './actions';
import { nonPrimaryMarketsSelector } from './selectors';

export default function* rootSaga() {
  yield takeEvery(ActionTypes.GET_MARKETS, getMarkets);
  yield takeEvery(ActionTypes.GET_OUTCOMES, getOutcomesOfMarket);
  yield takeEvery(ActionTypes.CLEAR_NON_PRIMARY_SUBSCRIPTIONS, clearNonPrimarySubscriptions);
}

function* getMarkets(action: GetMarketsAction) {
  const markets: number[] = [];
  action.payload.events.forEach((event: any) => {
    event.markets.forEach((market: any) => {
      markets.push(market);
    });
  });

  yield all(markets.map((market: any) => call(fetchMarket, {
    market,
    withSub: action.payload.withSub
  })));
}

function* getOutcomesOfMarket(action: GetOutcomesAction) {
  yield all(action.payload.outcomes.map((sub: any) => call(fetchOutcome, sub)));
  yield call(subscribeToMarket, action.payload);
}

function* fetchOutcome(outcome: any) {
  yield put(new SocketSendAction({
    type: 'getOutcome',
    id: outcome,
  }));
}

function* fetchMarket(action: any) {
  yield put(new SocketSendAction({
    type: 'getMarket',
    id: action.market,
  }));
  if (action.withSub) {
    yield call(subscribeToMarket, action.market);
  }
}

function* subscribeToMarket(market: any) {
  yield put(new SocketSendAction({
    type: 'subscribe',
    keys: [`m.${market}`],
    clearSubscription: false
  }));
}

function* unsubscribeFromMarkets(markets: any) {
  yield put(new SocketSendAction({
    type: 'unsubscribe',
    keys: markets,
  }));
}

function* clearNonPrimarySubscriptions() {
  const nonPrimaryMarkets = yield select(nonPrimaryMarketsSelector());
  yield call(unsubscribeFromMarkets, nonPrimaryMarkets);
}

