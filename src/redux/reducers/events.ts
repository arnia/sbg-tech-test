const initialState = {
  websocketConnected: false,
  displayPrimaryMarkets: false,
  liveEvents: {},
};

export default function(state: any = initialState, action: any) {
  switch (action.type) {
    case 'LIVE_EVENTS_DATA': {
      return Object.assign({}, {
        ...state,
        liveEvents: action.data.reduce((events: any, event: any) => {
          events[event.eventId] = event;
          return events;
        }, {})
      });
    }
    case 'MARKET_DATA': {
      let affectedEvent = state.liveEvents[action.data.eventId];
      const updatedMarkets = affectedEvent.fetchedMarkets || {};
      updatedMarkets[action.data.marketId] = action.data;
      affectedEvent = {
        ...affectedEvent,
        fetchedMarkets: updatedMarkets,
      };
      return Object.assign({}, {
        ...state,
        liveEvents: {
          ...state.liveEvents,
          [action.data.eventId]: affectedEvent
        }
      });
    }
    case 'OUTCOME_DATA': {
      const { eventId, marketId, outcomeId } = action.data;
      const affectedMarket = state.liveEvents[eventId].fetchedMarkets[marketId];
      const updatedOutcomes = affectedMarket.fetchedOutcomes || {};
      updatedOutcomes[action.data.outcomeId] = action.data;
      return Object.assign({}, {
        ...state,
        liveEvents: {
          ...state.liveEvents,
          [eventId]: {
            ...state.liveEvents[eventId],
            fetchedMarkets: {
              ...state.liveEvents[eventId].fetchedMarkets,
              [action.data.marketId]: {
                ...state.liveEvents[eventId].fetchedMarkets[marketId],
                fetchedOutcomes: {
                  ...state.liveEvents[eventId].fetchedMarkets[marketId].fetchedOutcomes,
                  [outcomeId]: action.data
                }
              }
            }
          }
        }
      });
    }
    case 'PRICE_CHANGE': {
      const { eventId, marketId, outcomeId } = action.data;
      const affectedOutcome = state.liveEvents[eventId].fetchedMarkets[marketId].fetchedOutcomes[outcomeId];
      affectedOutcome.price = action.data.price;
      return Object.assign({}, {
        ...state,
        liveEvents: {
          ...state.liveEvents,
          [eventId]: {
            ...state.liveEvents[eventId],
            fetchedMarkets: {
              ...state.liveEvents[eventId].fetchedMarkets,
              [action.data.marketId]: {
                ...state.liveEvents[eventId].fetchedMarkets[marketId],
                fetchedOutcomes: {
                  ...state.liveEvents[eventId].fetchedMarkets[marketId].fetchedOutcomes,
                  [outcomeId]: {
                    ...affectedOutcome,
                    changed: true
                  }
                }
              }
            }
          }
        }
      });
    }
    case 'WEBSOCKET_CONNECTED': {
      return Object.assign({}, {
        ...state,
        websocketConnected: true
      });
    }
    case 'SOCKET_SEND': {
      if (action.payload.type === 'getLiveEvents') {
        return Object.assign({}, {
          ...state,
          displayPrimaryMarkets: action.payload.primaryMarkets
        })
      }
      return state;
    }
    default: {
      return state;
    }
  }
}