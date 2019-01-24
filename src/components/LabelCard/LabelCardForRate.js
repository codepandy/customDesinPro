import React, { PureComponent, Fragment } from 'react';
import { Divider } from 'antd';
import styles from './index.less';

export default class LabelCard extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.row}>
        {data.map((item, index) => (
          <Fragment key={item.title}>
            {index > 0 ? <Divider type="vertical" className={styles.divider} /> : null}
            <div className={styles.column}>
              <div className={styles.leftItem}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.content}>
                  {item.content || '-'}
                  {index === 0 ? <span className={styles.subContent}>比昨日</span> : null}
                </div>
              </div>
              {index === 0 ? (
                <div className={styles.leftItem}>
                  <div className={styles.upRate}>升{item.up || '-'}</div>
                  <div className={styles.downRate}>降{item.down || '-'}</div>
                </div>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
