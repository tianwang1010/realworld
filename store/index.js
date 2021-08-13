const cookieparser = process.server ? require('cookieparser') : undefined
// 在服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突 务必要把state定义成一个函数 返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态
    auth: null
  }
}

export const mutations = {
  setAuth (state, data) {
    state.auth = data
  }
}

export const actions = {
  // 初始化容器以及需要传递给客户端的数据
  // 只会在服务都安渲染期间运行
  // commit：用来提交 mutation 的 commit 方法
  // req：服务端渲染期间的 request 请求对象
  nuxtServerInit ({ commit }, { req }) {
    let auth = null
    // 如果请求头中有 Cookie
    if (req.headers.cookie) {
      // 将请求头中的 Cookie 字符串解析为一个对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        // 将 auth 还原为 JavaScript 对象
        auth = JSON.parse(parsed.auth)
      } catch (error) {
        // No valid cookie found
      }
    }
    // 提交 mutation 修改 state 状态
    commit('setAuth', auth)
  }
}
