<template>
    <div class="triple-section auth-form">
      <div class="triple-section--top">
        <router-link to="/"><Icon name="logo" :height="65"></Icon></router-link>
      </div>
      <div class="triple-section--middle container">
        <Icon name="check" :height="40"></Icon>
        <h2>Thank you</h2>
        <div class="message">
          <template v-if="verificationSent">
            <p>We've sent a verification link to {{ emailTo  }}.</p>
            <p>Please click "Verify" in the verification email to complete the registration.</p>
            <p>Don't forget to check your junk mail as well in case you cannot see the email.</p>
          </template>
          <Button
            @click="resendVerification"
            type="primary"
            class="mt-single"
            :loading="loading"
            :width="300">
            Resend verfication email
          </Button>
        </div>
      </div>
      <div class="triple-section--bottom">
        <div class="need-help">NEED HELP? Contact us <router-link to="/contact-us">HERE</router-link> 24/7</div>
      </div>
    </div>
  </template>
  
  <script>
  import Icon from '@/components/atoms/Icon.vue';
  import Button from '@/components/atoms/Button.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        user: {
          username: '',
        },
        loading: false,
      };
    },
    components: {
      Icon,
      Button,
    },
    computed: {
      ...mapGetters(['verificationEmail', 'verificationSent']),
      emailTo() {
        if (this.verificationEmail) {
          return this.verificationEmail;
        }
        return this.user.username;
      },
    },
    methods: {
      async resendVerification() {
        this.$store.commit('SET_VERIFICATION_SENT', null);
        this.loading = true;
        await this.$store.dispatch('sendVerification', this.user);
        this.loading = false;
      },
    },
    created() {
      this.user.username = this.$route.params.username;
    },
  };
  </script>
  