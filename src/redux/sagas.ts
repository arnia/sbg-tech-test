import { takeEvery, all, call, put, select } from 'redux-saga/effects';
import { ActionTypes, GetOutcomesAction, GetMarketsAction, SocketSendAction } from './actions';
import { nonPrimaryMarketsSelector } from './selectors';

export default function* rootSaga() {
  yield takeEvery(ActionTypes.GET_MARKETS, getMarkets);
  yield takeEvery(ActionTypes.GET_OUTCOMES, getOutcomes);
  yield takeEvery(ActionTypes.CLEAR_NON_PRIMARY_SUBSCRIPTIONS, clearNonPrimarySubscriptions);
}

function* getMarkets(action: GetMarketsAction) {
  const markets: number[] = [];
  action.payload.forEach((event: any) => {
    event.markets.forEach((market: any) => {
      markets.push(market);
    });
  });

  yield all(markets.map((sub: any) => call(fetchMarket, sub)));
}

function* getOutcomes(action: GetOutcomesAction) {
  yield all(action.payload.outcomes.map((sub: any) => call(fetchOutcome, sub)));
}

function* fetchOutcome(outcome: any) {
  yield put(new SocketSendAction({
    type: 'getOutcome',
    id: outcome,
  }));
}

function* fetchMarket(market: any) {
  yield put(new SocketSendAction({
    type: 'getMarket',
    id: market,
  }));
  yield call(subscribeToMarket, market);
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

