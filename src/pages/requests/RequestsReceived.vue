<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
      >{{ error }}</base-dialog
    >
    <section>
      <base-card>
        <header>
          <h2>Request Received</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="!isLoading && hasRequests">
          <request-item
            v-for="req in receivedRequests"
            :key="req.id"
            :email="req.userEmail"
            :message="req.message"
          ></request-item>
        </ul>
        <h3 v-else>You haven't received any request yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
import { useRequestsStore } from '../../stores/requests.js';
import { mapStores } from 'pinia';
export default {
  components: { RequestItem },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapStores(useRequestsStore),
    receivedRequests() {
      return this.requests();
    },
    hasRequests() {
      return this.hasRequests();
    },
  },
  created() {
    this.loadRequest();
  },
  methods: {
    async loadRequest() {
      this.loadRequest = true;
      try {
        await this.fetchRequests();
      } catch (error) {
        this.error = error.message || 'Something went wrong';
      }
      this.loadRequest = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
