import React from 'react';
import { Table, Tabs, Card, Divider } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LabelCardForRate from '@/components/LabelCard/LabelCardForRate';
import OrderDetail from './OrderDetail';
import Reassignment from './Reassignment';
import {
  taskTypeConst,
  labTypeConst,
  currentUserInfoKey,
  courierStatusConst,
} from '@/utils/constant';
import styles from './ControlCab.less';

const { TabPane } = Tabs;
const courierStatusArr = [
  courierStatusConst.onduty,
  courierStatusConst.offduty,
  courierStatusConst.rest,
];
const currentUser = JSON.parse(sessionStorage.getItem(currentUserInfoKey));

@connect(({ transportation, loading }) => ({
  transportation,
  loading: loading.models.transportation,
}))
class ControlCab extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.useTime' }),
      dataIndex: 'consumerTime',
      key: 'consumerTime',
      width: 130,
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.description' }),
      dataIndex: 'questionDes',
      key: 'questionDes',
      width: 120,
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.status' }),
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 80,
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.courier' }),
      dataIndex: 'senderName',
      key: 'senderName',
      width: 100,
      render: (text, record) => (
        <div>
          {text}
          <div>{record.senderPhone}</div>
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.shop' }),
      dataIndex: 'storeName',
      key: 'storeName',
      width: 140,
      render: (text, record) => {
        const { viewCurrentShop } = this.state;
        return (
          <div>
            {text}
            <div>{record.storeMobile}</div>
            <div
              className={styles.storeBtn}
              onClick={this.onSearchByShop.bind(this, record.shopId)}
            >
              {viewCurrentShop ? '查看所有' : '只看该商户'}
            </div>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.orderNum' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 220,
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.column.customer' }),
      dataIndex: 'customer',
      key: 'customer',
      width: 300,
      render(text, record) {
        return (
          <div>
            {text}
            <div>{record.customerAdress}</div>
          </div>
        );
      },
    },
    {
      title: formatMessage({ id: 'app.action.operator' }),
      key: '',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <div>
          <a onClick={this.onSetModal.bind(this, record.orderNo)}>
            {formatMessage({ id: 'app.action.detail' })}
          </a>
          <Divider type="vertical" />
          <a onClick={this.onDispatch.bind(this, record.orderNo)}>
            {formatMessage({ id: 'app.action.reassignment' })}
          </a>
        </div>
      ),
    },
  ];

  courierColumns = [
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.courier.column.courier' }),
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (text, record) => (
        <div>
          {text}
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: formatMessage({ id: 'app.trasportation.controlcab.courier.column.status' }),
      dataIndex: 'rate',
      key: 'rate',
      width: 140,
      render: (text, record) => (
        <div>
          <div className={styles.courierNum}>{text}</div>
          {record.status ? <div className={styles.courierStatus}>已休5分钟</div> : null}
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
      },
      checkedTabKey: taskTypeConst.waitTask.toString(),
      pendingFilter: {
        status: labTypeConst.newOrder,
      },
      sendingFilter: {
        status: labTypeConst.waitReceiveOrder,
      },
      courierStatus: courierStatusConst.onduty,
      viewCurrentShop: false,
      detailNo: '',
      visibleDetail: false,
      visibleAssignment: false,
      shopId: '',
    };
  }

  componentDidMount() {
    this.onInitData();
    this.intervalId = setInterval(() => {
      this.onInitData();
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  onChangeTab = activeKey => {
    const { pagination, pendingFilter, sendingFilter, courierStatus } = this.state;
    this.setState({ checkedTabKey: activeKey, pagination: { ...pagination, current: 1 } });
    let labType = '';
    if (activeKey === taskTypeConst.waitTask.toString()) {
      labType = pendingFilter.status;
      this.columns.splice(2, 1);
      this.columns.splice(1, 0, {
        title: formatMessage({ id: 'app.trasportation.controlcab.column.description' }),
        dataIndex: 'questionDes',
        key: 'questionDes',
        width: 120,
      });
    } else if (activeKey === taskTypeConst.dealTask.toString()) {
      labType = sendingFilter.status;
      this.columns.splice(1, 1);
      this.columns.splice(2, 0, {
        title: formatMessage({ id: 'app.trasportation.controlcab.column.distance' }),
        dataIndex: 'remanentTime',
        key: 'remanentTime',
        width: 130,
      });
    }
    this.onGetList({
      pagination: { ...pagination, current: 1 },
      checkedTabKey: activeKey,
      labType,
    });
    this.onGetCourierList(courierStatus);
  };

  // 待处理列表
  onInitData = () => {
    const { dispatch } = this.props;
    const {
      pagination,
      courierStatus,
      checkedTabKey,
      pendingFilter,
      sendingFilter,
      shopId,
    } = this.state;
    dispatch({
      type: 'transportation/queryMonitor',
      payload: { areaId: currentUser.areaId || '' },
    });
    this.onGetList({
      shopId,
      pagination,
      checkedTabKey,
      labType:
        checkedTabKey === taskTypeConst.dealTask.toString()
          ? sendingFilter.status
          : pendingFilter.status,
    });
    this.onGetCourierList(courierStatus);
  };

  onGetList = ({
    pagination,
    shopId = '',
    checkedTabKey = taskTypeConst.waitTask.toString(),
    labType,
  }) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'transportation/fetchOrderList',
      payload: {
        areaId: currentUser.areaId || '',
        taskType: checkedTabKey,
        labType,
        current: pagination.current,
        pageSize: pagination.pageSize,
        shopId,
      },
      callback: total => {
        this.setState({
          pagination: {
            ...pagination,
            total,
          },
        });
      },
    });
  };

  onChangePendingTable = pagination => {
    const { checkedTabKey, pendingFilter } = this.state;
    this.onGetList({ pagination, checkedTabKey, labType: pendingFilter.status });
  };

  onChangeDealTaskTable = pagination => {
    const { checkedTabKey, sendingFilter } = this.state;
    this.onGetList({ pagination, checkedTabKey, labType: sendingFilter.status });
  };

  onDispatch = detailNo => {
    this.setState({ visibleAssignment: true, detailNo });
    const { dispatch } = this.props;
    dispatch({
      type: 'transportation/fetchReassignmentList',
      payload: {
        orderNo: detailNo,
        areaId: currentUser.areaId,
        supplierId: currentUser.id,
      },
    });
  };

  onSearchByShop = shopId => {
    this.setState({ shopId });
    const { pagination, viewCurrentShop, checkedTabKey, pendingFilter, sendingFilter } = this.state;
    this.setState({ viewCurrentShop: !viewCurrentShop });
    this.onGetList({
      pagination,
      shopId: viewCurrentShop ? '' : shopId,
      labType:
        checkedTabKey === taskTypeConst.dealTask.toString()
          ? sendingFilter.status
          : pendingFilter.status,
    });
  };

  onGetCourierList = courierStatus => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transportation/fetchCourierList',
      payload: {
        areaId: currentUser.areaId,
        workType: courierStatus,
        supplierId: currentUser.id,
      },
    });
  };

  onChangeSendingStatus = status => {
    this.setState({ sendingFilter: { status } });
    const { pagination, checkedTabKey } = this.state;
    this.onGetList({ pagination, checkedTabKey, labType: status });
  };

  onClickCourierStatus = courierStatus => {
    this.setState({ courierStatus });
    this.onGetCourierList(courierStatus);
  };

  onSetModal = detailNo => {
    this.setState({
      visibleDetail: true,
      detailNo,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'transportation/fetchOrderDetail',
      payload: {
        detailNo,
      },
    });
  };

  onCancelDetailModal = () => {
    this.setState({ visibleDetail: false });
  };

  onCancelReassignmentModal = () => {
    this.setState({ visibleAssignment: false });
  };

  render() {
    const {
      pagination,
      pendingFilter,
      sendingFilter,
      checkedTabKey,
      courierStatus,
      detailNo,
      visibleDetail,
      visibleAssignment,
    } = this.state;
    const {
      loading,
      transportation: { statisticList, orderList, courierList },
    } = this.props;
    const getNum = code => {
      const info = (orderList.labInfo || []).find(item => item.code.toString() === code.toString());
      if (!info) {
        return '';
      }
      return parseInt(info.num, 10) || '';
    };
    const getCourierNum = code => {
      const info = (courierList.typeInfos || []).find(
        item => item.code.toString() === code.toString()
      );
      if (!info) {
        return '';
      }
      return parseInt(info.num, 10) || '';
    };

    return (
      <PageHeaderWrapper>
        <Card title={formatMessage({ id: 'app.trasportation.controlcab.monitor' })}>
          <LabelCardForRate data={statisticList} />
        </Card>
        <div className={styles.contentContainer}>
          <Card
            title={formatMessage({ id: 'app.trasportation.controlcab.orderInfo' })}
            className={styles.leftCard}
          >
            <Tabs activeKey={checkedTabKey} type="card" onChange={this.onChangeTab}>
              <TabPane
                tab={`${formatMessage({
                  id: 'app.trasportation.controlcab.pending',
                })} ${getNum(taskTypeConst.waitTask)}`}
                key={taskTypeConst.waitTask.toString()}
              >
                <div className={styles.filterRow}>
                  <div
                    className={
                      pendingFilter.status.toString() === labTypeConst.newOrder.toString()
                        ? styles.checkedItem
                        : styles.filterItem
                    }
                  >
                    {formatMessage({ id: 'app.trasportation.controlcab.newOrder' })}{' '}
                    {getNum(labTypeConst.newOrder)}
                  </div>
                </div>
                <Table
                  rowKey="id"
                  loading={loading}
                  columns={this.columns}
                  dataSource={orderList.pager.data || []}
                  pagination={{ pageSizeOptions: ['10', '20', '30', '40', '50'], ...pagination }}
                  onChange={this.onChangePendingTable}
                  scroll={{ x: 1090 }}
                />
              </TabPane>
              <TabPane
                tab={`${formatMessage({
                  id: 'app.trasportation.controlcab.dealTask',
                })} ${getNum(taskTypeConst.dealTask)}`}
                key={taskTypeConst.dealTask.toString()}
              >
                <div className={styles.filterRow}>
                  <div
                    className={
                      sendingFilter.status === labTypeConst.waitReceiveOrder.toString()
                        ? styles.checkedItem
                        : styles.filterItem
                    }
                    onClick={this.onChangeSendingStatus.bind(this, labTypeConst.waitReceiveOrder)}
                  >
                    {formatMessage({ id: 'app.trasportation.controlcab.waitReceiveOrder' })}{' '}
                    {getNum(labTypeConst.waitReceiveOrder)}
                  </div>
                  <div
                    className={
                      sendingFilter.status === labTypeConst.noArriveStore.toString()
                        ? styles.checkedItem
                        : styles.filterItem
                    }
                    onClick={this.onChangeSendingStatus.bind(this, labTypeConst.noArriveStore)}
                  >
                    {formatMessage({ id: 'app.trasportation.controlcab.noArriveStore' })}{' '}
                    {getNum(labTypeConst.noArriveStore)}
                  </div>
                  <div
                    className={
                      sendingFilter.status === labTypeConst.fastingSend.toString()
                        ? styles.checkedItem
                        : styles.filterItem
                    }
                    onClick={this.onChangeSendingStatus.bind(this, labTypeConst.fastingSend)}
                  >
                    {formatMessage({ id: 'app.trasportation.controlcab.fastingSend' })}{' '}
                    {getNum(labTypeConst.fastingSend)}
                  </div>
                </div>
                <Table
                  rowKey="id"
                  loading={loading}
                  columns={this.columns}
                  dataSource={orderList.pager.data || []}
                  pagination={{ pageSizeOptions: ['10', '20', '30', '40', '50'], ...pagination }}
                  onChange={this.onChangeDealTaskTable}
                  scroll={{ x: 1100 }}
                />
              </TabPane>
            </Tabs>
          </Card>
          <Card
            title={`${formatMessage({ id: 'app.trasportation.controlcab.courierInfo' })}（${
              courierList.count
            }）`}
            className={styles.courierCard}
          >
            <div className={styles.filterRow}>
              {courierStatusArr.map(item => (
                <div
                  key={item}
                  className={
                    courierStatus.toString() === item.toString()
                      ? styles.checkedItem
                      : styles.filterItem
                  }
                  onClick={this.onClickCourierStatus.bind(this, item)}
                >
                  {`${formatMessage({
                    id: `app.trasportation.controlcab.courier.${item}`,
                  })} ${getCourierNum(item)}`}
                </div>
              ))}
            </div>
            <Table
              rowKey="id"
              loading={loading}
              columns={this.courierColumns}
              dataSource={courierList.employees || []}
              pagination={false}
              scroll={{ y: 1090 }}
            />
          </Card>
        </div>
        <OrderDetail visible={visibleDetail} width="875px" onCancel={this.onCancelDetailModal} />
        <Reassignment
          visible={visibleAssignment}
          width="875px"
          orderNo={detailNo}
          onCancel={this.onCancelReassignmentModal}
          callback={this.onCancelReassignmentModal}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ControlCab;
