<template>
  <div class="article-meta">
    <nuxt-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{ name: 'profile', params: { username: article.author.username } }"
        class="author"
        >{{ article.author.username }}
        </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMMM DD, YYYY") }}</span>
    </div>
    <template v-if="isAuth">
      <!-- 修改按钮 -->
      <span>
        <nuxt-link
          :to="{ name: 'editor', query: { slug: article.slug } }"
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="ion-edit"></i> Edit Article
        </nuxt-link>
        <!-- 删除按钮 -->
        <button
          class="btn btn-outline-danger btn-sm"
          @click="deleteArticle(article.slug)"
        >
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ 'active': article.author.following }"
        :disabled='followChecked'
        @click="follow"
      >
        <i class="ion-plus-round"></i>
        &nbsp;{{ !article.author.following ? 'Follow' : 'unFollow'}}  {{ article.author.username }}
        <span class="counter">(10)</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ 'active': article.favorited }"
        @click="addFavorite(article)"
        :disabled="article.favoriteDisabled"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";
import { deleteArticle } from "@/api/article";
export default {
  name: "articleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data(){
    return {
      followChecked:false,
    }
  },
  methods: {
    async deleteArticle(slug) {
      const { data } = await deleteArticle(slug);
    },
    async follow() {
      if(!this.$store.state.auth){
        this.$router.push('/login')
        return
      }
      this.followChecked = true;
      const { following, username} = this.article.author
      const { data } = !following
        ? await addFollow(username)
        : await deleteFollow(username);
      this.article.author.following = !this.article.author.following;
      this.followChecked = false;
    },
     async addFavorite(article){
      // 点赞文章的时候要判断用户是否登录
      if(!this.$store.state.auth){
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
    isAuth() {
      return this.article.author.username === this.$store.state.auth.username;
    },
  },
};
</script>

<style>
</style>