<template>
  <div class="row">
    <div class="col-xs-12 col-md-8 offset-md-2">
      <form class="card comment-form">
        <div class="card-block">
          <!-- 用户评论 -->
          <textarea
            class="form-control"
            placeholder="Write a comment..."
            rows="3"
            v-model="comment"
          ></textarea>
        </div>
        <div class="card-footer">
          <!-- 用户头像（登录） -->
          <img :src="auth.image" class="comment-author-img" v-if="auth" />
          <!-- 发表评论（登录） -->
          <button class="btn btn-sm btn-primary" @click.prevent="postComment">
            Post Comment
          </button>
        </div>
      </form>

      <div class="card" v-for="comment in comments" :key="comment.id">
        <div class="card-block">
          <p class="card-text">
            {{ comment.body }}
          </p>
        </div>
        <div class="card-footer">
          <!-- 评论的作者详情 -->
          <nuxt-link
            :to="{
              name: 'profile',
              params: { username: comment.author.username },
            }"
            class="comment-author"
          >
            <img
              src="http://i.imgur.com/Qr71crq.jpg"
              class="comment-author-img"
            />
          </nuxt-link>
          &nbsp;
          <nuxt-link
            :to="{
              name: 'profile',
              params: { username: comment.author.username },
            }"
            class="comment-author"
            >{{ comment.author.username }}</nuxt-link
          >
          <span class="date-posted">{{
            comment.createdAt | date("MMMM DD, YYYY")
          }}</span>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComments } from '@/api/article'
import { mapState } from 'vuex'
export default {
  name: 'article-comments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [], // 文章列表
      comment: '' // 新增评论
    }
  },
  computed: {
    ...mapState(['auth'])
  },
  methods: {
    // 发表评论
    async postComment () {
      // 如果用户未登录当用户去登录
      if (!this.auth) {
        // 登录后返回当前页面
        this.$router.push('/login')
      } else {
        const params = {
          comment: {
            body: this.comment
          }
        }
        await addComments(this.article.slug, params)
      }
    }
  },
  // 评论不需要SEO
  // 客户端加载
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  }
}
</script>

<style>
</style>
