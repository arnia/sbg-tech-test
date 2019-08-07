import { createSelector } from 'reselect';
import _ from 'lodash';

const reducerState = () => (state: any) => {
  return state;
};

export const displayableEventsSelector = () => createSelector(
  reducerState(),
  (state) => {
    return Object.keys(state.events.liveEvents).filter((key: any) => {
      return state.events.liveEvents[key].status.displayable;
    });
  }
);

export const groupedDisplayableEventsSelector = () => createSelector(
  reducerState(),
  (state) => {
    return _(state.events.liveEvents)
      .filter((event: any) => event.status.displayable)
      .reduce((groups: any, event: any) => {
        if (event.linkedEventTypeName) {
          groups[event.linkedEventTypeName] = groups[event.linkedEventTypeName]
            ? [...groups[event.linkedEventTypeName], event.eventId]
            : [event.eventId]
        } else {
          groups[event.typeName] = groups[event.typeName]
            ? [...groups[event.typeName], event.eventId]
            : [event.eventId]
        }
        return groups;
      }, {});
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

export const nonPrimaryMarketsSelector = () => createSelector(
  reducerState(),
  (state) => {
    const primaryMarkets = state.events.primaryMarkets;
    const currentSubscriptions = state.events.currentSubscriptions;
    return _.difference(currentSubscriptions, primaryMarkets);
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

export const priceFormatSelector = () => createSelector(
  reducerState(),
  (state) => {
    return state.events.priceFormat;
  }
);
