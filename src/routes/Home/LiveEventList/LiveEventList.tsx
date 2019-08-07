import styles from './LiveEventList.module.scss';
import React from 'react';
import Event from './LiveEvent';
import _ from 'lodash';
import {
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { Dispatch } from 'redux';
import { boostCounterSelector, displayableEventsSelector } from '../../../redux/selectors';
import { connect } from 'react-redux';

class LiveEventsList extends React.PureComponent<any> {
  public state = {
    showPrimaryMarkets: true
  };

  public render() {
    const {
      eventIds,
      boostCount,
    } = this.props;

    return (
      <div className={styles.liveEventList}>
        <div className={styles.eventTypeHeader}>
          <div className={styles.eventTypeHeaderTitle}>Football</div>
          <div className={'spacer'} />
          <div className={styles.toggle}>
            <FormControlLabel
              labelPlacement='start'
              control={
                <Checkbox
                  checked={this.state.showPrimaryMarkets}
                  onChange={this.togglePrimaryMarketDisplay}
                  value="true"
                  className={styles.primaryMarketCheckbox}
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
              }
              label="Show Primary Markets"
            />

          </div>
          <div className={'spacer'} />
          <div className={styles.boostCounterWrapper}>
            <div className={styles.boostCounter}>
              {boostCount} Boosts
            </div>
          </div>
        </div>
        <div>
          {
            _.map(eventIds,(event: any, index: number) => (
              <Event key={`__event-${index}`} eventId={event}/>
            ))
          }
        </div>
      </div>
    );
  }

  private togglePrimaryMarketDisplay = (event: any) => {
    this.setState({
      showPrimaryMarkets: !this.state.showPrimaryMarkets
    });

    this.props.togglePrimaryMarketDisplay(!this.state.showPrimaryMarkets);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {};
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    eventIds: displayableEventsSelector()(state),
    boostCount: boostCounterSelector()(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveEventsList);