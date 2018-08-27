import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    render: h => h(App),
    router: new VueRouter({
      routes: []
    })
  }).$mount('#app');
});
