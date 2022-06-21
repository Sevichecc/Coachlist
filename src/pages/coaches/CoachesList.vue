<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred!" @close="handleError"
      ><p>{{ error }}</p></base-dialog
    >
    <section><coach-filter @change-filter="setFilters"></coach-filter></section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login to Register as Coach</base-button
          >
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filterCoaches"
            :key="coach.id"
            :id="coach.id"
            :last-name="coach.lastName"
            :first-name="coach.firstName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          ></coach-item>
        </ul>
        <h3 v-else>No coach found</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import { useCoachesStore } from '../../stores/coaches.js';
import { useAuthStore } from '../../stores/auth.js';
import { mapState, mapStores } from 'pinia';
export default {
  components: { CoachItem, CoachFilter, BaseButton },
  data() {
    return {
      error: null,
      isLoading: false,
      activeFilters: { frontend: true, backend: true, career: true },
    };
  },
  computed: {
    ...mapStores(useCoachesStore),
    ...mapState(useAuthStore, ['isAuthenticated']),
    isLoggedIn() {
      return this.isAuthenticated;
    },
    isCoach() {
      return this.isCoach();
    },

    filterCoaches() {
      const coaches = this.coaches();
      return coaches.filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return !this.isLoading && this.hasCoaches;
    },
  },
  created() {
    this.loadCoaches(false);
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoaches(refresh = true) {
      this.isLoading = true;
      try {
        await this.loadCoaches({
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
