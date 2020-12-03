<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/goods'}">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 信息提示 -->
            <el-alert
                title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- Form表单区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <!-- tabs区域 -->
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量(千克)" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染动态参数表单的Item -->
                        <el-form-item v-for="item in manyList" :label="item.attr_name" :key="item.attr_id">
                            <!-- 复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,index) in item.attr_vals" :key="index" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传图片 -->
                        <!-- action :图片要上传到的后台API地址
                             on-preview : 点击图片弹出的预览事件 
                             on:remove : 删除图片事件-->
                        <el-upload
                            action="http://119.45.48.253:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 确认添加商品按钮 -->
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%">
            <img :src="previewPath" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash"
export default {
    data(){
        return{
            /* 控制步骤的变量 */
            activeIndex:0,
            /* 添加商品表单的数据对象 */
            addForm:{
                goods_name:"",
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                /* 选中的商品分类 */
                goods_cat:[],
                /* 上传图片的临时路径(数组) */
                pics:[],
                /* 商品介绍 */
                goods_introduce:"",
                attrs:[]
            },
            /* 添加商品规则 */
            addFormRules:{
                goods_name:[
                    {required:true,message:"请输入商品名称",trigger:"blur"},
                    {min:1,max:35,message:"商品名称为 1~35 个字符"},
                ],
                goods_price:[
                    {required:true,message:"请输入商品价格",trigger:"blur"},
                ],
                goods_weight:[
                    {required:true,message:"请输入商品重量",trigger:"blur"},
                ],
                goods_number:[
                    {required:true,message:"请输入商品数量",trigger:"blur"},
                ],
                goods_cat:[
                    {required:true,message:"请选择三级分类",trigger:"blur"}
                ]
            },
            /* 商品分类列表 */
            cateList:[],
            /* 级联选择器配置 */
            cateProps:{
                expandTrigger: 'hover',
                label:"cat_name",
                value:"cat_id",
                children:"children"
            },
            /* 动态参数列表 */
            manyList:[],
            /* 静态属性列表 */
            onlyList:[],
            /* 图片上传请求头 */
            headerObj:{
                Authorization: window.sessionStorage.getItem("token")
            },
            /* 预览事件图片地址 */
            previewPath:"",
            /* 图片预览对话框是否可见 */
            previewVisible:false
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        /* 获取分类列表 */
        async getCateList(){
            const {data:res} = await this.$http.get("categories");
            if(res.meta.status !==200) return this.$message.error("获取商品分类列表失败");
            this.cateList = res.data
        },
        /* 级联选择器变化会触发这个函数 */
        handleChange(){
            if(this.addForm.goods_cat.length !==3){
                this.addForm.goods_cat=[];
            }
        },
        /* 获取动态参数或静态属性 */
        async getParams(a){
            const {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:a}});
            if(res.meta.status!==200)return this.$message.error("获取参数失败");
            return res.data
        },
        /* tabs 标签切换事件 */
        beforeTabLeave(n,o){
            if(o ==="0" && this.addForm.goods_cat.length!==3){
                this.$message.error("请选择商品分类");
                return false
            }
        },
        /* tab被选中时的事件 */
        tabClicked(){
            switch(this.activeIndex){
                case "1":
                    this.getParams("many").then(r=>{
                        this.manyList = r;
                        const a =r.forEach(item=>item.attr_vals = item.attr_vals.length===0?[]:item.attr_vals.split(" "))
                    });
                    break;
                case "2":
                    this.getParams("only").then(r=>{
                        this.onlyList = r;
                    })
            }
        },
        /* 图片预览事件 */
        handlePreview(file){
            this.previewPath = file.url;
            this.previewVisible = true;
        },
        /* 图片删除事件 */
        handleRemove(file){
            const filePath = file.response.data.tmp_path;
            const i =this.addForm.pics.findIndex(x=>x.pic===filePath);
            this.addForm.pics.splice(i,1);
        },
        /* 图片上传成功事件 */
        handleSuccess(res,f,fl){
            const picInfo = {pic:res.data.tmp_path}
            this.addForm.pics.push(picInfo);
        },
        /* 添加商品事件 */
        addGoods(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid)return this.$message.error("请填写必要的表单项");
                /* 处理动态参数 */
                this.manyList.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(" ")
                    }
                    this.addForm.attrs.push(newInfo)
                })
                /* 处理静态属性 */
                this.onlyList.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                const form = _.cloneDeep(this.addForm);
                form.goods_cat = form.goods_cat.join(",");
                const {data:res} = await this.$http.post("goods",form);
                if(res.meta.status!==201) return this.$message.error("添加商品失败");
                this.$message.success("添加商品成功");
                this.$router.push("/goods")
            })
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length ===3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-checkbox{
        margin:0 5px 0 0 !important;
    }
    .previewImg{
        width: 100%;
    }
    .btnAdd{
        margin-top:15px ;
    }
</style>