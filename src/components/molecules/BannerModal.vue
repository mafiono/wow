<template>
  <transition name="fade">
    <modal :opened="opened" name="banner-modal" ref="modal" :closeButton="closeButton" @click.native="saveAndCloseModal">
      <img :src="showBanner.url" class="banner-img" :class="{ bdrop: showBanner.bdrop }" @click="saveAnniv" />
    </modal>
  </transition>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    //
  },
  data() {
    return {
      opened: true,
      ftd_ftp_bonus_package: 48,
    };
  },
  components: {
    Modal,
  },
  computed: {
    ...mapGetters(['showBanner']),
    closeButton() {
      // if (typeof this.showBanner.bdrop !== 'undefined' && this.showBanner.bdrop) {
      //   return true;
      // }
      if (typeof this.showBanner.anniversary !== 'undefined' && this.showBanner.anniversary) {
        return true;
      }
      if (typeof this.showBanner.anniversary2 !== 'undefined' && this.showBanner.anniversary2) {
        return true;
      }
      if (typeof this.showBanner.weekend !== 'undefined' && this.showBanner.weekend) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async saveAndCloseModal() {
      this.opened = false;
      if (typeof this.showBanner.no !== 'undefined') {
        await this.$store.dispatch('updateExtraInfo', { sawBanner: parseInt(this.showBanner.no, 10) + 1 });
      } else if (typeof this.showBanner.bdrop !== 'undefined') {
        this.$cookies.set('bdrop', true, '1d');
        this.$router.push({ name: 'BuyCoins', query: { package: this.ftd_ftp_bonus_package } });
      } else if (typeof this.showBanner.anniversary !== 'undefined') {
        this.$cookies.set('anniversary', true, '1d');
        this.$router.push({ name: 'Promotion', params: { slug: '10k-friyay' } });
      } else if (typeof this.showBanner.anniversary2 !== 'undefined') {
        this.$cookies.set('anniversary2', true, '1d');
      } else if (typeof this.showBanner.weekend !== 'undefined') {
        this.$cookies.set('banner-weekend', true, '1d');
      }
    },
    saveAnniv() {
      if (typeof this.showBanner.anniversary2 !== 'undefined') {
        this.$router.push({ name: 'Play', params: { slug: 'wild-diamond-7x' } });
      } else if (typeof this.showBanner.weekend !== 'undefined') {
        this.$router.push({ name: 'Promotion', params: { slug: 'wow-weekend' } });
      }
    },
  },
  watch: {
    //
  },
  mounted() {
    //
  },
};
</script>

<style lang="scss">
.banner-img {
  margin-left: auto;
  margin-right: auto;
  display: block;
  max-width: 500px;
  cursor: pointer;
}

@media (max-width: 767px) {
  .banner-img {
    margin-left: auto;
    margin-right: auto;
    display: block;
    max-width: 100%;
    cursor: pointer;
  }
}

img.banner-img.bdrop {
  max-width: 320px;
}
</style>
