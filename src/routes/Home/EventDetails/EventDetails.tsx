import React from 'react';
import styles from './EventDetails.module.scss';
import dayjs from 'dayjs';
import _ from 'lodash';
import {  Button } from '@material-ui/core';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { GetOutcomesAction, SocketSendAction } from '../../../redux/actions';
import StandardOutcome from '../OutcomeTemplates/StandardOutcome';
import CorrectScore from '../OutcomeTemplates/CorrectScore';

class EventDetails extends React.PureComponent<any, any> {
  public state = {
    areMarketsFetched: false,
    sortedMarkets: [],
  };

  public componentDidMount(): void {
    this.props.getEvent();
  }

  public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
    if (!this.state.areMarketsFetched && _.size(this.props.event.fetchedMarkets) === this.props.event.markets.length) {
      const sortedMarkets = _.sortBy(this.props.event.fetchedMarkets, ['displayOrder', 'name']);
      _(sortedMarkets).slice(0, 10).each((market: any) => {
        this.props.getOutcomesForMarket(market);
      });
      this.setState({
        areMarketsFetched: true,
        sortedMarkets
      });
    }
  }

  public render() {
    const {
      event,
      fractionFormat,
      handleClose,
    } = this.props;
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
          { _(this.state.sortedMarkets)
              .filter((market: any) => market.status.displayable)
              .value()
              .map((market: any, index: number) => {
                  if (market.type === 'correct-score') {
                    return (
                      <CorrectScore
                        key={`__market-${index}`}
                        fractionFormat={fractionFormat}
                        fetchMarketOutcomes={this.fetchMarketOutcomes}
                        market={event.fetchedMarkets[market.marketId]}
                      />
                    )
                  } else {
                    return (
                      <StandardOutcome
                        key={`__market-${index}`}
                        fractionFormat={fractionFormat}
                        fetchMarketOutcomes={this.fetchMarketOutcomes}
                        market={event.fetchedMarkets[market.marketId]}
                      />
                    )
                  }
                }
              )
          }
        </div>
      </div>
    )
  }

  private fetchMarketOutcomes = (market: any) => {
    this.props.getOutcomesForMarket(market);
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
    // test: () => {
    //   dispatch({
    //     type: 'OUTCOME_STATUS',
    //     data: {
    //       eventId: 21249937,
    //       marketId: 93648928,
    //       outcomeId: 367527446,
    //       // price: {
    //       //   num: 999,
    //       //   den: 888,
    //       //   decimal: 5
    //       // },
    //       status: {
    //         suspended: false,
    //         displayable: true,
    //       }
    //     }
    //   })
    // },
    getOutcomesForMarket: (market: any) => {
      dispatch(new GetOutcomesAction(market));
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);