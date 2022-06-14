export default {
  // 登记
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      hourlyRate: data.rate,
      description: data.desc,
      areas: data.areas,
    };
    const token = context.rootGetters.token;

    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/coaches/${userId}.json?auth=` +
        token,
      {
        method: 'PUT',
        body: JSON.stringify(coachData),
      }
    );

    // const reponseData = await response.json();
    if (!response.ok) {
      console.log('ok!');
    }
    context.commit('registerCoach', {
      ...coachData,
      id: userId,
    });
  },
  // 加载
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/coaches.json`
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(response.message || 'Fail to Fetch!');
      throw error;
    }

    const coaches = [];

    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
      };
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches);
    context.commit('setFetchTimestamp');
  },
};
