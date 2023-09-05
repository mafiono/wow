<template>
  <div v-if="promotion && sweep" class="container section section--promotion">
    <img v-if="promotion.banner" :src="isMobile ? promotion.tile_image : promotion.banner" class="promo-title-img" alt="" />
    <div class="single-promotion-content">
      <div v-html="promotion.content"></div>
      <div class="promodiv-btn" v-if="enableClaimWocButton">
        <Button :loading="loading" type="primary" @click="getFree('WOC')" :width="180" expanded>Claim</Button>
      </div>
      <div class="promodiv-btn" v-else-if="enableClaimVBCButton">
        <Button :loading="loading" type="primary" @click="getFree('VBC')" :width="180" expanded>Claim</Button>
      </div>
      <div class="promodiv-btn" v-else-if="enableClaimDailyButton">
        <Button :loading="loading" type="primary" @click="getFree()" :width="180" expanded>Claim</Button>
      </div>
      <div class="promodiv-btn" v-else-if="enableEmailCompButton">
        <Button v-if="!emailCompSuccess" :loading="loading" type="primary" @click="emailComp()" :width="180" expanded>Send email</Button>
        <p v-else class="comp-success">{{ emailCompSuccess }}</p>
      </div>
    </div>
    <div class="single-promotion-content single-promotion-content--terms">
      <div v-html="promotion.terms"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Button from '@/components/atoms/Button.vue';

export default {
  props: {
    slug: String,
  },
  components: {
    Button,
  },
  data() {
    return {
      promotion: null,
      titleUpdated: false,
      loading: false,
      emailCompSuccess: false,
    };
  },
  computed: {
    ...mapGetters(['playerData', 'sweep', 'balance']),
    isMobile() {
      return window.screen.width <= 768;
    },
    currencyReal() {
      const balances = this.balance.currencyBalances;
      return balances.find((balance) => balance.currency === 'WOC');
    },
    currencyFun() {
      const balances = this.balance.currencyBalances;
      return balances.find((balance) => balance.currency === 'VBC');
    },
    enableEmailCompButton() {
      if (this.promotion?.acf?.enable_button === 'emailcomp' && this.playerData?.email && this.playerData?.firstName) {
        return true;
      }
      return false;
    },
    enableClaimDailyButton() {
      if (this.promotion?.acf?.enable_button === 'daily' && this.dailyCode) {
        return true;
      }
      return false;
    },
    enableClaimWocButton() {
      if (this.promotion?.acf?.enable_button === 'dailywoc' && this.currencyReal.totalBalanceNumber < 0.30) {
        return true;
      }
      return false;
    },
    enableClaimVBCButton() {
      if (this.promotion?.acf?.enable_button === 'dailyvbc' && this.currencyFun.totalBalanceNumber < 5000) {
        return true;
      }
      return false;
    },
    vipStatus() {
      if (!this.playerData?.vipStatus) return 'rising';
      return this.playerData?.vipStatus.toLowerCase();
    },
    dailyCode() {
      if (this.vipStatus === 'blue') return 'BLUEDAILY';
      if (this.vipStatus === 'bronze') return 'BRONZEDAILY';
      if (this.vipStatus === 'silver') return 'SILVERDAILY';
      if (this.vipStatus === 'gold') return 'GOLDDAILY';
      if (this.vipStatus === 'hosted') return 'HOSTEDDAILY';
      return '';
    },
  },
  methods: {
    emailComp() {
      this.loading = true;
      this.$apiCmsNew.post('https://cms3.wowvegas.com/wp-json/email-comp/v1/send-email', {
        email: this.playerData?.email,
        first_name: this.playerData?.firstName,
      })
        .then((response) => {
          this.emailCompSuccess = response.data;
        })
        .catch((error) => {
          this.emailCompSuccess = '';
          if (error.response && error.response.data && error.response.data.message) {
            this.$noty.error(error.response.data.message);
          } else {
            this.$noty.error('An unexpected error occurred. Please try again.');
          }
        }).finally(() => {
          this.loading = false;
        });
    },
    getFree(currency = null) {
      if (!currency) {
        if (!this.dailyCode) {
          return;
        }
        this.claimBonus(this.dailyCode);
        return;
      }
      if (currency === 'WOC') {
        this.claimBonus('DAILYLOGINSC');
      } else if (currency === 'VBC') {
        this.claimBonus('DAILYLOGINWOW');
      }
    },
    async claimBonus(bonusCode) {
      const validBonuses = ['DAILYLOGINSC', 'DAILYLOGINWOW', 'BLUEDAILY', 'BRONZEDAILY', 'SILVERDAILY', 'GOLDDAILY', 'HOSTEDDAILY'];
      if (!validBonuses.includes(bonusCode)) {
        return;
      }
      this.$store.dispatch('enableLoader');
      this.loading = true;
      this.$apiToken
        .get('/redeemBonus', {
          params: {
            bonusCode,
          },
        })
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            this.$store.dispatch('getBalance');
            if (bonusCode === 'DAILYLOGINSC') {
              this.$noty.error('Success! We just added SC 0.3 to your account.');
            } else if (bonusCode === 'DAILYLOGINWOW') {
              this.$noty.error('Success! We just added 5000 WOW Coins to your account.');
            } else if (bonusCode === 'BLUEDAILY') {
              this.$noty.error('Success! We just added SC 0.3 and 1,500 WOW Coins to your account.');
            } else if (bonusCode === 'BRONZEDAILY') {
              this.$noty.error('Success! We just added SC 0.5 and 5,000 WOW Coins to your account.');
            } else if (bonusCode === 'SILVERDAILY') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === 'GOLDDAILY') {
              this.$noty.error('Success! We just added SC 2.5 and 20,000 WOW Coins to your account.');
            } else if (bonusCode === 'HOSTEDDAILY') {
              this.$noty.error('Success! We just added SC 5 and 50,000 WOW Coins to your account.');
            }
          } else {
            this.$noty.error('Sorry. You can only claim this bonus once a day. Please allow 24 hours between claims.');
          }
        })
        .catch((error) => {
          this.$noty.error(error.message);
        })
        .finally(async () => {
          this.$store.dispatch('disableLoader');
          this.loading = false;
        });
    },
  },
  created() {
    this.$store.dispatch('enableLoader');
    this.$apiCmsNew.get(`/promotions`, {
      params: {
        slug: this.slug,
      },
    }).then((response) => {
      [this.promotion] = response.data;
      if (!this.titleUpdated) {
        const oldTitle = document.title;
        document.title = `${this.promotion.title} - ${oldTitle}`;
        this.titleUpdated = true;
      }
    }).catch((error) => {
      if (error.response.status === 404) {
        this.$router.replace({ name: '404 Error' });
      }
    }).finally(() => {
      this.$store.dispatch('disableLoader');
    });
  },
};
</script>

<style lang="scss">
.container.section.section--promotion {
  margin-top: 1.5rem;
}
.promo-title-img {
  display: block;
  margin-bottom: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}
.single-promotion-content {
  background: rgba(59, 59, 59, 0.35);
  padding: 3rem 4rem;
  margin-bottom: 1.5rem;
}
p.comp-success {
  padding: .6rem;
  color: #70ff74;
  background: rgba(255, 255, 255, 0.1);
}
@media (max-width: 768px) {
  .promo-title-img {
    margin-bottom: 1rem;
  }
  .single-promotion-content {
    padding: 1.5rem 1rem 1rem;
    margin-bottom: 1rem;
  }
  .container.section.section--promotion {
    margin-top: 1rem;
  }
}
</style>
