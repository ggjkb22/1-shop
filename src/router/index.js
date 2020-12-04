import Vue from "vue";
import VueRouter from "vue-router";
//路由懒加载
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "@/views/Login.vue");
// import Home from "@/views/Home.vue";
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "@/views/Home.vue");
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ "@/components/Welcome.vue"
  );
const Users = () =>
  import(
    /* webpackChunkName: "users_roles_rights" */ "@/components/user/Users.vue"
  );
const Roles = () =>
  import(
    /* webpackChunkName: "users_roles_rights" */ "@/components/right/Roles.vue"
  );
const Rights = () =>
  import(
    /* webpackChunkName: "users_roles_rights" */ "@/components/right/Rights.vue"
  );
const Cate = () =>
  import(/* webpackChunkName: "cate_params" */ "@/components/goods/Cate.vue");
const Params = () =>
  import(/* webpackChunkName: "cate_params" */ "@/components/goods/Params.vue");
const GoodsList = () =>
  import(/* webpackChunkName: "goods_add" */ "@/components/goods/List.vue");
const Add = () =>
  import(/* webpackChunkName: "goods_add" */ "@/components/goods/Add.vue");
const Orders = () =>
  import(
    /* webpackChunkName: "orders_reports" */ "@/components/order/Orders.vue"
  );
const Reports = () =>
  import(
    /* webpackChunkName: "orders_reports" */ "@/components/report/Reports.vue"
  );

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
