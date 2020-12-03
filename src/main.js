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

/* 全局时间过滤器 */
Vue.filter("dateFormat", function(time) {
  let date = new Date(parseInt(time));
  let year = date.getFullYear();
  /* padStart(2,"0") :总长度2位，不足的前面用0补齐 */
  let mon = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date
    .getDate()
    .toString()
    .padStart(2, "0");
  let hou = date
    .getHours()
    .toString()
    .padStart(2, "0");
  let min = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  let ss = date
    .getSeconds()
    .toString()
    .padStart(2, "0");
  return `${year}-${mon}-${day} ${hou}:${min}:${ss}`;
});
//导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
//require style 导入富文本编辑器对应样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
//将富文本编辑器全局注册
Vue.use(VueQuillEditor /* { default global options } */);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
