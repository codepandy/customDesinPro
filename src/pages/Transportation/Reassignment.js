import React from 'react';
import { connect } from 'dva';
import { Table, Modal, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import ShowTitle from '@/components/ShowTitle';
import reassignmentImg from '@/assets/reassignment.svg';
import styles from './ControlCab.less';
import headIcon from '@/assets/head.svg';
import checkedIcon from '@/assets/checked.svg';
import { responseStatus, currentUserInfoKey } from '@/utils/constant';

const userInfo = JSON.parse(sessionStorage.getItem(currentUserInfoKey));

@connect(({ transportation, loading }) => ({
  transportation,
  loading: loading.models.transportation,
}))
class Reassignment extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.column.courier' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.column.address' }),
      dataIndex: 'address',
      key: 'address',
      render: text => {
        let desc = text;
        if (text.length > 24) {
          desc = `${text.substring(0, 24)}...`;
        }
        return <span title={text}>{desc}</span>;
      },
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.column.distance' }),
      dataIndex: 'distance',
      key: 'distance',
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.column.status' }),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: formatMessage({ id: 'app.action.operator' }),
      key: '',
      width: 150,
      render: (_, record) => {
        const { checkedCourierId } = this.state;
        const checked = checkedCourierId === record.id;
        return (
          <div>
            <a onClick={this.onCheckedCourier.bind(this, record.id)}>
              {checked
                ? formatMessage({ id: 'app.action.checked' })
                : formatMessage({ id: 'app.action.choice' })}
            </a>
            {checked ? <img className={styles.checkedIcon} src={checkedIcon} alt="" /> : null}
          </div>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      checkedCourierId: '',
    };
  }

  onInit = () => {
    const { dispatch, oderNo } = this.props;
    dispatch({ type: 'transportation/fetchReassignmentList', payload: { oderNo } });
  };

  onCheckedCourier = checkedCourierId => {
    this.setState({ checkedCourierId });
  };

  onAfterClose = () => {
    this.setState({ checkedCourierId: '' });
  };

  onReassign = () => {
    const { dispatch, orderNo, callback } = this.props;
    const { checkedCourierId } = this.state;
    if (checkedCourierId.length === 0) {
      Modal.warning({
        title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.warning.title' }),
        content: formatMessage({ id: 'app.trasportation.controlcab.reassignment.warning.content' }),
        okText: formatMessage({ id: 'app.action.ok' }),
      });
      return;
    }
    dispatch({
      type: 'transportation/fetchReassign',
      payload: { orderNo, courierId: checkedCourierId, supplierId: userInfo.id },
      callback: status => {
        if (status === responseStatus.success) {
          Modal.success({
            title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.success.title' }),
            content: formatMessage({
              id: 'app.trasportation.controlcab.reassignment.success.content',
            }),
            okText: formatMessage({ id: 'app.action.ok' }),
          });
        } else {
          Modal.error({
            title: formatMessage({ id: 'app.trasportation.controlcab.reassignment.error.title' }),
            content: formatMessage({
              id: 'app.trasportation.controlcab.reassignment.error.content',
            }),
            okText: formatMessage({ id: 'app.action.ok' }),
          });
        }
        callback();
      },
    });
  };

  render() {
    const {
      loading,
      transportation: { reassignmentList },
      visible,
      width,
      onCancel,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={<ShowTitle titleIcon={reassignmentImg} name="改派" content="请酌情执行操作" />}
        visible={visible}
        width={width}
        onCancel={onCancel}
        afterClose={this.onAfterClose}
        footer={
          <div className={styles.modalFooter}>
            <Button onClick={onCancel}>{formatMessage({ id: 'app.action.cancel' })}</Button>
            <Button type="primary" onClick={this.onReassign}>
              {formatMessage({ id: 'app.trasportation.controlcab.reassignment.reassign' })}
            </Button>
          </div>
        }
      >
        <div className={styles.tip}>
          <img src={headIcon} alt="" className={styles.imgTip} />
          {formatMessage({ id: 'app.trasportation.controlcab.reassignment.tip' })}
        </div>
        <Table
          rowKey="id"
          loading={loading}
          columns={this.columns}
          dataSource={reassignmentList || []}
          pagination={false}
          scroll={{ y: 388 }}
        />
      </Modal>
    );
  }
}

export default Reassignment;
