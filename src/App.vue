<template>
    <div id="app" v-if="this.$route.name" :class="{ 'noscroll': noscroll, 'app-sweep': sweep, 'loggedin': isLoggedIn}">
      <wow-header v-if="!(typeof this.$route.meta.hideNavbar !== 'undefined' && this.$route.meta.hideNavbar)"></wow-header>
      <router-view />
      <wow-footer v-if="!isLoading && !(typeof this.$route.meta.hideFooter !== 'undefined' && this.$route.meta.hideFooter)"></wow-footer>
      <router-link v-if="this.$route.name !== 'LandingPage'" :to="{name: 'Contact Us'}" class="icon--contact-us" :class="{ 'icon--contact-us-loggedin' : isLoggedIn }"><Icon name="help_chat" :width="60"></Icon></router-link>
      <transition name="fade">
        <wow-sticky v-if="isLoggedIn" />
      </transition>
      <transition name="fade">
        <loader v-if="isLoading" />
      </transition>
      <select-mode-modal></select-mode-modal>
      <verify-phone-modal v-if="!mobileVerified"></verify-phone-modal>
      <accept-sweep-rules-modal v-if="!acceptedSweepRules"></accept-sweep-rules-modal>
      <AcceptNewTermsModal v-if="haveToAcceptNewSweepRules || haveToAcceptNewTermsAndConditions"></AcceptNewTermsModal>
      <AcceptNyFloridaRules v-if="nyFloridaSweepRulesReminderNeedAccepting"></AcceptNyFloridaRules>
      <RafModal v-if="showRafModal && $route.path === '/lobby'"></RafModal>
      <WelcomeBackBonusModal v-if="isLoggedIn && reopenBonusCode && !acceptedUnlock"></WelcomeBackBonusModal>
      <banner-modal v-if="showBanner" :key="`banner-${showBanner.no}`"></banner-modal>
    </div>
  </template>
  
  <script>
  import WowHeader from '@/components/molecules/WowHeader.vue';
  import WowFooter from '@/components/molecules/WowFooter.vue';
  import WowSticky from '@/components/molecules/WowSticky.vue';
  import Loader from '@/components/molecules/Loader.vue';
  import SelectModeModal from '@/components/molecules/SelectModeModal.vue';
  import VerifyPhoneModal from '@/components/molecules/VerifyPhoneModal.vue';
  import AcceptSweepRulesModal from '@/components/molecules/AcceptSweepRulesModal.vue';
  import RafModal from '@/components/molecules/RafModal.vue';
  import BannerModal from '@/components/molecules/BannerModal.vue';
  import EventBus from '@/helpers/EventBus';
  import Icon from '@/components/atoms/Icon.vue';
  import AcceptNewTermsModal from '@/components/molecules/AcceptNewTermsModal.vue';
  import AcceptNyFloridaRules from '@/components/molecules/AcceptNyFloridaRules.vue';
  import WelcomeBackBonusModal from '@/components/molecules/WelcomeBackBonusModal.vue';
  
  export default {
    data() {
      return {
        noscroll: false,
      };
    },
    components: {
      WowHeader,
      WowFooter,
      WowSticky,
      Loader,
      SelectModeModal,
      VerifyPhoneModal,
      AcceptSweepRulesModal,
      RafModal,
      BannerModal,
      Icon,
      AcceptNewTermsModal,
      AcceptNyFloridaRules,
      WelcomeBackBonusModal,
    },
    computed: {
      isLoading() {
        return this.$store.getters.isLoading || this.$store.getters.isHardcoreLoading;
      },
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      sweep() {
        return this.$store.getters.sweep;
      },
      mobileVerified() {
        return this.$store.getters.mobileVerified;
      },
      acceptedSweepRules() {
        return this.$store.getters.acceptedSweepRules;
      },
      haveToAcceptNewSweepRules() {
        return this.$store.getters.haveToAcceptNewSweepRules;
      },
      haveToAcceptNewTermsAndConditions() {
        return this.$store.getters.haveToAcceptNewTermsAndConditions;
      },
      showBanner() {
        return this.$store.getters.showBanner;
      },
      showRafModal() {
        return this.$store.getters.showRafModal;
      },
      nyFloridaSweepRulesReminderNeedAccepting() {
        return this.$store.getters.nyFloridaSweepRulesReminderNeedAccepting;
      },
      reopenBonusCode() {
        return this.$store.getters.reopenBonusCode;
      },
      acceptedUnlock() {
        return this.$store.getters.acceptedUnlock;
      },
    },
    async created() {
      this.$store.dispatch('enableLoader');
      // Get games and categories
      await this.$store.dispatch('getCategories');
      this.$store.dispatch('disableLoader');
      EventBus.$on('no-scroll', () => {
        this.noscroll = !this.noscroll;
      });
      EventBus.$on('remove-no-scroll', () => {
        this.noscroll = false;
      });
      EventBus.$on('add-no-scroll', () => {
        this.noscroll = true;
      });
      this.$store.dispatch('getBanners');
    },
  };
  </script>
  <style lang="scss">
  @import "@/styles/vegas.scss";
  </style>
  