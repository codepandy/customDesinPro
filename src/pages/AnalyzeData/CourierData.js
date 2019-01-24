import React from 'react';
import { Table, Card, Button, DatePicker } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LabelCard from '@/components/LabelCard';
import styles from './common.less';

// 强制发布
@connect(({ analyze, loading }) => ({
  analyze,
  loading: loading.models.analyze,
}))
class CourierData extends React.PureComponent {
  columns = [
    {
      title: formatMessage({ id: 'app.analyze.courier.column.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.sendordernum' }),
      dataIndex: 'push_cnt',
      key: 'push_cnt',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.takeordernum' }),
      dataIndex: 'grab_cnt',
      key: 'grab_cnt',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.completeordernum' }),
      dataIndex: 'finish_cnt',
      key: 'finish_cnt',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.completeamount' }),
      dataIndex: 'finish_amt',
      key: 'finish_amt',
      render(text) {
        return `${text}元`;
      },
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.onlinetime' }),
      dataIndex: 'onlinetime',
      key: 'onlinetime',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.billingdurationratio' }),
      dataIndex: 'billingdurationratio',
      key: 'billingdurationratio',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.IPH' }),
      dataIndex: 'iph',
      key: 'iph',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.TPH' }),
      dataIndex: 'tph',
      key: 'tph',
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.averagepickpudistance' }),
      dataIndex: 'avg_distance',
      key: 'avg_distance',
      render(text) {
        return `${text}公里`;
      },
    },
    {
      title: formatMessage({ id: 'app.analyze.courier.column.longratio' }),
      dataIndex: 'long_rate',
      key: 'long_rate',
      render(text) {
        const rate = (parseFloat(text) * 100).toFixed(2);
        return `${rate}%`;
      },
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
      startDate: moment(),
      endDate: moment(),
      endOpen: false,
      filter: {
        name: '',
        startTime: moment().format('YYYYMMDD'),
        endTime: moment().format('YYYYMMDD'),
      },
    };
  }

  componentDidMount() {
    this.onSearchClick();
  }

  onChangeName = e => {
    this.onChangeFilter('name', e.target.value);
  };

  onChangeFilter = (key, value) => {
    const { filter } = this.state;
    this.setState({
      filter: {
        ...filter,
        [key]: value,
      },
    });
  };

  disabledStartDate = startValue => {
    const { endDate } = this.state;
    if (!startValue || !endDate) {
      return false;
    }
    const start = moment(startValue);
    const end = endDate > moment().valueOf() ? moment().valueOf() : endDate;
    return start.add(7, 'd').valueOf() <= endDate.valueOf() || startValue.valueOf() > end;
  };

  disabledEndDate = endValue => {
    const { startDate } = this.state;
    if (!endValue || !startDate) {
      return false;
    }
    const start = moment(startDate);
    return (
      endValue.valueOf() < start.valueOf() ||
      endValue.valueOf() > moment().valueOf() ||
      endValue.valueOf() > start.add(7, 'd').valueOf()
    );
  };

  onStartChange = value => {
    const { filter } = this.state;
    this.setState({
      startDate: value,
      filter: {
        ...filter,
        startTime: value ? value.format('YYYYMMDD') : '',
      },
    });
  };

  onEndChange = value => {
    const { filter } = this.state;
    this.setState({
      endDate: value,
      filter: {
        ...filter,
        endTime: value ? value.format('YYYYMMDD') : '',
      },
    });
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  onSearchClick = () => {
    const { pagination } = this.state;
    this.onSearch(pagination);
  };

  onSearch = pagination => {
    const { dispatch } = this.props;
    const { filter } = this.state;

    dispatch({
      type: 'analyze/fetchCourierData',
      payload: {
        data: {
          ...filter,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
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

  onChangeTable = pagination => {
    window.scrollTo(0, 0);
    this.onSearch(pagination);
  };

  render() {
    const { pagination, startDate, endDate, endOpen } = this.state;
    const {
      loading,
      analyze: { statisticList, courierList },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <LabelCard data={statisticList} />
        <Card className={styles.card}>
          <div className={styles.filter}>
            <div className={styles.item}>
              <div className={styles.label}>
                {formatMessage({ id: 'app.analyze.courier.filter.validedDate' })}
              </div>
              <div>
                <DatePicker
                  disabledDate={this.disabledStartDate}
                  format="YYYY-MM-DD"
                  value={startDate}
                  placeholder="开始日期"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />
                <span> ~ </span>
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  format="YYYY-MM-DD"
                  value={endDate}
                  placeholder="截止日期"
                  onChange={this.onEndChange}
                  open={endOpen}
                  onOpenChange={this.handleEndOpenChange}
                />
              </div>
            </div>
            {/* <div className={styles.item}>
              <div className={styles.label}>
                {formatMessage({ id: 'app.analyze.courier.filter.name' })}
              </div>
              <div>
                <Input
                  placeholder={formatMessage({ id: 'app.analyze.courier.filter.name.holder' })}
                  value={filter.name}
                  onChange={this.onChangeName}
                />
              </div>
            </div> */}
            <div className={styles.right}>
              <Button type="primary" className={styles.search} onClick={this.onSearchClick}>
                {formatMessage({ id: 'app.action.search' })}
              </Button>
            </div>
          </div>
          <Table
            rowKey="id"
            loading={loading}
            className={styles.marginTop}
            columns={this.columns}
            dataSource={courierList}
            pagination={{ pageSizeOptions: ['10', '20', '30', '40', '50'], ...pagination }}
            onChange={this.onChangeTable}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CourierData;
