import styles from './LiveEventList.module.scss';
import React from 'react';
import EventType from './EventType';
import _ from 'lodash';
import {
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import { Dispatch } from 'redux';
import {
  boostCounterSelector,
  displayableEventsSelector,
  groupedDisplayableEventsSelector,
} from '../../../redux/selectors';
import { connect } from 'react-redux';

class LiveEventsList extends React.PureComponent<any> {
  public state = {
    showPrimaryMarkets: true
  };

  public render() {
    const {
      boostCount,
      groupedEventIds,
    } = this.props;
    return (
      <div className={styles.liveEventList}>
        <div className={styles.sportTypeHeader}>
          <div className={styles.sportTypeHeaderTitle}>Football</div>
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
          { _.map(groupedEventIds, (group, key) => (
              <EventType
                key={`__eventType-${key}`}
                type={{
                  eventIds: group,
                  typeName: key,
                }}
              />
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
    groupedEventIds: groupedDisplayableEventsSelector()(state),
    boostCount: boostCounterSelector()(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveEventsList);