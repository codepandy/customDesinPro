import React, { Fragment } from 'react';
import { Steps, Modal } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { Map, Label } from 'rc-bmap';
import styles from './ControlCab.less';
import detailTitleIcon from '@/assets/detailTitle.svg';
import senderIcon from '@/assets/sender.svg';
import receiverIcon from '@/assets/receiver.svg';
import goodsIcon from '@/assets/goods.svg';
import sendpointIcon from '@/assets/sendpoint.svg';
import receivepointIcon from '@/assets/receivepoint.svg';
import DetailCardList from '@/components/DetailCardList';
import courierIcon from '@/assets/courier.svg';

const pointStyle = {
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  color: 'rgba(255,255,255,1)',
  paddingLeft: '8px',
  paddingTop: '4px',
  fontWeight: '500',
  width: '26px',
  height: '34px',
};
const sendStyle = {
  ...pointStyle,
  backgroundImage: `url(${sendpointIcon})`,
};
const courierStyle = {
  ...pointStyle,
  backgroundImage: `url(${courierIcon})`,
  width: '35px',
  height: '39px',
};
const receiveStyle = {
  ...pointStyle,
  backgroundImage: `url(${receivepointIcon})`,
  paddingLeft: '10px',
  paddingTop: '6px',
};
const { DetailCard } = DetailCardList;
const { Step } = Steps;
const ShowTitle = ({ name, time, timePoint, courierInfo = {} }) => (
  <div className={styles.detailTitleContainer}>
    <div className={styles.leftTitle}>
      <img src={detailTitleIcon} alt="" />
    </div>
    <div className={styles.detailTitleRight}>
      <div className={styles.detailStatus}>{name}</div>
      <div className={styles.detailSenderTime}>
        {formatMessage({ id: 'app.trasportation.controlcab.detail.time' })}
        {time}
        {timePoint ? (
          <span>
            {' '}
            | <span className={styles.warning}>{timePoint}</span>
          </span>
        ) : null}
        {courierInfo.id ? (
          <Fragment>
            {' '}
            | {formatMessage({ id: 'app.trasportation.controlcab.detail.courier' })}：
            {courierInfo.name} |{' '}
            {formatMessage({ id: 'app.trasportation.controlcab.detail.phone' })}：
            {courierInfo.phone}
          </Fragment>
        ) : null}
      </div>
    </div>
  </div>
);

