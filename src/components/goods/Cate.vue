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
                <template slot="isok" scope="scope">
                    <i class="el-icon-success" v-if="!scope.row.car_deleted"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <template slot="order" scope="scope">
                    <el-tag type="danger" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="success" v-else>三级</el-tag>
                </template>
                <template slot="opt" scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="addCateDialogVisible"
            width="50%">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
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
                cat_name:""
            },
            /* 添加分类规则 */
            addCateFormRules:{
                cat_name:[
                    {required:true,message:"请输入分类名称",tigger:"blur"}
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
            this.$message.success("获取商品列表成功");
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
            this.addCateDialogVisible = true;
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
</style>