import React from 'react';
import styles from './LiveEventList.module.scss';
import {
  Collapse,
  Dialog,
} from '@material-ui/core';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Dispatch } from 'redux';
import {
  displayPrimaryMarketsSelector,
  eventSelector,
  priceFormatSelector,
} from '../../../redux/selectors';
import { connect } from 'react-redux';
import _ from 'lodash';
import EventDetails from '../EventDetails';
import { ClearNonPrimarySubscriptionsAction, GetOutcomesAction } from '../../../redux/actions';

class Event extends React.PureComponent<any, any> {
  public state = {
    expandedMarket: false,
    showEventDetails: false,
    areMarketsFetched: false,
  };

  public componentDidUpdate() {
    if (!this.state.areMarketsFetched && _.size(this.props.event.fetchedMarkets) === this.props.event.markets.length) {
      const { event, getOutcomesForMarket } = this.props;
      const primaryMarket =  event.fetchedMarkets[event.primaryMarket];
      getOutcomesForMarket(primaryMarket);
      this.setState({
        areMarketsFetched: true,
      });
    }
  }

  public render() {
    const {
      event,
      displayMarket,
      fractionFormat,
    } = this.props;
    const {
      expandedMarket,
      showEventDetails,
    } = this.state;
    const primaryMarket = event.fetchedMarkets && event.fetchedMarkets[event.primaryMarket];
    // const firstMarket = event.fetchedMarkets && Object.keys(event.fetchedMarkets)[0] && event.fetchedMarkets[Object.keys(event.fetchedMarkets)[0]];
    return (
      <div className={styles.eventWrapper}>
        <div className={styles.eventInfo} onClick={this.openEventDetails}>
          <div className={classNames({
            [styles.eventStartTime]: true,
            'styles.started': event.status.started
          })}>
            {dayjs(event.startTime).format('HH:mm')}
          </div>
          <div className={styles.eventName}>
            {event.name}
          </div>
        </div>
        { displayMarket && primaryMarket &&
          <div className={styles.eventMarket}>
            <div className={styles.marketName} onClick={this.toggleMarketDisplay}>
              {primaryMarket.name}
            </div>
            <Collapse in={!expandedMarket} timeout={0}>
              {_.map(primaryMarket.fetchedOutcomes, (outcome, index) => (
                <div className={styles.marketOutcome} key={`__outcome-${index}`}>
                  <div className={styles.outcomeName}>
                    {outcome.name}
                  </div>
                  <div className={styles.outcomePrice}>
                    { fractionFormat === 'fraction'
                      ? `${outcome.price.num}/${outcome.price.den}`
                      : `${outcome.price.decimal}`
                    }
                  </div>
                </div>
              ))}
            </Collapse>
          </div>
        }
        <Dialog open={showEventDetails}
                onClose={this.hideEventDetails}
                // fullWidth={true}
                // maxWidth={'lg'}
                fullScreen={true}
        >
          <EventDetails
            event={event}
            handleClose={this.hideEventDetails}
            fractionFormat={fractionFormat}
          />
        </Dialog>
      </div>
    );
  }

  private openEventDetails = () => {
    this.setState({
      showEventDetails: true
    });
  };

  private hideEventDetails = () => {
    this.setState({
      showEventDetails: false
    });
    this.props.clearSubscriptions();
  };

  private toggleMarketDisplay = () => {
    this.setState({
      expandedMarket: !this.state.expandedMarket
    });
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getOutcomesForMarket: (market: any) => {
      dispatch(new GetOutcomesAction(market));
    },
    // test: () => {
    //   dispatch({
    //     type: 'PRICE_CHANGE',
    //     data: {
    //       eventId: 21249937,
    //       marketId: 93649011,
    //       outcomeId: 367527714,
    //       price: {
    //         num: 999,
    //         den: 888,
    //         decimal: 5
    //       }
    //     }
    //   })
    // }
    clearSubscriptions: () => {
      dispatch(new ClearNonPrimarySubscriptionsAction());
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    event: eventSelector(ownProps.eventId)(state),
    displayMarket: displayPrimaryMarketsSelector()(state),
    fractionFormat: priceFormatSelector()(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Event);