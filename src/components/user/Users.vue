<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索和添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8" >
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" @change="getUserList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色名" prop="role_name"></el-table-column>
                <el-table-column label="创建时间">
                    <template slot-scope="scope">
                        {{transitionTime(scope.row.create_time)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template >
                        <el-tooltip class="item" effect="dark" content="修改角色" placement="top" :enterable="false" :open-delay="parseInt(500)">
                            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false" :open-delay="parseInt(500)">
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" :open-delay="parseInt(500)">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="userTotal">
            </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%">
            <!-- 内容主题区域 -->
            <span>这是一段信息</span>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                query:"",
                pagenum:1,
                pagesize:2
            },
            userList:[],
            userTotal:0,
            //控制添加用户的对话框是否隐藏
            addDialogVisible:false
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        /* 获取用户数据 */
        async getUserList(){
            const {data:res} = await this.$http.get("users",{
                params:this.queryInfo
            })
            if(res.meta.status !==200) return this.$message.error("用户列表获取失败");
            this.userList = res.data.users;
            this.userTotal = res.data.total;
            console.log("hello")
        },
        /* 监听 pagesize 的改变 */
        handleSizeChange(newPage){
            this.queryInfo.pagesize = newPage;
            this.getUserList()
        },
        /* 监听 页码值 的改变 */
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getUserList()
        },
        /* 监听switch事件改变，修改用户状态*/
        async userStateChange(userInfo){
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
            if(res.meta.status !==200) {
                userInfo.mg_state = !userInfo.mg_state;
                return this.$message.error("修改用户状态失败");
            }else{
                this.$message.success("更新用户状态成功")
            }
        },
        /* 转换时间 */
        transitionTime(time){
            let date = new Date(parseInt(time));
            let year = date.getFullYear();
            let mon = date.getMonth()+1;
            let day = date.getDate();
            return year + "." + mon + "." + day
        }
    } 
}
</script>
