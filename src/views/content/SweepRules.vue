<template>
    <ContentCMS v-if="sweep" :pageId="pageId" />
  </template>
  
  <script>
  import ContentCMS from '@/components/templates/ContentCMS.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        pageId: process.env.VUE_APP_API_PAGEID_SWEEPRULES,
      };
    },
    components: {
      ContentCMS,
    },
    computed: {
      ...mapGetters(['sweep']),
    },
  };
  </script>
  