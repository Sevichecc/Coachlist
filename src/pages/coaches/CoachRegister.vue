<template>
  <section>
    <base-card>
      <h2>Register as a coach now !</h2>
      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
import { useCoachesStore } from '../../stores/coaches.js';
import { mapActions } from 'pinia';
export default {
  components: { CoachForm },
  methods: {
    ...mapActions(useCoachesStore, ['registerCoach']),
    saveData(data) {
      this.registerCoach(data);
      this.$router.replace('/coaches');
    },
  },
};
</script>
