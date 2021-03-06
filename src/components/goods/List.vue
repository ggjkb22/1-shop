<template>
    <div>
        <!-- 面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索和添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @keydown.enter.native="getGoodsList" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
                <el-table-column label="创建时间" width="160px">
                    <template v-slot="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>
        <!-- 编辑商品对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%">
            <el-form :model="dialogVisibleForm" :rules="dialogVisibleRules" ref="dialogVisibleRef" label-width="100px">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="dialogVisibleForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="dialogVisibleForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="dialogVisibleForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="dialogVisibleForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品介绍" prop="goods_introduce">
                    <el-input v-model="dialogVisibleForm.goods_introduce" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            /* 查询商品对象 */
            queryInfo:{
                query:"",
                pagenum:1,
                pagesize:10
            },
            /* 商品列表 */
            goodsList:[],
            /* 总数据条数 */
            total:0,
            /* 编辑商品对话框显示 */
            dialogVisible:false,
            /* 编辑参数表单数据 */
            dialogVisibleForm:{
                goods_name:"",
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_introduce:""
            },
            /* 编辑参数规则 */
            dialogVisibleRules:{
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
                ]
            },
            /* 当前商品ID */
            currentGoodsId:0
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        /* 根据分页获取对应的商品列表 */
        async getGoodsList(){
            const {data:res} =await this.$http.get("goods",{
                params:this.queryInfo
            });
            if(res.meta.status!==200)return this.$message.error("获取商品列表失败");
            this.goodsList = res.data.goods;
            this.total = res.data.total;
            this.$message.success("获取商品列表成功")
        },
        /* 一页显示多少条数据变化事件 */
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        /* 页码变化事件 */
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList()
        },
        /* 通过ID删除商品 */
        async removeGoodsById(row){
            const a = await this.$confirm("此操作将永久删除该商品, 是否继续?","提示",{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).catch(()=>this.$message.info("已取消删除"));
            if(a == "confirm"){
                const {data:res} = await this.$http.delete(`goods/${row.goods_id}`);
                if(res.meta.status!==200) return this.$message.error("删除商品失败");
                this.$message.success("删除商品成功");
                this.getGoodsList()
            }
        },
        /*  编辑商品  */
        async editGoods(row){
            const {data:res} =await this.$http.get(`goods/${row.goods_id}`);
            if(res.meta.status !==200) return this.$message.error("获取当前商品信息失败");
            this.dialogVisibleForm.goods_name = res.data.goods_name;
            this.dialogVisibleForm.goods_price = res.data.goods_price;
            this.dialogVisibleForm.goods_weight = res.data.goods_weight;
            this.dialogVisibleForm.goods_number = res.data.goods_number;
            this.dialogVisibleForm.goods_introduce = res.data.goods_introduce;
            this.currentGoodsId = res.data.goods_id;
            this.dialogVisible = true;
        },
        /* 编辑商品确认事件 */
        edit(){
            this.$refs.dialogVisibleRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$http.put(`goods/${this.currentGoodsId}`,this.dialogVisibleForm);
                if(res.meta.status !==201) return this.$message.info("抱歉，编辑商品功能正在开发中！")
            })
        },
        /* go添加商品页面 */
        goAddPage(){
            this.$router.push("/goods/add")
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>