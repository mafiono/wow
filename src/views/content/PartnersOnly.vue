<template>
    <div class="section content content-cms content--partners-only">
      <div class="container">
        <div class="partners-logo">
          <Icon name="logo2" :height="80"></Icon>
          <h3>PARTNERS</h3>
        </div>
        <p>
          WOW Vegas works with a limited number of partners on an invite and application basis.
          If you are a business with an established website in our market and would like to be considered for our partner programme, please contact:
          <a href="mailto:affiliates@wowvegas.com">affiliates@wowvegas.com</a>
        </p>
        <p>
          If you are already an approved partner then please press <strong>NEXT</strong> and you will be asked to enter your <strong>password</strong> to enter the partner environment.
        </p>
        <div>
          <Button type="primary" @click="goToPartners">Next</Button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import Button from '@/components/atoms/Button.vue';
  import Icon from '../../components/atoms/Icon.vue';
  
  export default {
    data() {
      return {
        //
      };
    },
    computed: {
      ...mapGetters(['sweep']),
    },
    components: { Icon, Button },
    methods: {
      goToPartners() {
        // eslint-disable-next-line
        const password = prompt('Enter your password', '');
        if (password !== 'wowpartner') {
          this.$noty.error('Wrong password! Please contact affiliates@wowvegas.com');
          return;
        }
        window.location.href = 'https://affiliates.wowvegas.com/login.asp';
      },
    },
  };
  </script>
  
  <style lang="scss">
  .partners-logo {
    width: 180px;
    margin-bottom: 2rem;
    margin-left: auto;
    margin-right: auto;
  }
  .partners-logo svg.icon.icon-logo2 {
    height: auto !important;
    max-width: 100%;
  }
  .partners-logo h3 {
    letter-spacing: 7px;
    font-size: 16px;
    border-top: 1px solid #fff;
    padding-top: 12px;
    margin-top: 10px;
    text-align: center;
    padding-left: 7px;
  }
  .content--partners-only {
    margin-top: 0 !important;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.5;
    background-image: url(https://cdn2.wowvegas.com/assets/bg-vegas-blue.jpeg);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    position: relative;
  }
  .section.content.content-cms.content--partners-only:after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10%;
    background: linear-gradient(0deg, $black, transparent);
    content: '';
  }
  </style>
  