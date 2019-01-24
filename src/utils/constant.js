const responseStatus = {
  success: 200,
};
const currentUserInfoKey = 'currentUserInfo_12kld$*e@f343shw97';

const taskTypeConst = {
  waitTask: 'waitLab', // 待处理
  dealTask: 'dealLab', // 配送中
};

const labTypeConst = {
  newOrder: 'newOrderLab', // 新订单
  waitReceiveOrder: 'waitReceiveOrderLab', // 待接单
  noArriveStore: 'NoArriveStoreLab', // 待到店
  fastingSend: 'fastingLab', // 闪送中
  finishAll: 'fastingLab', // 已完成
  finishPerfect: 'finishPerfect', // 超时完成
  finishOVerTime: 'finishOverTime', // 准时完成
};

const courierStatusConst = {
  onduty: 'onduty', // 在岗
  offduty: 'offduty', // 收工
  rest: 'rest', // 休息
};

export { responseStatus, currentUserInfoKey, taskTypeConst, labTypeConst, courierStatusConst };
