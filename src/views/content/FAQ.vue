<template>
    <ContentCMS :pageId="pageId" />
  </template>
  
  <script>
  import ContentCMS from '@/components/templates/ContentCMS.vue';
  
  export default {
    data() {
      return {
        pageId: process.env.VUE_APP_API_PAGEID_FAQ,
      };
    },
    components: {
      ContentCMS,
    },
  };
  </script>
  
  <style>
    .page-faq .content ul>li {
      margin-bottom: 1rem;
    }
  </style>