<template>
    <div class="triple-section auth-form">
      <div class="triple-section--top"></div>
      <div class="triple-section--middle container">
        <h2>Oh no!</h2>
        <div class="message-wide">
          <p>Unfortunately, your account is currently unverified. To verify your account, click on the link within the email you received when you created your account.</p>
          <p>If you need another link please click here to get another one sent.</p>
          <Button
            type="primary"
            :width="325"
            :loading="loading"
            class="mt-single"
            @click="sendVerification"
          >Re-send verification email
          </Button>
        </div>
      </div>
      <div class="triple-section--bottom"></div>
    </div>
  </template>
  
  <script>
  import Button from '@/components/atoms/Button.vue';
  
  export default {
    components: {
      Button,
    },
    data() {
      return {
        loading: false,
      };
    },
    methods: {
      sendVerification() {
        this.loading = true;
        this.$api.get('/resendVerificationCode', {
          params: {
            username: this.$route.params.user.replace(/\+/g, ''),
            verificationTarget: 'email',
            verificationType: 'link',
          },
        })
          .then((response) => {
            this.loading = false;
            if (response.data.status === 'SUCCESS') {
              this.$store.commit('SET_VERIFICATION_SENT', true);
              const { user } = this.$route.params;
              this.$router.push({ name: 'Confirmation', params: { username: user } });
            }
          })
          .catch((error) => {
            this.$noty.error(error.message);
          });
      },
    },
    mounted() {
      if (typeof this.$route.params.user === 'undefined') {
        this.$router.push({ name: 'Login' });
      }
    },
  };
  </script>
  