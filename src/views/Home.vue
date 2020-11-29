<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="@/assets/txbb.jpg">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="loginOut">退出登录</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="asideWidth" >
                <!-- 侧边栏菜单区域 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff" 
                    :unique-opened="true" 
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="navState"
                    >
                    <div class="toggle_button" @click="toggleCollapse">|||</div>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id.toString()" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconFontObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <!--  二级菜单模板-->
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data(){
        return{
            menuList:[],
            iconFontObj:{
                "125":"el-icon-user-solid",
                "103":"el-icon-s-check",
                "101":"el-icon-shopping-bag-1",
                "102":"el-icon-tickets",
                "145":"el-icon-s-data",
            },
            isCollapse:false
        }
    },
    created(){
        this.getMenuList()
    },
    methods: {
        /* 退出登录 */
        loginOut(){
            window.sessionStorage.clear();
            this.$router.push("/login");
            this.$message("成功退出登录")
        },
        /* 获取左侧菜单信息 */
        async getMenuList(){
            const {data:res} = await this.$http.get("menus")
            if(res.meta.status !==200) return this.$message.error("获取数据失败");
            this.menuList = res.data;
        },
        /* 切换侧边栏显示 */
        toggleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        /* 保存页面刷新前的二级标签高亮显示 */
        saveNavState(state){
            window.sessionStorage.setItem("navState",state)
        }
    },
    computed:{
        asideWidth(){
            return this.isCollapse?64+'px': 200+'px'
        },
        navState(){
            return window.sessionStorage.getItem("navState")
        }
    }
}
</script>

<style lang="scss" scoped>
    .home_container{
        height: 100%;
        >.el-header{
            background-color: #373d41;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 10px;
            div{
                display: flex;
                align-items: center;
                img{
                    width: 45px;
                    border-radius: 50%;
                    margin-right: 15px;
                }
                span{
                    font-size: 22px;
                    color: #ecf0f1;
                }
            }
        }
        >.el-container{
            .el-aside{
                background-color:#333744;
                .el-menu{
                    border-right: 0;
                }
                .toggle_button{
                    background-color:#4A5064;
                    color:white;
                    font-size: 14px;
                    line-height: 24px;
                    text-align: center;
                    cursor: pointer;
                    letter-spacing: 2px;
                    &:hover{
                        background-color:#bdc3c7;
                    }
                }
            }
            .el-main{
                background-color: #eaedf1;
            }
        }
    }
</style>