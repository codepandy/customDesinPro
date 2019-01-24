import React from 'react';
import styles from './index.less';

export default function ShowTitle({ titleIcon, name, content }) {
  return (
    <div className={styles.detailTitleContainer}>
      <div className={styles.leftTitle}>
        <img src={titleIcon} alt="" />
      </div>
      <div className={styles.detailTitleRight}>
        <div className={styles.detailStatus}>{name}</div>
        <div className={styles.detailSenderTime}>{content}</div>
      </div>
    </div>
  );
}
