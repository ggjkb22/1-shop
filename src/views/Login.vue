<template>
    <div class="login_container">
        <!-- 登录容器 -->
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="@/assets/txbb.jpg">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" prefix-icon="iconfont icon-yonghu" v-model="loginForm.username" clearable></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" prefix-icon="iconfont icon-mima" v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="loginFormReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //登录表单数据绑定对象
            loginForm:{
                username:"admin",
                password:"123456"
            },
            loginFormRules:{
                //用户名验证规则
                username:[
                    { required:true, message:"用户名不能为空", trigger:"blur"},
                    { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur'}
                ],
                //密码验证规则
                password:[
                    { required:true, message:"密码不能为空", trigger:"blur"},
                    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        //重置表单
        loginFormReset(){
            this.$refs.loginFormRef.resetFields()
        },
        //登录
        login(){
            //validate用于提交前的验证，不传回调函数的话会传回一个Promise
            this.$refs.loginFormRef.validate(async (valid,obj)=>{
                // console.log(valid);  //这是验证的状态
                // console.log(obj)     //这是验证失败的具体原因,true则为undefined
                if(!valid) return;
                const {data:a} = await this.$http.post("login",this.loginForm);
                if(a.meta.status!=200){
                   this.$message.error(a.meta.msg)
                }else{
                    this.$message.success("登陆成功");
                    window.sessionStorage.setItem("token",a.data.token);
                    this.$router.push("/home");
                };
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .login_container{
        background-color:#2b4b6b ;
        height: 100%;
        .login_box{
            width: 450px;
            height: 300px;
            background-color: white;
            border-radius: 5px;
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%,-50%);
            .avatar_box{
                height: 130px;
                width: 130px;
                border: 1px solid #eee;
                border-radius: 50%;
                padding: 10px;
                box-shadow: 0 0 10px #ddd;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: white;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .login_form{
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                .btns{
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }
</style>