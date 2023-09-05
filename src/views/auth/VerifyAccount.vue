<template>
    <div class="triple-section auth-form">
      <div class="triple-section--top">
        <router-link to="/"><Icon name="logo" :height="65"></Icon></router-link>
      </div>
      <div class="triple-section--middle container">
        <template v-if="accountVerified">
          <template v-if="accountVerified == 'SUCCESS' || accountVerified == 'DUPLICATES'">
            <Icon name="check" :height="40"></Icon>
            <h2>Thank you</h2>
          </template>
          <template v-else>
            <h2>Error</h2>
          </template>
          <div class="message">
            <p v-if="accountVerified == 'SUCCESS'">Your account has been verified.</p>
            <p v-else-if="accountVerified == 'DUPLICATES'">Your account was already verified.</p>
            <p v-else-if="accountVerified == 'NOT_FOUND'">No user was found for the email address.</p>
            <p v-else>Validation failed.</p>
            <div v-if="accountVerified == 'SUCCESS'">
              <p>Redirecting to the lobby... ({{ secondsLeft }}s left)</p>
              <Button
                tag="router-link"
                :to="{ name: 'Lobby' }"
                class="mt-double"
                type="primary">
                Go to Lobby
              </Button>
            </div>
            <div v-if="accountVerified == 'DUPLICATES'">
              <p>Log in now and let the WOWness begin.</p>
              <Button
                tag="router-link"
                :to="{ name: 'Login' }"
                class="mt-double"
                type="primary">
                Log in
              </Button>
            </div>
          </div>
        </template>
        <transition name="fade">
          <loader v-if="!accountVerified" />
        </transition>
      </div>
      <div class="triple-section--bottom"></div>
    </div>
  </template>
  
  <script>
  import Icon from '@/components/atoms/Icon.vue';
  import Button from '@/components/atoms/Button.vue';
  import Loader from '@/components/molecules/Loader.vue';
  import { mapGetters } from 'vuex';
  
  export default {
    components: {
      Icon,
      Button,
      Loader,
    },
    data() {
      return {
        secondsLeft: 3,
      };
    },
    computed: {
      ...mapGetters(['accountVerified']),
    },
    created() {
      const verificationCode = this.$route.query.confirmationCode;
      const verificationEmail = this.$route.query.email;
      if (verificationCode && verificationEmail) {
        this.$store.dispatch('verifyAccount',
          {
            verificationCode,
            verificationEmail,
          })
          .then(() => {
            if (this.accountVerified === 'SUCCESS') {
              this.countDownTimer();
            }
          });
      }
    },
    methods: {
      countDownTimer() {
        if (this.secondsLeft > 0) {
          setTimeout(() => {
            this.secondsLeft -= 1;
            this.countDownTimer();
          }, 1000);
        } else {
          this.$router.push({ name: 'Lobby' });
        }
      },
    },
  };
  </script>
  
  <style lang="scss">
  .verify-account {
    p {
      margin-bottom: 6px;
    }
  }
  </style>
  