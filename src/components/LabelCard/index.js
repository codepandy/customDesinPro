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
            <div className={styles.item}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.content}>{item.content || '-'}</div>
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
