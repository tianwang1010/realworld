<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <!-- 用户信息组件 -->
        <article-meta :article="article" />
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
        <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline" v-for="(tag, index) in article.tagList" :key='index'>
            {{tag}}
          </li>
        </ul>
      </div>

      <hr />

      <div class="article-actions">
        <!-- 组件 -->
        <article-meta :article="article" />
      </div>
      <article-comments :article="article"></article-comments>
    </div>
  </div>
</template>

<script>
import { getArticleDetail } from "@/api/article";
import MarkdownIt from "markdown-it";
import articleMeta from "./components/article-meta.vue";
import articleComments from './components/article-comments.vue'
export default {
  name: "articlePage",
  async asyncData({ params }) {
    const { data } = await getArticleDetail(params.slug);
    const md = new MarkdownIt();
    const { article } = data;
    article.body = md.render(article.body);
    return {
      article
    };
  },
  components: {
    articleMeta,
    articleComments
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
};
</script>

<style>
</style>