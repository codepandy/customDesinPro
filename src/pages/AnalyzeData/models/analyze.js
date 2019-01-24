import { queryRealTimeData, queryCourierData } from '@/services/analyze';

export default {
  namespace: 'analyze',

  state: {
    realtimeList: [],
    pagination: {},
    courierList: [],
    statisticList: [
      {
        id: 'adfadfa',
        title: '专职闪送员',
        content: '18位',
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
  },

  effects: {
    *fetchRealTime({ payload, callback }, { call, put }) {
      const response = yield call(queryRealTimeData, payload);
      yield put({
        type: 'saveRealTimeList',
        payload: response,
      });
      if (callback) callback(response.total);
    },
    *fetchCourierData({ payload, callback }, { call, put }) {
      const response = yield call(queryCourierData, payload);
      const data = response.data || { rows: [], total: 0 };
      yield put({
        type: 'saveCourierList',
        payload: data.rows || [],
      });
      if (callback) callback(data.total || 0);
    },
  },

  reducers: {
    saveRealTimeList(state, { payload }) {
      return {
        ...state,
        realtimeList: payload,
      };
    },
    saveCourierList(state, { payload }) {
      return {
        ...state,
        courierList: payload,
      };
    },
  },
};
