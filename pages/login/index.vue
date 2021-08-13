<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>
          <ul class="error-messages">
            <template v-for="messages in errors">
              <li v-for="(msg, index) in messages" :key="index">
                {{ index }} {{ msg }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="user.email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                required
                minlength="8"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from "@/api/user";
// 仅在客户端加载这个包
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'not-authenticated',
  name: "loginPage",
  data() {
    return {
      user: {
        username: '',
        email: "",
        password: "",
      },  
      errors: {
      },
    };
  },
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  methods: {
    // 提交登录请求
    async onSubmit() {
      try {
        // 提交表单登录
        const { data } = this.isLogin ?  await login({
          user: this.user,
        }) : await register({
          user: this.user
        });
        // 保存用户的登录状态
        this.$store.commit('setAuth', data.user)
        // 为了防止刷新页面数据丢失 我们需要把数据持久化
         Cookie.set('auth', JSON.stringify(data.user))
        // 跳转到首页
        this.$router.push('/')
      } catch (error) {
        this.errors = error.response.data;
      }
    },
  },
};
</script>

<style>
</style>