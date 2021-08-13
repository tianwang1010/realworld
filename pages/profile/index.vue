<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
              looks like Peeta from the Hunger Games
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              v-if="profile.username !== auth.username"
              @click="follow"
              :disabled="followChecked"
            >
              <i class="ion-plus-round"></i>
              &nbsp;{{ !profile.following ? 'Follow' : 'unFollow' }}
              {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    path: path,
                    query: {
                      tab: 'my_articles',
                    },
                  }"
                  class="nav-link"
                  :class="{ active: tab === 'my_articles' }"
                  exact
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  :to="{
                    path: path,
                    query: {
                      tab: 'favorite_articles',
                    },
                  }"
                  class="nav-link"
                  :class="{ active: tab === 'favorite_articles' }"
                  exact
                  >Favorited Articles</nuxt-link
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
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date('MMM DD, YYYY')
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="'active' ? article.favorited : ''"
                @click="addFavorite(article)"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
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
              <p>{{ article.description }} {{ article.slug }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

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
                    path,
                    query: { page: item, tab: tab },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, addFollow, deleteFollow } from '@/api/user'
import { mapState } from 'vuex'
import { getArticles, addFavorite, deleteFavorite } from '@/api/article'
export default {
  middleware: 'authenticated',
  name: 'profile',
  async asyncData ({ params, query }) {
    const path = `/profile/${params.username}`
    // 获取到用户主页的信息
    const { data } = await getProfile(params.username)
    // 获取当前页数
    const page = Number.parseInt(query.page || 1)
    // 每页显示条数
    const limit = 1
    const tab = query.tab || 'my_articles'
    const options = {
      limit,
      offset: (page - 1) * limit
    }
    if (tab === 'my_articles') {
      options.author = params.username
    } else {
      options.favorited = params.username
    }
    // 获取用户自己的文章
    const { data: articleData } = await getArticles(options)
    const { articles, articlesCount } = articleData
    articles.forEach((art) => {
      art.favoriteDisabled = false
    })
    return {
      profile: data.profile,
      followChecked: false,
      articles,
      articlesCount,
      path,
      tab,
      limit,
      page
    }
  },
  methods: {
    async follow () {
      if (!this.auth) {
        this.$router.push('/login')
        return
      }
      this.followChecked = true
      !this.profile.following
        ? await addFollow(this.profile.username)
        : await deleteFollow(this.profile.username)
      this.profile.following = !this.profile.following
      this.followChecked = false
    },
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
  },
  computed: {
    ...mapState(['auth']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  watchQuery: ['page', 'tab']
}
</script>

<style></style>
