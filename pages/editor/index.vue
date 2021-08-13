<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="文章主题"
                  v-model="article.title"
                  required
                  :disabled="publishChecked"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="文章描述"
                  v-model="article.description"
                  :disabled="publishChecked"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="文章内容（md格式）"
                  v-model="article.body"
                  :disabled="publishChecked"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="输入标签,多个中文逗号隔开"
                  v-model="tagList"
                  :disabled="publishChecked"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                :disabled="publishChecked"
                @click="publishArticle"
              >
                {{ slug ? 'Update' : 'Publish'}} Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, updateArticle, getArticleDetail } from '@/api/article'
export default {
  middleware: 'authenticated',
  name: 'edit',
  data () {
    return {
      slug: '',
      publishChecked: false,
      tagList: '',
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      }
    }
  },
  mounted () {
    this.slug = this.$route.query?.slug || ''
    this.getArticle(this.slug)
  },
  watchQuery: ['slug'],
  methods: {
    async getArticle (slug) {
      if (!slug) return
      const { data } = await getArticleDetail(slug)
      this.article = data.article
      this.tagList = data.article.tagList.join('，')
    },
    async publishArticle () {
      this.publishChecked = true
      this.article.tagList = this.tagList.split('，')

      const { data } = this.slug
        ? await updateArticle(this.slug, {
          article: this.article
        })
        : await createArticle({
          article: this.article
        })
      this.publishChecked = false

      this.$router.push({
        name: 'article',
        params: {
          slug: data.article.slug
        }
      })
    }
  }
}
</script>

<style>
</style>