@connect(({ transportation, loading }) => ({
  transportation,
  loading: loading.models.transportation,
}))
class OrderDetail extends React.PureComponent {
  render() {
    const {
      visible,
      width,
      transportation: { orderDetail },
      onCancel,
    } = this.props;
    const senderInfo = orderDetail.senderInfo || {};
    const { courierInfo } = orderDetail;
    const sliceStr = value => {
      if (!value) return '';
      if (value.length > 15) {
        return `${value.substring(0, 15)}...`;
      }
      return value;
    };
    return (
      <Fragment>
        <Modal
          destroyOnClose
          maskClosable={false}
          title={<ShowTitle {...orderDetail.headInfo} courierInfo={courierInfo} />}
          visible={visible}
          width={width}
          footer={null}
          onCancel={onCancel}
        >
          <Steps
            className={styles.stepContainer}
            size="small"
            labelPlacement="vertical"
            current={orderDetail.statusInfos.current || 0}
          >
            {(orderDetail.statusInfos.statusList || []).map(item => (
              <Step key={item.id} title={item.name} description={item.time} />
            ))}
          </Steps>
          <hr className={styles.hr} />
          <div className={styles.detailContentContainer}>
            <div className={styles.detailLeft}>
              <DetailCardList
                icon={senderIcon}
                title={formatMessage({ id: 'app.trasportation.controlcab.detail.sender' })}
              >
                <DetailCard
                  label={formatMessage({ id: 'app.trasportation.controlcab.detail.shopName' })}
                  value={senderInfo.name || ''}
                />
                <DetailCard
                  label={formatMessage({ id: 'app.trasportation.controlcab.detail.shopAddress' })}
                  value={sliceStr(senderInfo.address || '')}
                  tip={senderInfo.address}
                />
                <DetailCard
                  label={formatMessage({ id: 'app.trasportation.controlcab.detail.senderMobile' })}
                  value={senderInfo.phone || ''}
                />
                <DetailCard
                  label={formatMessage({ id: 'app.trasportation.controlcab.detail.shopMobile' })}
                  value={senderInfo.storePhone || ''}
                />
                <DetailCard
                  label={formatMessage({ id: 'app.trasportation.controlcab.detail.payMode' })}
                  value={senderInfo.payModel || ''}
                />
              </DetailCardList>
            </div>
            <div className={styles.map}>
              <Map
                ak="DQOwabES9bT4R5nhs3Y7tknRFPQKQF4I"
                placeHolder={formatMessage({ id: 'app.trasportation.controlcab.map.loading' })}
                scrollWheelZoom
                zoom={13}
                center={{
                  lat: senderInfo.latitude || 39.915156,
                  lng: senderInfo.longitude || 116.403694,
                }}
              >
                {courierInfo.id ? (
                  <Label
                    content=""
                    point={{
                      lat: courierInfo.latitude || 39.915156,
                      lng: courierInfo.longitude || 116.403694,
                    }}
                    massClear={false}
                    zIndex={100}
                    style={courierStyle}
                  />
                ) : null}
                <Label
                  content="发"
                  point={{
                    lat: senderInfo.latitude || 39.915156,
                    lng: senderInfo.longitude || 116.403694,
                  }}
                  massClear={false}
                  zIndex={100}
                  style={sendStyle}
                />
                {(orderDetail.consignees || []).map((item, index) => (
                  <Label
                    key={`${item.latitude}${item.longitude}`}
                    content={index + 1}
                    point={{
                      lat: item.latitude || 39.915156,
                      lng: item.longitude || 116.403694,
                    }}
                    massClear={false}
                    zIndex={100}
                    style={receiveStyle}
                  />
                ))}
              </Map>
            </div>
          </div>
          <hr className={styles.hr} />
          {(orderDetail.consignees || []).map((item, index) => (
            <Fragment key={item.branchOrderNo}>
              <div className={styles.detailContentContainer}>
                <div className={styles.detailLeft}>
                  <DetailCardList
                    icon={receiverIcon}
                    title={`${formatMessage({
                      id: 'app.trasportation.controlcab.detail.receiver',
                    })}-${index + 1}`}
                  >
                    <DetailCard
                      label={formatMessage({ id: 'app.trasportation.controlcab.detail.shopName' })}
                      value={item.consigneeInfo.name}
                    />
                    <DetailCard
                      label={formatMessage({
                        id: 'app.trasportation.controlcab.detail.receiverAddress',
                      })}
                      value={sliceStr(item.consigneeInfo.address)}
                      tip={item.consigneeInfo.address}
                    />
                    <DetailCard
                      label={formatMessage({
                        id: 'app.trasportation.controlcab.detail.receiverMobile',
                      })}
                      value={item.consigneeInfo.phone}
                    />
                    <DetailCard
                      label={formatMessage({ id: 'app.trasportation.controlcab.detail.orderNo' })}
                      value={item.branchOrderNo}
                    />
                  </DetailCardList>
                </div>
                <div className={styles.detailRight}>
                  <DetailCardList
                    icon={goodsIcon}
                    title={formatMessage({ id: 'app.trasportation.controlcab.detail.goods' })}
                  >
                    <DetailCard
                      label={formatMessage({ id: 'app.trasportation.controlcab.detail.goodsName' })}
                      value={item.goodInfo.name}
                    />
                    <DetailCard
                      label={formatMessage({
                        id: 'app.trasportation.controlcab.detail.goodsWeight',
                      })}
                      value={item.goodInfo.weight}
                    />
                    <DetailCard
                      label={formatMessage({ id: 'app.trasportation.controlcab.detail.remarks' })}
                      value={item.goodInfo.remark}
                    />
                  </DetailCardList>
                </div>
              </div>
              <hr className={styles.hr} />
            </Fragment>
          ))}
          <div className={styles.footer}>
            {formatMessage({ id: 'app.trasportation.controlcab.detail.senderTime' })}
            {moment(orderDetail.createTime || Date.now()).format('YYYY-MM-DD HH:mm:ss')} |{' '}
            {formatMessage({ id: 'app.trasportation.controlcab.detail.orderNum' })}
            {orderDetail.mainOrderNo}
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default OrderDetail;
