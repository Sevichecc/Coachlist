import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useCoachesStore = defineStore('coaches', {
  state: () => ({
    lastFetch: null,
    coaches: [
      {
        id: 'c1',
        firstName: 'Maximilian',
        lastName: 'Schwarzmüller',
        areas: ['frontend', 'backend', 'career'],
        description:
          "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
        hourlyRate: 30,
      },
      {
        id: 'c2',
        firstName: 'Julie',
        lastName: 'Jones',
        areas: ['frontend', 'career'],
        description:
          'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
        hourlyRate: 30,
      },
    ],
  }),

  getters: {
    hasCoaches: (state) => {
      state.coaches && state.coaches.length > 0;
    },
    // 检查是否已有该教练
    isCoach: () => {
      const coaches = this.coaches;
      const userId = useAuthStore.userId;
      return coaches.some((coach) => coach.id === userId);
    },
    shouldUpdate: (state) => {
      const lastFetch = state.lastFetch;
      //如果没有时间戳，就更新
      if (!lastFetch) {
        return true;
      }
      const currentTimestamp = new Date().getTime();
      //超过一分钟就更新
      return (currentTimestamp - lastFetch) / 1000 > 6;
    },
  },
  actions: {
    registerCoach: (payload) => {
      this.coaches.push(payload);
    },
    setCoaches: (payload) => {
      this.coaches = payload;
    },
    setFetchTimestamp: () => {
      this.lastFetch = new Date().getTime();
    },

    // 登记
    async registerCoach(data) {
      const userId = useAuthStore.userId;
      const coachData = {
        firstName: data.first,
        lastName: data.last,
        hourlyRate: data.rate,
        description: data.desc,
        areas: data.areas,
      };
      const token = useAuthStore.token;

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

      this.registerCoach({
        ...coachData,
        id: userId,
      });
    },
    // 加载
    async loadCoaches(payload) {
      if (!payload.forceRefresh && !this.shouldUpdate) {
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
      this.setCoaches(coaches);
      this.setFetchTimestamp();
    },
  },
});
