import request from '@/utils/request';
import { getCommonParams } from '@/utils/utils';

export async function queryRealTimeData(params) {
  return request('/dms/api/queryRealTimeData', {
    method: 'POST',
    body: getCommonParams(params),
  });
}

export async function queryCourierData(params) {
  return request('/dms/api/quota/page', {
    method: 'POST',
    body: getCommonParams(params),
  });
}
