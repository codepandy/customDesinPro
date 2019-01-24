import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const DetailCardList = ({ icon, title, children, className }) => {
  const clsString = classNames(styles.detailContainer, className);
  return (
    <div className={clsString}>
      <div className={styles.icon}>
        <img src={icon} alt="" />
      </div>
      <div>
        <div className={styles.senderTitle}>{title}</div>
        {children}
      </div>
    </div>
  );
};

export default DetailCardList;
