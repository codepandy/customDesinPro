import { stringify } from 'qs';
import request from '@/utils/request';
import { getCommonParams } from '@/utils/utils';

export async function queryMonitor(params) {
  return request(`/dms/api/dispatch/ordermonitor/v1?${stringify(params)}`);
}

export async function queryOrderList(params) {
  return request(`/dms/api/dispatch/orderinfo/area/task/lab/v1?${stringify(params)}`);
}

export async function queryCourierList(params) {
  return request(`/dms/api/dispatch/area/employee/query/v1?${stringify(params)}`);
}

export async function queryOrderDetail(params) {
  return request(`/dms/api/dispatch/orderinfo/detail/v1?${stringify(params)}`);
}

export async function queryReassignmentList(params) {
  return request(`/dms/api/dispatch/employee/choose/v1?${stringify(params)}`);
}

export async function queryReassign(params) {
  return request(`/dms/api/dispatch/choose/update/v1`, {
    method: 'POST',
    body: getCommonParams(params),
  });
}
