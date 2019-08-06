import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SocketSendAction, SocketStartAction } from '../../redux/actions';
import { websocketConnectedSelector } from '../../redux/selectors';
import skybetLogo from '../../assets/skybet.png'

import LiveEventsList from './LiveEventList';
import homeStyles from './Home.module.scss';

interface IHomeProps {
  liveEvents?: any[];
  websocketConnected?: boolean;
  subscribeToLiveEvents: (primaryMarkets?: boolean) => void;
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
    return (
      <div className={homeStyles.homeContainer}>
        <div className={homeStyles.header}>
          <img src={skybetLogo} alt="skybet-logo"/>
        </div>
        <LiveEventsList
          togglePrimaryMarketDisplay={this.togglePrimaryMarketDisplay}
        />
      </div>
    )
  }

  private togglePrimaryMarketDisplay = (displayPrimaryMarkets: boolean) => {
    this.props.subscribeToLiveEvents(displayPrimaryMarkets);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    subscribeToLiveEvents: (primaryMarkets: boolean = false) => {
      dispatch(new SocketSendAction({
        type: "getLiveEvents",
        primaryMarkets
      }));
    },
    startWebsocketConnection: () => {
      dispatch(new SocketStartAction({}))
    }
  };

};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    websocketConnected: websocketConnectedSelector()(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);