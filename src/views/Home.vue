<template>
    <div>
        Home组件
        <el-button type="info" @click="loginOut">退出登录</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        loginOut(){
            window.sessionStorage.removeItem("token");
            this.$router.push("/login");
            this.$message("成功退出登录")
        }
    },
}
</script>

<style lang="scss" scoped>
    
</style>