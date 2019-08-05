

const initialState = {
  liveEvents: [],
  websocketConnected: false,
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case 'LIVE_EVENTS_DATA': {
      console.log('works', Object.assign({}, {
        ...state,
        liveEvents: action.data
      }));
      return Object.assign({}, {
        ...state,
        liveEvents: action.data
      });
    }
    case 'WEBSOCKET_CONNECTED': {
      return Object.assign({}, {
        ...state,
        websocketConnected: true
      });
    }
    default: {
      return state;
    }
  }
}