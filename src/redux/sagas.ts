import { takeEvery, put } from 'redux-saga/effects';
import { ActionTypes, TestAction, TestSuccessAction } from './actions';

export default function* rootSaga() {
  yield takeEvery(ActionTypes.TEST, test);
}

function* test(action: TestAction) {
  console.log(action);
  yield put(new TestSuccessAction({}));
}