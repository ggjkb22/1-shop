import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
//全局样式表
import "@/assets/global.css";
//iconfont图标字体
import "@/assets/icon/iconfont.css";
//axios
import axios from "axios";
axios.defaults.baseURL = "http://119.45.48.253:8888/api/private/v1/";
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
