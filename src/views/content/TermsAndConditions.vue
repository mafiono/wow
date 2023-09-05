<template>
    <div>
      <ContentCMS :pageId="pageId" />
      <div v-if="loggedIn" class="section container content content-cms">
        <p>For any complaints please contact <a href="mailto:gaming@gov.im">gaming@gov.im</a></p>
      </div>
    </div>
  </template>
  
  <script>
  import ContentCMS from '@/components/templates/ContentCMS.vue';
  
  export default {
    data() {
      return {
        pageId: process.env.VUE_APP_API_PAGEID_TERMS,
      };
    },
    components: {
      ContentCMS,
    },
    computed: {
      currentCountryCode() {
        return this.$store.getters.currentCountryCode;
      },
      loggedIn() {
        return this.$store.getters.isLoggedIn;
      },
    },
  };
  </script>
  