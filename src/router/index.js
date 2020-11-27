import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
//全局样式表
import "@/assets/global.css";
//iconfont图标字体
import "@/assets/icon/iconfont.css";
//axios
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.prototype.$http = axios;

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
];

const router = new VueRouter({
  routes,
});

export default router;
