import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
//全局样式表
import "@/assets/global.css";
//iconfont图标字体
import "@/assets/icon/iconfont.css";
//vue-table-with-tree-grid
import treeTable from "vue-table-with-tree-grid";
//axios
import axios from "axios";
axios.interceptors.request.use((config) => {
  config.baseURL = "http://119.45.48.253:8888/api/private/v1/";
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

//手动注册tree-table
Vue.component("tree-table", treeTable);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
