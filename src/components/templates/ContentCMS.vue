<template>
  <div class="section container content content-cms">
    <h3 v-text="title"></h3>
    <div v-html="content"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: null,
      content: null,
    };
  },
  props: {
    pageId: {
      required: true,
    },
  },
  created() {
    this.$store.dispatch('enableLoader');
    this.$apiCmsNew.get(`/pages/${this.pageId}`).then((response) => {
      this.$store.dispatch('disableLoader');
      this.content = response.data.content.rendered;
      this.title = response.data.title.rendered;
    }).catch((error) => {
      this.$store.dispatch('disableLoader');
      if (error.response.status === 404) {
        this.$router.replace({ name: '404 Error' });
      }
    });
  },
};
</script>

<style>
.content-cms {
  margin-top: 2rem;
}
@media (max-width: 767px) {
  .content-cms ol, .content-cms ul {
    padding-left: 1.1rem;
  }
}
</style>
