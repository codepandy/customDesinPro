import Mock from 'mockjs';

const statisticList = () => {
  const source = Mock.mock({
    data: [
      {
        id: 'adfadfa',
        title: '接单量',
        'content|1': ['235单', '200单', '', '30单', '12单', '69单'],
        'up|1': ['45%', '30%', '29%', '35%', '87%', ''],
        'down|1': ['45%', '30%', '29%', '35%', '87%', ''],
      },
      {
        id: 'adfsdfsdadfa',
        title: '改派率',
        'content|1': ['45%', '30%', '29%', '35%', '87%', ''],
      },
      {
        id: 'ad34234fadfa',
        title: '超时率',
        'content|1': ['45%', '30%', '29%', '35%', '87%', ''],
      },
      {
        id: 'sdfsdfsdfdsfefs',
        title: '取消率',
        'content|1': ['45%', '30%', '29%', '35%', '87%', '', '12%'],
      },
    ],
  });

  return source.data;
};

const orderList = () => {
  const source = Mock.mock({
    data: {
      labInfo: [
        {
          code: 'waitLab',
          'num|1': [25, 35, 12, 102, 66],
        },
        {
          code: 'dealLab',
          'num|1': [25, 35, 12, 102, 66],
        },
        {
          code: 'newOrderLab',
          'num|1': [25, 35, 12, 102, 66],
        },
        {
          code: 'waitReceiveOrderLab',
          'num|1': [25, 35, 12, 102, 66],
        },
        {
          code: 'NoArriveStoreLab',
          'num|1': [25, 35, 12, 102, 66],
        },
        {
          code: 'fastingLab',
          'num|1': [25, 35, 12, 102, 66],
        },
      ],
      pager: {
        'data|1-30': [
          {
            id: /\d{5}[a-zA-Z]{1,5}/,
            'consumerTime|1': ['3分钟', '1小时22分钟', '22分钟', '30分钟', '15分钟'],
            'questionDes|1': ['运力不足', '车坏了', '休假'],
            'orderStatus|1': ['派单中', '待支付'],
            'senderName|1': ['张三丰', '李莫愁', '马永贞', '汪涵', '王瀚', '赵无极', '周星驰'],
            senderMobile: /1[3-9]\d{9}/,
            'storeName|1': ['紫燕口水鸡', '老婆不摊饼', '味多美蛋糕', '王老太小海鲜', '本土肯德基'],
            storeMobile: /1[3-9]\d{9}/,
            orderNo: /\d{17}/,
            'customer|1': ['张女士', '王先生', '赵老板', '马老板'],
            'customerAdress|1': ['留园里八号楼七门五楼503', '西二旗博研科技大厦A座402'],
            'remanentTime|1': ['3分钟', '1小时32分钟', '22分钟', '30分钟', '15分钟'],
          },
        ],
        page: {
          curPage: 1,
          pageSize: 10,
          totalPage: 2,
          'totalSize|1': [10, 22, 34],
        },
      },
    },
  });
  return source.data;
};

// 强制发布
const courierList = () => {
  const source = Mock.mock({
    data: {
      count: /\d{1,2}/,
      'employees|1-30': [
        {
          id: /\d{5}[a-zA-Z]{1,5}/,
          'name|1': ['张三丰', '李莫愁', '马永贞', '汪涵', '王瀚', '赵无极', '周星驰'],
          phone: /1[3-9]\d{9}/,
          'rate|1': ['1/3', '0/5', '3/5', '2/3'],
          'status|1': ['已休息5分钟', ''],
        },
      ],
      typeInfos: [
        {
          code: 'onduty',
          num: /\d{1,2}/,
        },
        {
          code: 'offduty',
          num: /\d{1,2}/,
        },
        {
          code: 'rest',
          num: /\d{1,2}/,
        },
      ],
      workType: 1,
    },
  });
  return source.data;
};

