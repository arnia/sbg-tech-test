import React from 'react';
import styles from './LiveEventList.module.scss';
import _ from 'lodash';
import Event from './LiveEvent';

function EventType({
                     type
                   }: any) {
  return (
    <div className={styles.eventTypeWrapper}>
      <div className={styles.eventTypeHeader}>
        <div className={styles.eventTypeHeaderTitle}>
          {type.typeName}
        </div>
      </div>
      <div>
        {
          _.map(type.eventIds, (event: any, index: number) => (
            <Event key={`__event-${index}`} eventId={event}/>
          ))
        }
      </div>
    </div>
  );
}

export default EventType;