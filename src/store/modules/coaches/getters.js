export default {
  coaches(state) {
    return state.coaches;
  },
  hasCoaches(state) {
    return state.coaches && state.coaches.length > 0;
  },
  // 检查是否已有该教练
  isCoach(_, getters, _2, rootGetters) {
    const coaches = getters.coaches;
    const userId = rootGetters.userId;
    return coaches.some((coach) => coach.id === userId);
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFetch;
    //如果没有时间戳，就更新
    if (!lastFetch) {
      return true;
    }
    const currentTimestamp = new Date().getTime();
    //超过一分钟就更新
    return (currentTimestamp - lastFetch) / 1000 > 6;
  },
};