const getOrderDetail = () => {
  const source = Mock.mock({
    data: {
      mainOrderNo: /\d{17}/,
      'createTime|1': ['2018-12-14 14:23:45', '2018-12-23 10:25:45', '2018-11-14 14:33:45'],
      headInfo: {
        desc: '',
        'name|1': ['派单中', '待支付'],
        'time|1': ['2分钟', '1小时3分钟', '30分钟', '1小时15分钟'],
        'timePoint|1': ['运力不足，建议进行手动改派', '已超出规定到店时间：3分', ''],
        'colorFlag|1': [true, false],
      },
      statusInfos: {
        current: 2,
        'statusList|3-10': [
          {
            id: /\d{17}/,
            code: /\d{17}/,
            'name|+1': [
              '下单',
              '派单',
              '接单',
              '到店',
              '取件',
              '配送中',
              '送达#1',
              '送达#2',
              '完单',
              '完单',
            ],
            desc: '',
            'time|+1': [
              '10:23',
              '10:24',
              '11:24',
              '12:24',
              '13:24',
              '13:44',
              '13:45',
              '14:24',
              '15:24',
            ],
          },
        ],
      },
      'consignees|1-5': [
        {
          branchOrderNo: /\d{17}/,
          'latitude|+1': [39.931757, 39.927662, 39.939391, 39.930982, 39.92235],
          'longitude|+1': [116.45328, 116.4471, 116.43014, 116.45788, 116.465641],
          consigneeInfo: {
            address: '天津市南开区三马路华兴楼102号4层403',
            name: '吉健炸香鸡',
            phone: /1[3-9]\d{9}/,
          },
          goodInfo: {
            'name|1': ['蛋糕', '文件', '鲜花', '生鲜'],
            remark: '踏板车，不要大声嚷嚷',
            'weight|1': ['5公斤', '2公斤', '1公斤'],
          },
        },
      ],
      senderInfo: [
        {
          address: '天津市南开区三马路华兴楼102号4层403',
          name: '吉健炸香鸡',
          storePhone: /1[3-9]\d{9}/,
          phone: /1[3-9]\d{9}/,
          'payMode|1': ['余额支付', '微信支付', '支付宝支付'],
          latitude: 39.960078,
          longitude: 116.425253,
        },
      ],
      distanceInfo: {
        lineDistance: 'lineDistance',
        realDistance: 'realDistance',
      },
      courierInfo: {
        id: /\d{17}/,
        'name|1': ['张三丰', '李莫愁', '马永贞', '汪涵', '王瀚', '赵无极', '周星驰'],
        phone: /1[3-9]\d{9}/,
        latitude: 39.946029,
        longitude: 116.432152,
      },
    },
  });
  return source.data;
};

const reassignment = () => {
  const source = Mock.mock({
    'data|1-20': [
      {
        'address|1': [
          '北京市朝阳区建国门外大街甲16号中环世贸中心C座2层',
          '建国门外大街灵通观临甲13号',
          '建国门外大街甲6号中环世贸中心C座2层',
        ],
        'distance|1': ['1.1公里', '320米'],
        id: /\d{17}/,
        'name|1': ['张三丰', '李莫愁', '马永贞', '汪涵', '王瀚', '赵无极', '周星驰'],
        'status|1': ['已到店', '取件中', '待到店'],
      },
    ],
  });
  return source.data;
};

export default {
  'GET /dms/api/dispatch/ordermonitor/v1': (req, res) => {
    res.send({
      status: 200,
      data: statisticList(),
    });
  },
  'GET /dms/api/dispatch/orderinfo/area/task/lab/v1': (req, res) => {
    res.send({
      status: 200,
      data: orderList(),
    });
  },
  'GET /dms/api/dispatch/area/employee/query/v1': (req, res) => {
    res.send({
      status: 200,
      data: courierList(),
    });
  },
  'GET /dms/api/dispatch/orderinfo/detail/v1': (req, res) => {
    res.send({
      status: 200,
      data: getOrderDetail(),
    });
  },
  'GET /dms/api/dispatch/employee/choose/v1': (req, res) => {
    res.send({
      status: 200,
      data: reassignment(),
    });
  },
  'POST /dms/api/dispatch/choose/update/v1': (req, res) => {
    res.send(Mock.mock({ data: { 'status|1': [200, 300] } }).data);
  },
};
