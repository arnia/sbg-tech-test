export const ActionTypes = {
  'TOGGLE_PRIMARY_MARKET_DISPLAY': 'TOGGLE_PRIMARY_MARKET_DISPLAY',
  'GET_MARKETS': 'GET_MARKETS',
  'GET_PRIMARY_MARKETS_SUCCESS': 'GET_PRIMARY_MARKETS_SUCCESS',
  'GET_OUTCOMES': 'GET_OUTCOMES',
  'SOCKET_SEND': 'SOCKET_SEND',
  'START_WEBSOCKET': 'START_WEBSOCKET',
  'CLOSE_WEBSOCKET': 'CLOSE_WEBSOCKET',
  'TOGGLE_PRICE_FORMAT': 'TOGGLE_PRICE_FORMAT',
  'SAVE_PRIMARY_MARKETS': 'SAVE_PRIMARY_MARKETS',
  'CLEAR_NON_PRIMARY_SUBSCRIPTIONS': 'CLEAR_NON_PRIMARY_SUBSCRIPTIONS',
};

export class TogglePrimaryMarketDisplayAction {
  public readonly type = ActionTypes.TOGGLE_PRIMARY_MARKET_DISPLAY;

  constructor(
    public payload: boolean
  ) {}
}

export class SocketSendAction {
  public readonly type = ActionTypes.SOCKET_SEND;

  constructor(
    public payload: any
  ) {}
}

export class SocketStartAction {
  public readonly type = ActionTypes.START_WEBSOCKET;

  constructor(
    public payload: any
  ) {}
}

export class SocketCloseAction {
  public readonly type = ActionTypes.CLOSE_WEBSOCKET;

  constructor(
    public payload: any
  ) {}
}

export class GetMarketsAction {
  public readonly type = ActionTypes.GET_MARKETS;

  constructor(
    public payload: any[]
  ) {}
}

export class GetOutcomesAction {
  public readonly type = ActionTypes.GET_OUTCOMES;

  constructor(
    public payload: any
  ) {}
}

export class TogglePriceFormatAction {
  public readonly type = ActionTypes.TOGGLE_PRICE_FORMAT;

  constructor(
    public payload: any
  ) {}
}

export class SavePrimaryMarketsAction {
  public readonly type = ActionTypes.SAVE_PRIMARY_MARKETS;

  constructor(
    public payload: any[]
  ) {}
}

export class ClearNonPrimarySubscriptionsAction {
  public readonly type = ActionTypes.CLEAR_NON_PRIMARY_SUBSCRIPTIONS;

  // constructor(
  //   public payload: any[]
  // ) {}
}