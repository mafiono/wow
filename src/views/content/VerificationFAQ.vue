<template>
    <ContentCMS v-if="sweep" :pageId="pageId" />
  </template>
  
  <script>
  import ContentCMS from '@/components/templates/ContentCMS.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        pageId: 18362,
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
  
  <style>
    .page-payment-faq .content ul>li {
      margin-bottom: 1rem;
    }
  </style>
  