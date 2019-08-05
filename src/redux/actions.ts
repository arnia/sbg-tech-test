export const ActionTypes = {
  'TEST': 'TEST',
  'TEST_SUCCESS': 'TEST_SUCCESS',
  'SOCKET_SEND': 'SOCKET_SEND',
  'START_WEBSOCKET': 'START_WEBSOCKET',
  'CLOSE_WEBSOCKET': 'CLOSE_WEBSOCKET',
};

export class TestAction {
  public readonly type = ActionTypes.TEST;

  constructor(
    public payload: any
  ) {}
}

export class TestSuccessAction {
  public readonly type = ActionTypes.TEST_SUCCESS;

  constructor(
    public payload: any
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