import Vue from "vue";
import App from "./App.vue";
import excel from "vue-excel-export";

Vue.config.productionTip = false;
Vue.use(excel);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
