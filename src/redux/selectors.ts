import { createSelector } from 'reselect';
import _ from 'lodash';

const reducerState = () => (state: any) => {
  return state;
};

export const eventsSelector = () => createSelector(
  reducerState(),
  (state) => {
    return Object.keys(state.events.liveEvents);
  }
);

export const eventSelector = (eventId: number) => createSelector(
  reducerState(),
  (state) => {
    return state.events.liveEvents[eventId];
  }
);
export const boostCounterSelector = () => createSelector(
  reducerState(),
  (state) => {
    return _.reduce(state.events.liveEvents, (sum: number, event: any) => {
      return sum + event.boostCount;
    }, 0);
  }
);


export const websocketConnectedSelector = () => createSelector(
  reducerState(),
  (state) => {
    return state.events.websocketConnected;
  }
);

export const displayPrimaryMarketsSelector = () => createSelector(
  reducerState(),
  (state) => {
    return state.events.displayPrimaryMarkets;
  }
);