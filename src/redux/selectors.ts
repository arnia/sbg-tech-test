import { createSelector } from 'reselect';

const reducerState = () => (state: any) => {
  return state;
};

export const eventsSelector = () => createSelector(
  reducerState(),
  (state) => {
    return state.events.liveEvents;
  }
);

export const websocketConnectedSelector = () => createSelector(
  reducerState(),
  (state) => {
    return state.events.websocketConnected;
  }
);