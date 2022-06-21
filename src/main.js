import { createApp, defineAsyncComponent } from 'vue';
import router from './router';
import App from './App.vue';
// import store from './store/index';
import store from './stores';
import BaseCard from './components/ui/BaseCard.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseBadge from './components/ui/BaseBadge.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
// import BaseDialog from './components/ui/BaseDialog.vue';

const app = createApp(App);
const BaseDialog = defineAsyncComponent(() =>
  import('./components/ui/BaseDialog.vue')
);
app.use(router);
app.use(store);

app.component('base-button', BaseButton);
app.component('base-card', BaseCard);
app.component('base-spinner', BaseSpinner);
app.component('base-badge', BaseBadge);
app.component('base-dialog', BaseDialog);
app.mount('#app');
