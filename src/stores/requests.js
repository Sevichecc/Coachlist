import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useRequestsStore = defineStore('requests', {
  state: () => {
    requests: [];
  },
  getters: {
    requests: (state) => {
      const coachId = useAuthStore.userId;
      return state.requests.filter((req) => req.coachId === coachId);
    },
    hasRequests: () => {
      return this.requests && this.requests.length > 0;
    },
  },
  actions: {
    addRequest(payload) {
      this.requests.push(payload);
    },
    setRequest(payload) {
      this.requests = payload;
    },

    async contactCoach(payload) {
      const newRequest = {
        userEmail: payload.email,
        message: payload.message,
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/request/${payload.coachId}.json`,
        {
          method: 'POST',
          body: JSON.stringify(newRequest),
        }
      );
      const responseData = await response.json();

      newRequest.id = response.name;
      newRequest.coachId = payload.coachId;

      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to send request.'
        );
        throw error;
      }
      this.addRequest(newRequest);
    },

    async fetchRequests() {
      const coachId = useAuthStore.userId;
      const token = useAuthStore.token;
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/request/${coachId}.json?auth=` +
          token
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to fetch request.'
        );
        throw error;
      }

      const requests = [];
      for (const key in responseData) {
        const request = {
          id: key,
          coachId: coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message,
        };
        requests.push(request);
      }
      this.setRequest(requests);
    },
  },
});
