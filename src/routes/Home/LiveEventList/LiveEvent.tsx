import React from 'react';
import styles from './LiveEventList.module.scss';
import {
  Collapse
} from '@material-ui/core';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Dispatch } from 'redux';
import { displayPrimaryMarketsSelector, eventSelector } from '../../../redux/selectors';
import { connect } from 'react-redux';
import _ from 'lodash';

class Event extends React.PureComponent<any, any> {
  public state = {
    expandedMarket: false
  };

  public render() {
    const {
      event,
      displayMarket,
    } = this.props;
    const {
      expandedMarket
    } = this.state;
    // console.log('event', event);
    const firstMarket = event.fetchedMarkets && Object.keys(event.fetchedMarkets)[0] && event.fetchedMarkets[Object.keys(event.fetchedMarkets)[0]];
    return (
      <div className={styles.eventWrapper}>
        <div className={styles.eventInfo}>
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
        { displayMarket && firstMarket &&
          <div className={styles.eventMarket}>
            <div className={styles.marketName} onClick={this.toggleMarketDisplay}>
              {firstMarket.name}
            </div>
            <Collapse in={!expandedMarket} timeout={0}>
              {_.map(firstMarket.fetchedOutcomes, (outcome, index) => (
                <div className={styles.marketOutcome} key={`__outcome-${index}`}>
                  <div className={styles.outcomeName}>
                    {outcome.name}
                  </div>
                  <div className={styles.outcomePrice}>
                    {`${outcome.price.num}/${outcome.price.den}`}
                  </div>
                </div>
              ))}
            </Collapse>
          </div>
        }
      </div>
    );
  }

  private toggleMarketDisplay = () => {
    this.setState({
      expandedMarket: !this.state.expandedMarket
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
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
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    event: eventSelector(ownProps.eventId)(state),
    displayMarket: displayPrimaryMarketsSelector()(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Event);