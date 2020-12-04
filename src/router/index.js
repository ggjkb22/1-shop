import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Welcome from "@/components/Welcome.vue";
import Users from "@/components/user/Users.vue";
import Roles from "@/components/right/Roles.vue";
import Rights from "@/components/right/Rights.vue";
import Cate from "@/components/goods/Cate.vue";
import Params from "@/components/goods/Params.vue";
import GoodsList from "@/components/goods/List.vue";
import Add from "@/components/goods/Add.vue";
import Orders from "@/components/order/Orders.vue";
import Reports from "@/components/report/Reports.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (window.sessionStorage.getItem("token")) return next("/home");
      next();
    },
  },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/users", component: Users },
      { path: "/roles", component: Roles },
      { path: "/rights", component: Rights },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params },
      { path: "/goods", component: GoodsList },
      { path: "/goods/add", component: Add },
      { path: "/orders", component: Orders },
      { path: "/reports", component: Reports },
    ],
  },
];

const router = new VueRouter({
  routes,
});

//路由的全局前置守卫
router.beforeEach((to, from, next) => {
  //to 目标路由
  //from 从哪个路由来
  //next next()为放行，next(false)为中断当前导航,next("/")强制跳转到"/"路由
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
