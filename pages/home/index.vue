<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>一个分享知识的地方.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <!-- 个人收藏（登录） -->
              <li class="nav-item" v-if="auth">
                <router-link
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                    },
                  }"
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  >Your Feed</router-link
                >
              </li>
              <!-- 公共列表 -->
              <li class="nav-item">
                <router-link
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed',
                    },
                  }"
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  >Global Feed</router-link
                >
              </li>
              <!-- 标签筛选 -->
              <li class="nav-item" v-if="tag">
                <router-link
                  :to="{
                    name: 'home',
                    query: { tag: tag, tab: 'tag' },
                  }"
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                  >#{{ tag }}</router-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="(article, index) in articles"
            :key="index"
          >
            <div class="article-meta">
              <!-- 访问文章作者 -->
              <nuxt-link
                class="author"
                :to="`/profile/${article.author.username}`"
              >
                <img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <!-- 访问文章作者 -->
                <nuxt-link
                  class="author"
                  :to="`/profile/${article.author.username}`"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <!-- 添加到个人收藏（需要登录） -->
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="addFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <!-- 文章详情 -->
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <!-- 文章详情 -->
              <span
                @click="
                  $router.push({
                    name: 'article',
                    params: {
                      slug: article.slug,
                    },
                  })
                "
                >Read more...</span
              >
            </nuxt-link>
          </div>

          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="(item, index) in totalPage"
                :key="index"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: { page: item, tag: $route.query.tag, tab: tab },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: tag,
                    tab: 'tab',
                  },
                }"
                class="tag-pill tag-default"
                v-for="(tag, index) in tags"
                :key="index"
              >
                {{ tag }}


                
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getFeedArticles,
  addFavorite,
  deleteFavorite
} from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: 'home',
  async asyncData ({ query, store }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const { tag } = query
    const tab = query.tab || 'global_feed'
    const LoadArticles =
      store.state.auth && tab === 'your_feed' ? getFeedArticles : getArticles
    const [articleRes, tagRes] = await Promise.all([
      LoadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data
    articles.forEach((art) => {
      art.favoriteDisabled = false
    })
    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag,
      tab
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['auth']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async addFavorite (article) {
      // 点赞文章的时候要判断用户是否登录
      if (!this.auth) {
        this.$router.push('/login')
        return
      }
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style>
</style>
