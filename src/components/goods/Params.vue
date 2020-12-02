<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                show-icon
                :closable="false">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 级联选择框 -->
                    <el-cascader
                        v-model="cateValue"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleChange"
                        clearable></el-cascader>
                </el-col>
            </el-row>
            <!-- Tabs 区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="用户管理" name="many" :disabled="tabPaneUsed">
                    <el-button type="primary" size="mini" @click="addParamsDialogVisible=true" :disabled="tabPaneUsed">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyArrtList" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="only" :disabled="tabPaneUsed">
                    <el-button type="primary" size="mini" :disabled="tabPaneUsed"
                    @click="addParamsDialogVisible=true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyArrtList" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数对话框 -->
        <el-dialog
            :title="dialogText.title"
            :visible.sync="addParamsDialogVisible"
            width="50%"
            @close="addParamsDialogClosed">
            <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRuleFormRef" label-width="100px">
                <el-form-item :label="dialogText.label" prop="arrt_name">
                    <el-input v-model="addParamsForm.arrt_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            /* 商品分类列表 */
            cateList:[],
            /* 级联选择器选中的商品id */
            cateValue:[],
            /* 级联选择器配置 */
            cateProps:{
                expandTrigger:"hover",
                value:"cat_id",
                label:"cat_name",
                children:"children"
            },
            /* 被激活的 tab 名称 */
            activeName:"many",
            /* 动态参数数据 */
            manyArrtList:[],
            /* 静态属性数据 */
            onlyArrtList:[],
            /* 添加参数对话框是否隐藏 */
            addParamsDialogVisible:false,
            /* 添加参数的表单数据 */
            addParamsForm:{
                arrt_name:"",
            },
            /* 添加参数的规则 */
            addParamsRules:{
                arrt_name:[
                    {required:true,message:"请输入参数名称",tigger:"blur"},
                    {min:1,max:15,message:"参数名称为 1~15 个字符"}
                ]
            }
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        /* 获取商品列表 */
        async getCateList(){
            const {data:res} = await this.$http.get("categories");
            if(res.meta.status !== 200) return this.$message.error("获取商品分类列表失败");
            this.cateList = res.data;
        },
        /* 级联选择器的所选项改变时触发 */
        handleChange(){
            if(this.cateValue.length !==3){
                this.cateValue.length = 0;
                return this.$message.info("请选择第三级分类");
            }
            this.getArrtList()
        },
        /* tabs切换时的事件 */
        handleTabClick(){
            this.getArrtList();
        },
        /* 获取参数列表 */
        async getArrtList(){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
            if(res.meta.status !==200) return this.$message.error("获取参数失败")
            if(this.activeName ==="many"){
                this.manyArrtList = res.data
            }else{
                this.onlyArrtList = res.data
            }
        },
        /* 添加动态参数表单关闭时的事件 */
        addParamsDialogClosed(){
            this.$refs.addParamsRuleFormRef.resetFields();
        },
        /* 添加动态参数 */
        addParams(){
            /* 提交前再次验证规则 */
            const a = this.$refs.addParamsRuleFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addParamsForm.arrt_name,attr_sel:this.activeName});
                if(res.meta.status !==201) return this.$message.error("添加属性失败");
                this.$message.success("添加属性成功");
                this.addParamsDialogVisible = false;
                this.getArrtList()
            })
        }
    },
    computed:{
        /* 判断 el-tab-pane 是否可用 */
        tabPaneUsed(){
            if(this.cateValue.length !==3) return true;
            return false
        },
        /* 选中的三级分类的ID */
        cateId(){
            if(this.cateValue.length===3)return this.cateValue[2];
            return null
        },
        /* 对话框计算属性 */
        dialogText(){
            if(this.activeName ==="many")return {title:"添加动态参数",label:"参数名称"};
            return {title:"添加静态属性",label:"属性名称"};
        },
    }
}
</script>

<style lang="scss" scoped>
    .cat_opt{
        margin:15px 0;
    }
</style>