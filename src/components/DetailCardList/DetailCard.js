import React from 'react';
import styles from './index.less';

const DetailCard = ({ label, value, tip = '' }) => (
  <div className={styles.detailDesc}>
    <span className={styles.detailLabel}>{label}：</span>
    <span title={tip}>{value}</span>
  </div>
);

export default DetailCard;
