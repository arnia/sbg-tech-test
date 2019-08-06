import { takeEvery, all, call, put } from 'redux-saga/effects';
import { ActionTypes, GetOutcomesAction, GetPrimaryMarketsAction, SocketSendAction } from './actions';

export default function* rootSaga() {
  yield takeEvery(ActionTypes.GET_PRIMARY_MARKETS, getPrimaryMarkets);
  yield takeEvery(ActionTypes.GET_OUTCOMES, getOutcomes);
}

function* getPrimaryMarkets(action: GetPrimaryMarketsAction) {
  const markets: number[] = [];
  action.payload.forEach((event: any) => {
    event.markets.forEach((market: any) => {
      markets.push(market);
    });
  });
  yield all(markets.map((sub: any) => call(fetchMarket, sub)));
}

function* getOutcomes(action: GetOutcomesAction) {
  console.log('get outcomes', action);
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

