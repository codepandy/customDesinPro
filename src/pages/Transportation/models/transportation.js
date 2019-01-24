import {
  queryMonitor,
  queryOrderList,
  queryCourierList,
  queryOrderDetail,
  queryReassignmentList,
  queryReassign,
} from '@/services/transportation';
import { responseStatus } from '@/utils/constant';

export default {
  namespace: 'transportation',

  state: {
    orderList: {
      labInfo: [{ code: 0, num: 0 }, { code: 1, num: 0 }],
      pager: { data: [], page: { totalSize: 0 } },
    },
    statisticList: [],
    courierList: { count: 0, employees: [], typeInfos: [] },
    orderDetail: {
      mainOrderNo: '',
      createTime: '',
      headInfo: { desc: '', name: '', time: '' },
      statusInfos: { current: 2, statuslist: [] },
      consignees: [],
      senderInfo: [],
      distanceInfo: {},
      courierInfo: {
        id: '',
        name: '',
        phone: '',
        latitude: 40.055325,
        longitude: 116.290918,
      },
    },
    reassignmentList: [],
  },

  effects: {
    *queryMonitor({ payload }, { call, put }) {
      const { status, data } = yield call(queryMonitor, payload);
      let result = [];
      if (status === responseStatus.success) {
        result = data || [];
      }
      yield put({
        type: 'saveMonitor',
        payload: result,
      });
    },
    *fetchOrderList({ payload, callback }, { call, put }) {
      const { data, status } = yield call(queryOrderList, payload);
      let result = {
        labInfo: [{ code: 0, num: 0 }, { code: 1, num: 0 }],
        pager: { data: [], page: { totalSize: 0 } },
      };
      if (status === responseStatus.success) {
        result = data || {
          labInfo: [{ code: 0, num: 0 }, { code: 1, num: 0 }],
          pager: { data: [], page: { totalSize: 0 } },
        };
      }

      yield put({
        type: 'saveOrderList',
        payload: result,
      });
      if (callback) callback(result.pager.page.totalSize || 0);
    },
    *fetchCourierList({ payload }, { call, put }) {
      const { data, status } = yield call(queryCourierList, payload);
      let result = { count: 0, employees: [], typeInfos: [] };
      if (status === responseStatus.success) {
        result = data || { count: 0, employees: [], typeInfos: [] };
      }

      yield put({
        type: 'saveCourierList',
        payload: result,
      });
    },
    *fetchOrderDetail({ payload, callback }, { call, put }) {
      const { data, status } = yield call(queryOrderDetail, payload);
      const init = {
        mainOrderNo: '',
        createTime: '',
        headInfo: { desc: '', name: '', time: '' },
        statusInfos: { current: 2, statuslist: [] },
        consignees: [],
        senderInfo: [],
        distanceInfo: {},
        courierInfo: {
          id: '',
          name: '',
          phone: '',
          latitude: 40.055325,
          longitude: 116.290918,
        },
      };
      let result = init;
      if (status === responseStatus.success) {
        result = data || init;
        if (callback) callback();
      }

      yield put({
        type: 'saveOrderDetail',
        payload: result,
      });
    },
    *fetchReassignmentList({ payload }, { call, put }) {
      const { data, status } = yield call(queryReassignmentList, payload);
      let result = [];

      if (status === responseStatus.success) {
        result = data || [];
      }

      yield put({
        type: 'saveReassignment',
        payload: result,
      });
    },
    *fetchReassign({ payload, callback }, { call }) {
      const { status } = yield call(queryReassign, payload);
      if (callback) callback(status);
    },
  },

  reducers: {
    saveMonitor(state, { payload }) {
      return {
        ...state,
        statisticList: payload,
      };
    },
    saveOrderList(state, { payload }) {
      return {
        ...state,
        orderList: payload,
      };
    },
    saveCourierList(state, { payload }) {
      return {
        ...state,
        courierList: payload,
      };
    },
    saveOrderDetail(state, { payload }) {
      return {
        ...state,
        orderDetail: payload,
      };
    },
    saveReassignment(state, { payload }) {
      return {
        ...state,
        reassignmentList: payload,
      };
    },
  },
};
