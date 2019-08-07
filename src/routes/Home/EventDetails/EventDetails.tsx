import React from 'react';
import styles from './EventDetails.module.scss';
import eventStyles from '../LiveEventList/LiveEventList.module.scss';
import classNames from 'classnames';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Collapse, Button } from '@material-ui/core';
import { Dispatch } from 'redux';
import { eventSelector } from '../../../redux/selectors';
import { connect } from 'react-redux';
import { SocketSendAction } from '../../../redux/actions';

class EventDetails extends React.PureComponent<any, any> {
  public state = {
    expandedMarketId: null,
  };

  public componentDidMount(): void {
    this.props.getEvent();
  }

  public render() {
    const {
      event,
      fractionFormat,
      handleClose,
      completeEvent,
    } = this.props;
    const {
      expandedMarketId,
    } = this.state;
    // console.log('event', event, completeEvent);
    return (
      <div className={styles.eventDetailsWrapper}>
        <div className={styles.eventInfo}>
          <div className={styles.eventDetails}>
            <div className={styles.eventName}>
              {event.name}
            </div>
            <div className={styles.eventDeets}>
              Today at {dayjs(event.startTime).format('HH:mm')} | {event.linkedEventTypeName}
            </div>
          </div>
          <div className='spacer'/>
          <div className={styles.close}>
            <Button onClick={handleClose} color={'primary'} variant={'contained'}>
              Close
            </Button>
          </div>
          <div className='spacer'/>
          <div className={styles.scores}>
            { event.status.live &&
              <span>Live: {event.scores.home} - {event.scores.away}</span>
            }
          </div>
        </div>
        <div className={styles.markets}>
          <h4>Markets:</h4>
          { _.map(event.fetchedMarkets, (market, index: number) => (
            <div className={classNames(styles.eventMarket, eventStyles.eventMarket)} key={`__market-${index}`}>
              <div className={eventStyles.marketName} onClick={this.toggleMarketDisplay(market)}>
                {market.name}
              </div>
              <Collapse in={expandedMarketId === market.marketId} timeout={0}>
                {_.map(market.fetchedOutcomes, (outcome, index) => (
                  <div className={eventStyles.marketOutcome} key={`__outcome-${index}`}>
                    <div className={eventStyles.outcomeName}>
                      {outcome.name}
                    </div>
                    <div className={eventStyles.outcomePrice}>
                      { fractionFormat === 'fraction'
                        ? `${outcome.price.num}/${outcome.price.den}`
                        : `${outcome.price.decimal}`
                      }
                    </div>
                  </div>
                ))}
              </Collapse>
            </div>
            ))
          }
        </div>
      </div>
    )
  }

  private toggleMarketDisplay = (market: any) => () => {
    this.setState({
      expandedMarketId: this.state.expandedMarketId === market.marketId ? null : market.marketId
    });
  };
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => {
  return {
    getEvent: () => {
      dispatch(new SocketSendAction({
        type: "getEvent",
        id: ownProps.event.eventId
      }));
    },
    getOutcomesForMarket: (market: any) => {
      dispatch(new SocketSendAction({
        type: "getEvent",
        id: ownProps.event.eventId
      }));
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    completeEvent: eventSelector(ownProps.eventId)(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);