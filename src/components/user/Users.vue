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
                <el-table-column label="角色" prop="role_name"></el-table-column>
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
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改角色" placement="top" :enterable="false" :open-delay="parseInt(500)">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false" :open-delay="parseInt(500)">
                            <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" :open-delay="parseInt(500)">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showAllotDialog(scope.row)"></el-button>
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
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="addForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" show-password clearable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" >
                    <el-input v-model="addForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile" clearable></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username" >
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" >
                    <el-input v-model="editForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile" clearable></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配用户对话框 -->
        <el-dialog 
        title="分配角色"
        :visible.sync="allotDialogVisible"
        width="50%"
        @close="allotDiglogClosed">
            <div>
                <p>当前用户：{{userInfo.username}}</p>
                <p>当前角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allotDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        //自定义表单校验规则
        const checkEmail=(rule,value,callback)=>{
            const regEmail = /^[\w\-]+@[\w\-]+\.(com|org|cn|cc|net)$/i;
            if(regEmail.test(value)){
                //合法的邮箱
                return callback()
            }else{
                callback(new Error("该邮箱不合法"))
            }
        };
        const checkMobile = (rule,value,callback)=>{
            const regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
            if(regMobile.test(value)){
                return callback()
            }else{
                callback(new Error("该手机号不合法"))
            }
        };
        
        return{
            queryInfo:{
                query:"",
                pagenum:1,
                pagesize:5
            },
            userList:[],
            userTotal:0,
            //控制添加用户的对话框是否隐藏
            addDialogVisible:false,
            //控制修改用户的对话框是否隐藏
            editDialogVisible:false,
            /* 添加用户表单数据 */
            addForm:{
                username:"",
                password:"",
                email:"",
                mobile:""
            },
            /* 修改用户信息的表单数据 */
            editForm:{
                id:"",
                username:"",
                email:"",
                mobile:""
            },
            /* 添加表单验证规则 */
            addFormRules:{
                username:[
                    {required:true,message:"请输入用户名",trigger:"blur"},
                    {min:3,max:10,message:"用户名长度为 3~10 个字符",trigger:"blur"}
                ],
                password:[
                    {required:true,message:"请输入密码",trigger:"blur"},
                    {min:6,max:15,message:"密码长度为 6~15 个字符",trigger:"blur"}
                ],
                email:[
                    {required:true,message:"请输入邮箱",trigger:"blur"},
                    {validator:checkEmail,trigger:"blur"},
                ],
                mobile:[
                    {required:true,message:"请输入手机号",trigger:"blur"},
                    {validator:checkMobile,trigger:"blur"},
                ]
            },
            editFormRules:{
                email:[
                    {required:true,message:"请输入邮箱",trigger:"blur"},
                    {validator:checkEmail,trigger:"blur"},
                ],
                mobile:[
                    {required:true,message:"请输入手机号",trigger:"blur"},
                    {validator:checkMobile,trigger:"blur"},
                ]
            },
            /* 分配角色对话框是否显示 */
            allotDialogVisible:false,
            /* 需要被分配角色的用户信息 */
            userInfo:{},
            /* 所有角色的数据列表 */
            rolesList:[],
            /* 选中的角色的ID */
            selectRoleId:""
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
        },
        /* 监听添加用户对话框关闭时的事件 */
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        /* 监听修改用户对话框关闭时的事件 */
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        /* 添加用户按钮事件 */
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.post("users",this.addForm);
                if(res.meta.status!=201) return this.$message.error(res.meta.msg);
                this.addDialogVisible = false;
                this.$message.success("用户创建成功");
                this.getUserList();
            })
        },
        /* 修改用户按钮事件 */
        editUser(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.put(`users/${this.editForm.id}`,{email:this.editForm.email,mobile:this.editForm.mobile});
                if(res.meta.status!=200) return this.$message.error(res.meta.msg);
                this.editDialogVisible = false;
                this.$message.success("修改用户信息成功");
                this.getUserList()
            })
        },
        /* 修改用户信息的按钮事件 */
        showEditDialog(id){
            this.editDialogVisible = true;
            this.editForm.id = id.id;
            this.editForm.username = id.username;
            this.editForm.mobile = id.mobile;
            this.editForm.email = id.email;
        },
        /* 删除用户按钮事件 */
        async removeUserById(id){
            const a = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(()=>this.$message.info("已取消删除"))
            if(a =="confirm"){
                const {data:res} = await this.$http.delete(`users/${id}`);
                if(res.meta.status!==200) return this.$message.error(res.meta.msg);
                this.$message.success("删除用户成功");
                this.getUserList()
            }
        },
        /* 分配角色对话框显示事件 */
        async showAllotDialog(userInfo){
            this.userInfo = userInfo;
            /* 在展示对话框之前获取所有角色列表 */
            const {data:res} = await this.$http.get("roles");
            if(res.meta.status !== 200) return this.$message.error("获取角色列表失败");
            this.rolesList = res.data;
            console.log(this.rolesList);
            this.allotDialogVisible =true;
        },
        /* 点击按钮，分配角色 */
        async saveRoleInfo(){
            if(!this.selectRoleId) return this.$message.error("请先选择要分配的角色");
            const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId});
            if(res.meta.status !==200) return this.$message.error("分配角色失败");
            this.$message.success("分配角色成功");
            this.allotDialogVisible =false;
            this.getUserList()
        },
        /* 分配角色对话框关闭事件 */
        allotDiglogClosed(){
            this.selectRoleId = "";
            this.userInfo={}
        }
    }
}
</script>
