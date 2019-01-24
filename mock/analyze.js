import Mock from 'mockjs';

const { Random } = Mock;

const courierList = Mock.mock({
  'list|1-30': [
    {
      id: Random.guid(),
      'name|1': ['爱新觉罗.东方', '诸葛流云', '李星云', '王思聪', '曹操'],
      'push_cnt|1': ['117', '231', '21', '1', '234'],
      'grab_cnt|1': ['117', '231', '21', '1', '234'],
      'finish_cnt|1': ['100', '98', '96', '38'],
      'finish_amt|1': ['2313', '212', '1', '120', '698'],
      'onlinetime|1': ['7小时12分', '1小时2分', '3小时', '20分钟'],
      'billingdurationratio|1': ['12%', '100%', '92%', '33%'],
      iph: '',
      tph: '',
      'avg_distance|1': ['12公里', '1公里', '999米'],
      'long_rate|1': ['12%', '100%', '92%', '33%'],
    },
  ],
});

const quotaList = () => {
  const data = Mock.mock({
    'list|1-30': [
      {
        iph: /\d{5}[a-zA-Z]{1,5}/,
        'grab_cnt|1': [10, 20, 34, 22],
        'long_rate|1': [10, 20, 34, 22],
        'push_cnt|1': [10, 20, 34, 22],
        'tph|1': [10, 20, 34, 22, 12, 15],
        'dt_ymd|1': 20181105,
        name: '广州市诺晞商务服务有限公司',
        courier_id: /\d{6}/,
        'finish_cnt|1': [10, 20, 34, 22, 12, 15],
        id: /\d{5}/,
        'finish_amt|1': [10, 20, 34, 22, 12, 15],
        supplier_id: /\d{7}/,
        'avg_distance|1': [10, 20, 34, 22, 12, 15],
      },
    ],
  });
  return data.list;
};

export default {
  'POST /dms/api/queryRealTimeData': (req, res) => {
    res.send({
      status: 200,
      currentAuthority: 'admin',
      data: [
        {
          id: 'adfadfa',
          title: '专职闪送员',
          content: '20位',
        },
        {
          id: 'adfsdfsdadfa',
          title: '众包闪送员',
          content: '239位',
        },
        {
          id: 'ad34234fadfa',
          title: '本月新增闪送员',
          content: '239位',
        },
      ],
    });
  },
  'POST /dms/api/quota/page': (req, res) => {
    const data = quotaList();
    res.send({
      status: 200,
      currentAuthority: 'admin',
      data: {
        rows: data,
        total: data.length,
      },
    });
  },
};
