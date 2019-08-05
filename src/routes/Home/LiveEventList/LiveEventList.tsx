import styles from './LiveEventList.module.scss';
import React from 'react';

class LiveEventsList extends React.PureComponent<any> {

  public render() {
    const {
      events
    } = this.props;
    return (
      <ul>
        {
          events.map((event: any, index: number) => (
            <li key={`__event-${index}`}>{event.name}</li>
          ))
        }
      </ul>
    );
  }
}

export default LiveEventsList;