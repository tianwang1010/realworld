<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">个人设置</h1>

          <form>
            <fieldset>
              <fieldset class="form-group" v-if="user.image">
                <input
                  class="form-control"
                  type="text"
                  placeholder="头像链接"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="用户昵称"
                  v-model="user.username"
                />
              </fieldset>
              <fieldset class="form-group" v-if="user.bio">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="简短的自我介绍"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="邮箱"
                  required
                  v-model="user.email"
                />
              </fieldset>
              <fieldset class="form-group" v-if="user.password">
                <input
                  autocomplete="false"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="密码"
                  required
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="checked"
                @click="updateInfo"
              >
                更改设置
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="loginOut">
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'settings',
  async asyncData () {
    const { data } = await getUser()
    data.checked = false
    return data
  },
  methods: {
    async updateInfo () {
      this.checked = true
      const { data } = await updateUser({
        user: this.user
      })
      this.checked = false
      this.$store.commit('setAuth', data.user)
      Cookie.set('auth', JSON.stringify(data.user))
      const { username } = data.user
      this.$router.push(`/profile/${username}`)
    },
    loginOut () {
      this.$store.commit('setAuth', null)
      Cookie.remove('auth')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>
