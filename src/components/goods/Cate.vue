<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 添加分类按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.car_deleted"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="success" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options指定数据源
                         props指定数据对象 
                         v-model绑定的必须是一个数组-->
                    <el-cascader
                        v-model="cateValue"
                        :options="parentCateList"
                        :props="parentCateProps"
                        @change="handleChange"
                        clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editCateDialogVisible"
            width="50%"
            @close="editCateDialogClosed">
            <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
export default {
    data(){
        return{
            /* 查询分类时发送的数据 */
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            /* 商品分类列表 */
            cateList:[],
            /* 商品分类总数据条数 */
            total:0,
            /* 为tree-table指定列的定义 */
            columns:[
                {label:"分类名称",prop:"cat_name"},
                {label:"是否有效",type:"template",template:"isok"},
                {label:"排序",type:"template",template:"order"},
                {label:"操作",type:"template",template:"opt"},
            ],
            /* 添加分类对话框是否可见 */
            addCateDialogVisible:false,
            /* 添加分类对话框表单数据 */
            addCateForm:{
                cat_name:"",
                /* 父级分类ID */
                cat_pid:0,
                /* 分类层级 ，默认要添加一级分类*/
                cat_level:0
            },
            /* 添加分类规则 */
            addCateFormRules:{
                cat_name:[
                    {required:true,message:"请输入分类名称",trigger:"blur"}
                ]
            },
            /* 父级分类列表 */
            parentCateList:[],
            /* 父级分类列表选中的分类（数组） */
            cateValue:[],
            /* 级联选择器的配置 */
            parentCateProps:{
                checkStrictly:true,
                expandTrigger:"hover",
                value:"cat_id",
                label:"cat_name",
                children:"children"
            },
            /* 编辑分类对话框是否可见 */
            editCateDialogVisible:false,
            /* 编辑分类对话框表单数据 */
            editCateForm:{
                cat_id:0,
                cat_name:""
            },
            /* 编辑分类规则 */
            editCateFormRules:{
                cat_name:[
                    {required:true,message:"请输入分类名称",trigger:"blur"}
                ]
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        /* 获取商品分类数据 */
        async getCateList(){
            const {data:res} = await this.$http.get("categories",{
                params:this.queryInfo
            });
            if(res.meta.status !== 200) return this.$message.error("获取商品分类列表失败");
            this.cateList = res.data.result;
            this.total = res.data.total;
        },
        /* 监听pagesize改变的事件 */
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList()
        },
        /* 监听pagenum改变的事件 */
        handleCurrentChange(newNum){
            this.queryInfo.pagenum = newNum;
            this.getCateList()
        },
        /* 点击添加分类按钮事件 */
        showAddCateDialog(){
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        /* 获取父级分类的数据列表 */
        async getParentCateList(){
            const {data:res} =await this.$http.get("categories",{params:{type:2}});
            if(res.meta.status !== 200) return this.$message.error("获取商品分类列表失败");
            this.parentCateList = res.data
        },
        /* 级联选择器改变后的事件 */
        handleChange(){
            if(this.cateValue.length>0){
                this.addCateForm.cat_pid = this.cateValue[this.cateValue.length -1];
                this.addCateForm.cat_level = this.cateValue.length;
            }else{
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            }
        },
        /* 添加分类事件 */
        addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$http.post("categories",this.addCateForm);
                if(res.meta.status !==201) return this.$message.error("添加商品分类失败");
                this.$message.success("添加商品分类成功");
                this.getCateList()
                this.addCateDialogVisible = false;
            });
        },
        /* 添加分类对话框关闭事件 */
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.cateValue.length = 0
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        },
        /* 编辑分类按钮事件 */
        showEditCateDialog(id){
            this.editCateForm.cat_id =id.cat_id;
            this.editCateDialogVisible=true;
        },
        /* 编辑分类对话框关闭时的事件 */
        editCateDialogClosed(){
            this.$refs.editCateFormRef.resetFields()
        },
        /* 编辑分类事件 */
        editCate(){
            this.$refs.editCateFormRef.validate(async valid=>{
                const {data:res}=await this.$http.put(`categories/${this.editCateForm.cat_id}`,{cat_name:this.editCateForm.cat_name});
                if(res.meta.status!==200) return this.$message.error(res.meta.msg);
                this.$message.success("编辑商品分类成功");
                this.getCateList()
                this.editCateDialogVisible = false;
            })
        },
        /* 删除分类按钮事件 */
        async removeCateById(id){
            const a = await this.$confirm("此操作将永久删除该分类, 是否继续?","提示",{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).catch(()=>this.$message.info("已取消删除"));
            if(a == "confirm"){
                const {data:res} = await this.$http.delete(`categories/${id.cat_id}`);
                if(res.meta.status!==200) return this.$message.error("删除分类失败");
                this.$message.success("删除分类成功");
                this.getCateList()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-icon-success{
        color:lightgreen;
    }
    .el-icon-error{
        color:red;
    }
    .treeTable{
        margin-top:15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>