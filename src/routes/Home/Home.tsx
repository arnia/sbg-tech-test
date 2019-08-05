import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SocketSendAction, SocketStartAction } from '../../redux/actions';
import { eventsSelector, websocketConnectedSelector } from '../../redux/selectors';

import LiveEventsList from './LiveEventList';
import homeStyles from './Home.module.scss';

interface IHomeProps {
  liveEvents?: any[];
  websocketConnected?: boolean;
  subscribeToLiveEvents: () => void;
  startWebsocketConnection: () => void;
}

interface IHomeState {
  subscribedToLiveEvents: boolean;
}

class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      subscribedToLiveEvents: false
    };
  }

  public componentDidMount(): void {
    const {
      startWebsocketConnection,
    } = this.props;
    startWebsocketConnection();
  }

  public componentDidUpdate(prevProps: Readonly<IHomeProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const {
      subscribeToLiveEvents,
      websocketConnected,
    } = this.props;
    if (websocketConnected && !this.state.subscribedToLiveEvents) {
      this.setState({
        subscribedToLiveEvents: true
      });
      subscribeToLiveEvents();
    }
  }

  public render() {
    const { liveEvents } = this.props;
    console.log('live', liveEvents);
    return (
      <div className={homeStyles.homeContainer}>
        <LiveEventsList events={liveEvents}/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    subscribeToLiveEvents: () => {
      dispatch(new SocketSendAction({}));
    },
    startWebsocketConnection: () => {
      dispatch(new SocketStartAction({}))
    }
  };

};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    liveEvents: eventsSelector()(state),
    websocketConnected: websocketConnectedSelector()(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);