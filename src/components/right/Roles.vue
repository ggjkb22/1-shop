<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['tag-bottom',index1===0?'tag-top':'','a-center']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag type="danger" closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2===0?'':'tag-top','a-center']">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable v-for="item3 in item2.children" :key="item3.id" type="success" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addRoleDialogVisible"
            width="50%"
            @close="addRoleDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="70px">
                <el-form-item label="角色名" prop="roleName" >
                    <el-input v-model="addRoleForm.roleName" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc" type="textarea" maxlength="30" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色对话框 -->
        <el-dialog
            title="修改角色信息"
            :visible.sync="editRoleDialogVisible"
            width="50%"
            @close="editRoleDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">
                <el-form-item label="角色名" prop="roleName" >
                    <el-input v-model="editRoleForm.roleName" clearable></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc" type="textarea" maxlength="30" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
            <!-- 树形空间 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //角色列表数据
            roleList:[],
            /* 角色权限列表 */
            rightsList:[],
            /* 添加角色对话框是否显示 */
            addRoleDialogVisible:false,
            /* 编辑角色对话框是否显示 */
            editRoleDialogVisible:false,
            /* 分配权限对话框是否显示 */
            setRightDialogVisible:false,
            /* 添加角色表单数据*/
            addRoleForm:{
                roleName:"",
                roleDesc:""
            },
            /* 修改角色表单数据 */
            editRoleForm:{
                id:"",
                roleName:"",
                roleDesc:""
            },
            /* 添加角色规则 */
            addRoleFormRules:{
                    roleName:[
                        {required:true,message:"请输入角色名",trigger:"blur"},
                        {min:2,max:10,message:"角色名长度为 2~10 个字符",trigger:"blur"}
                    ],
            },
            /* 修改角色规则 */
            editRoleFormRules:{
                    roleName:[
                        {required:true,message:"请输入角色名",trigger:"blur"},
                        {min:2,max:10,message:"角色名长度为 2~10 个字符",trigger:"blur"}
                    ],
            },
            /* 树形空间的属性绑定 */
            treeProps:{
                children:"children",
                label:"authName",
            },
            /* 树形空间默认选中的id */
            defKeys:[],
            /* 当前即将分配权限的ID */
            roleId:""
            
        }
    },
    created(){
        //获取角色列表数据
        this.getRoleList()
    },
    methods:{
        /* 获取角色列表数据 */
        async getRoleList(){
            const {data:res} = await this.$http.get("roles");
            if(res.meta.status !==200) return this.$message.error("获取角色列表失败");
            this.roleList = res.data
        },
        /* 监听添加用户对话框关闭时的事件 */
        addRoleDialogClosed(){
            this.$refs.addRoleFormRef.resetFields();
        },
        /* 监听修改用户对话框关闭时的事件 */
        editRoleDialogClosed(){
            this.$refs.editRoleFormRef.resetFields();
        },
        /* 监听分配权限对话框关闭时的事件 */
        editRoleDialogClosed(){
            this.$refs.editRoleFormRef.resetFields();
        },
        /* 添加角色 */
        async addRole(){
            this.$refs.addRoleFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.post("roles",this.addRoleForm);
                if(res.meta.status !==201) return this.$message.error(res.meta.msg);
                this.addRoleDialogVisible = false;
                this.$message.success("角色创建成功");
                this.getRoleList();
            })
        },
        /* 编辑角色 */
        showEditRoleDialog(id){
            this.editRoleDialogVisible = true;
            this.editRoleForm.roleName = id.roleName;
            this.editRoleForm.roleDesc = id.roleDesc;
            this.editRoleForm.id = id.id;
        },
        editRole(){
            this.$refs.editRoleFormRef.validate(async valid=>{
                if(!valid) return ;
                const {data:res} = await this.$http.put(`roles/${this.editRoleForm.id}`,{roleName:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc});
                if(res.meta.status !==200) return this.$message.error(res.meta.msg);
                this.editRoleDialogVisible = false;
                this.$message.success("角色修改成功");
                this.getRoleList();
            })
        },
        /* 展示分配权限对话框 */
        async showSetRightDialog(role){
            this.roleId = role.id
            const {data:res} = await this.$http.get("rights/tree");
            if(res.meta.status !==200) return this.$message.error("获取权限列表失败");
            this.rightsList = res.data;
            this.getDefKeys(role,this.defKeys);
            this.setRightDialogVisible = true;
        },
        /* 删除角色 */
        async removeRoleById(id){
            const a = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(()=>this.$message.info("已取消删除"))
            if(a =="confirm"){
                const {data:res} = await this.$http.delete(`roles/${id}`);
                if(res.meta.status!==200) return this.$message.error("删除角色失败");
                this.$message.success("删除角色成功");
                this.getRoleList()
            }
        },
        /* 删除权限 */
        async removeRightById(r,id){
            const a = await this.$confirm('此操作将取消当前角色该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(()=>this.$message.info("已取消操作"))
            if(a =="confirm"){
                const {data:res} = await this.$http.delete(`roles/${r.id}/rights/${id}`);
                if(res.meta.status!==200) return this.$message.error(res.meta.msg);
                this.$message.success("取消权限成功");
                r.children = res.data;
            }
        },
        /* 递归出defKeys */
        getDefKeys(node,arr){
            if(!node.children) return arr.push(node.id);
            node.children.forEach(item=>{
                this.getDefKeys(item,arr)
            })
        },
        /* 分配权限对话框关闭时的函数，用于清除defKeys */
        setRightDialogClosed(){
            this.defKeys.length = 0
        },
        /* 分配权限 */
        async allotRights(){
            const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
            const idStr = keys.join(",");
            const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
            if(res.meta.status !==200) return this.$message.error(res.meta.msg);
            this.$message.success("分配权限成功");
            this.setRightDialogVisible = false;
            this.getRoleList()
        },
    }
}
</script>

<style lang="scss" scoped>
    .tag-bottom{
        border-bottom: 1px solid #eee;
    }
    .tag-top{
        border-top: 1px solid #eee;
    }
    .a-center{
        display: flex;
        align-items: center;
    }
</style>