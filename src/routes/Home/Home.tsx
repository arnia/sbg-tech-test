import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { SocketSendAction, SocketStartAction, TogglePriceFormatAction } from '../../redux/actions';
import { priceFormatSelector, websocketConnectedSelector } from '../../redux/selectors';
import skybetLogo from '../../assets/skybet.png'

import LiveEventsList from './LiveEventList';
import homeStyles from './Home.module.scss';

interface IHomeProps {
  liveEvents?: any[];
  websocketConnected?: boolean;
  priceFormat: string;
  getLiveEvents: (primaryMarkets?: boolean) => void;
  togglePriceFormat: (useFractionFormat?: string) => void;
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
      getLiveEvents,
      websocketConnected,
    } = this.props;
    if (websocketConnected && !this.state.subscribedToLiveEvents) {
      this.setState({
        subscribedToLiveEvents: true
      });
      getLiveEvents();
    }
  }

  public render() {
    return (
      <div className={homeStyles.homeContainer}>
        <div className={homeStyles.header} onClick={this.togglePriceFormat}>
          <img src={skybetLogo} alt="skybet-logo"/>
        </div>
        <LiveEventsList
          togglePrimaryMarketDisplay={this.togglePrimaryMarketDisplay}
        />
      </div>
    )
  }

  private togglePrimaryMarketDisplay = (displayPrimaryMarkets: boolean) => {
    this.props.getLiveEvents(displayPrimaryMarkets);
  };

  private togglePriceFormat = () => {
    const {
      priceFormat,
      togglePriceFormat
    } = this.props;
    const newPriceFormat = priceFormat === 'fraction' ? 'decimal' : 'fraction';
    localStorage.setItem('priceFormat', newPriceFormat);
    togglePriceFormat(newPriceFormat);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getLiveEvents: (primaryMarkets: boolean = true) => {
      dispatch(new SocketSendAction({
        type: "getLiveEvents",
        primaryMarkets
      }));
    },
    startWebsocketConnection: () => {
      dispatch(new SocketStartAction({}))
    },
    togglePriceFormat: (fractionFormat: string) => {
      dispatch(new TogglePriceFormatAction(fractionFormat))
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    websocketConnected: websocketConnectedSelector()(state),
    priceFormat: priceFormatSelector()(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);