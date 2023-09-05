<template>
  <div>
    <div id="sumsub-websdk-container"></div>
  </div>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';

export default {
  data() {
    return {
      cmsNew: process.env.VUE_APP_API_CMSNEW,
      levelName: 'standard-vegas-kyc',
      accessToken: '',
    };
  },
  computed: {
    endpointAPICMSNEW: (state) => state.cmsNew,
    sumSubEndpoint: (state) => state.cmsNew.replace('wp-json/wp/v2/', 'wp-json/sumsub/v1/access-token'),
    playerData() {
      return this.$store.getters.playerData;
    },
  },
  async mounted() {
    await this.getNewAccessToken();
    this.launchWebSdk(this.accessToken);
  },
  methods: {
    launchWebSdk(accessToken) {
      const snsWebSdkInstance = snsWebSdk
        .init(
          accessToken,
          // token update callback, must return Promise
          () => this.getNewAccessToken(),
        )
        .withConf({
          lang: 'en', // language of WebSDK texts and comments (ISO 639-1 format)
          email: this.playerData.email,
          phone: this.mobilePhone,
        })
        .on('onError', (error) => {
          console.log('onError', error);
        })
        .onMessage((type, payload) => {
          console.log('onMessage', type, payload);
        })
        .build();

      snsWebSdkInstance.launch('#sumsub-websdk-container');
    },
    async getNewAccessToken() {
      try {
        const response = await this.$http.get(`${this.sumSubEndpoint}?userId=${this.playerData.partyId}&levelName=${this.levelName}`);
        this.accessToken = response.data.token;
        return Promise.resolve(response.data.token);
      } catch (error) {
        console.error('Error fetching Sumsub access token:', error);
        return Promise.reject(error);
      }
    },
  },
};
</script>
