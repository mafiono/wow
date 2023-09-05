<template>
  <section class="container section buy-coins" :class="{ 'buy-coins--sweep' : sweep }">
    <template v-if="uriTrustlyPending">
      <div class="trustly-processing">
        <semipolar-spinner v-if="!isLoading" />
        <h3>Processing your payment...</h3>
      </div>
    </template>
    <template v-else>
      <CompleteProfile v-if="profileCompleted == false" @signUpCompleted="signUpCompleted"
        text="In order to use your coins we need a little more information about you.<br><br>We know it's boring but it should take less than 1 minute and you'll be playing with your <strong>FREE COINS</strong>!">
      </CompleteProfile>
      <template v-if="profileCompleted == true">
        <!-- Step 1: Select bundle -->
        <div class="buy-coins--select" id="packages" v-if="!isBundleSelected && !uriPackage">
          <div class="heaad-section">
            <h3><small>WELCOME TO THE</small><span v-if="isVipButNotRising" :class="`vip-color-${vipStatus}`">{{ vipStatus }}</span> COIN STORE</h3>
            <p v-if="sweep && typeof playerData.madeDeposit !== 'undefined' && playerData.madeDeposit === false"><strong>CHOOSE YOUR SPECIAL ONE-TIME DISCOUNT WELCOME PACK</strong></p>
            <p v-if="sweep && typeof playerData.madeDeposit !== 'undefined' && playerData.madeDeposit === true && wowCoinsPercentageDiscount" style="font-size: 12px;">HERE YOU WILL FIND EXCLUSIVE COIN PACKS WITH <strong>{{ wowCoinsPercentageDiscount }}% EXTRA WOW COINS</strong> ON EACH PURCHASE</p>
            <p v-if="sweep" style="font-size: 12px;">REMEMBER YOU CAN WIN REAL PRIZES USING SC</p>
          </div>
          <template v-if="mostPopular">
            <!-- <h3 class="hide-xxs">WELCOME TO THE COIN STORE</h3> -->
            <div v-if="bundles" class="bonuses hide-xxs">
              <div class="bonus-wrapper bonus-wrapper--one">
                <div v-if="mostPopular.pack.callout" class="bonus-callout">{{ mostPopular.pack.callout }}</div>
                <bonus
                  :offerimage="mostPopular.image"
                  :price="mostPopular.pack.price"
                  :priceold="mostPopular.pack.price_old"
                  :freecoins="mostPopular.pack.free_coins_amount"
                  :freecoinsrising="mostPopular.pack.free_coins_amount_rising"
                  :sweepcoins="mostPopular.pack.sweep_coins_amount"
                  :description="mostPopular.pack.description"
                  :description2="mostPopular.pack.description_2"
                  :bonusid="mostPopular.pack.bonus_id"
                  :sweep="sweep"
                  :callout="mostPopular.pack.callout"
                  :exclabel="mostPopular.pack.exclusive_label"
                  @click="selectBundle(mostPopular.pack)"
                ></bonus>
              </div>
            </div>
          </template>
          <h3 v-if="mostPopular" class="hide-xxs">MORE COIN PACKAGES BELOW</h3>
          <div v-if="bundles" class="bonuses">
            <div v-for="(bundle, index) in bundles" class="bonus-wrapper" :key="`bundle-${index}`">
              <div v-if="bundle.coin_pack.callout" class="bonus-callout">{{ bundle.coin_pack.callout }}</div>
              <bonus
                :price="bundle.coin_pack.price"
                :priceold="bundle.coin_pack.price_old"
                :freecoins="bundle.coin_pack.free_coins_amount"
                :freecoinsrising="bundle.coin_pack.free_coins_amount_rising"
                :sweepcoins="bundle.coin_pack.sweep_coins_amount"
                :description="bundle.coin_pack.description"
                :description2="bundle.coin_pack.description_2"
                :bonusid="bundle.coin_pack.bonus_id"
                :sweep="sweep"
                :callout="bundle.coin_pack.callout"
                :exclabel="bundle.coin_pack.exclusive_label"
                @click="selectBundle(bundle.coin_pack)"
              ></bonus>
            </div>
          </div>
        </div>
        <!-- Step 2: Cashier -->
        <div class="buy-coins--selected" v-if="isBundleSelected">
          <h3>Choose how to pay</h3>
          <div class="selected-option">
            <div class="package">
              <h2>{{ currentBundle.price | formatMoney('USD') }}</h2>
              <div class="flexx">
                <icon v-if="currentBundle.free_coins_amount" name="blue_coin" :height="18"></icon>
                <p v-html="computedDescription"></p>
              </div>
              <div v-if="computedDescription2 && sweep" class="flexx">
                <icon v-if="currentBundle.free_coins_amount" name="gold_coin" :height="18"></icon>
                <p v-html="computedDescription2"></p>
              </div>
              <!-- <div class="flexx" style="text-align: center;">
                <p>
                  <a href="#" style="color:#000;" @click="selectBundle">Choose different package</a>
                </p>
              </div> -->
            </div>
            <h3 v-if="showTrustly && yourSavedTrustlyBanks && yourSavedTrustlyBanks.length">SAVED PAYENT METHODS</h3>
            <div v-if="showTrustly && yourSavedTrustlyBanks && yourSavedTrustlyBanks.length" class="options">
              <Button v-for="bankDetails in yourSavedTrustlyBanks" :key="`trus-${bankDetails.id}`" class="payment-method--button" @click="payViaBank(bankDetails.id)">
                <!-- <Icon class="payment-method--icon" name="trustly2" :height="30" style="margin: -5px -10px;"></Icon> -->
                <img style="height: 30px;" :src="`https://trustly.one/start/assets/institutions/icons/${bankDetails.details.find(el => el.key == 'TRANSACTION_ID').value}.png`" class="banksingle" alt="">
                <span class="payment-method--text">{{ bankDetails.details.find((el => el.key == "NAME")).value }} *{{ bankDetails.details.find((el => el.key == "NUMBER")).value }}</span>
                <Icon class="payment-method--next" name="next" :height="20"></Icon>
              </Button>
            </div>
            <h3 v-if="showTrustly && yourSavedTrustlyBanks && yourSavedTrustlyBanks.length">OTHER PAYMENT METHODS</h3>
            <div class="options">
              <Button class="payment-method--button" v-if="paymentMethods.card && applePayAvailable" @click="payViaCard">
                <Icon class="payment-method--icon" name="apple_pay" :width="51"></Icon>
                <span class="payment-method--text">Buy with Apple Pay</span>
                <Icon class="payment-method--next" name="next" :height="20"></Icon>
              </Button>
              <Button class="payment-method--button" v-if="showTrustly" @click="payViaBank(false)">
                <Icon class="payment-method--icon" external src="https://paywithmybank.com/assets/icon_trustly-136x82/icon_trustly-136x82-1_light_en-US.svg" :height="65" style="margin: -15px -6px;"></Icon>
                <!-- <Icon class="payment-method--icon" external src="https://cdn.wowvegas.com/assets/icon_trustly-136x82-1_light_en-US.svg" :height="65" style="margin: -15px -6px;"></Icon> -->
                <span class="payment-method--preferred">Preferred</span>
                <span class="payment-method--plusmore">1000's more</span>
                <span class="payment-method--text">Online Banking</span>
                <Icon class="payment-method--next" name="next" :height="20"></Icon>
              </Button>
              <div id="widget-trustly"></div>
              <Button class="payment-method--button" v-if="paymentMethods.card" @click="payViaCard">
                <Icon class="payment-method--icon" name="visa" :width="38"></Icon>
                <Icon class="payment-method--icon" name="mastercard" :width="25"></Icon>
                <Icon class="payment-method--icon" name="amex" :width="35" style="margin: -5px 5px -5px -3px;"></Icon>
                <Icon v-if="!applePayAvailable" class="payment-method--icon" name="apple_pay" :width="40"></Icon>
                <Icon class="payment-method--icon" name="discover" :width="30"></Icon>
                <Icon class="payment-method--icon" name="diners_club" :width="20"></Icon>
                <span class="payment-method--text">Buy with card</span>
                <Icon class="payment-method--next" name="next" :height="20"></Icon>
              </Button>
              <Button class="payment-method--button" v-if="skrillAvailable" @click="payViaSkrill">
                <Icon class="payment-method--icon" name="skrill"></Icon>
                <span class="payment-method--text">Buy with Skrill</span>
                <Icon class="payment-method--next" name="next" :height="20"></Icon>
              </Button>
              <!-- <Button v-if="paymentMethods.transfer" type="secondary" class="is-fullwidth" @click="payViaBank">Pay via Bank Transfer</Button> -->
            </div>
          </div>
        </div>
        <div v-else-if="uriPackage && cashierNew && !uriPackageSelected" class="nopromoavl">
          <h3>Promotion Unavailable</h3>
          <p>We're sorry, the promotion you're looking for is no longer available.</p>
          <p>But don't worry! There are still plenty of ways for you to get more coins.</p>
          <div class="nopromo-btns">
            <Button type="secondary" tag="router-link" :to="{ name: 'BuyCoins' }">Buy Coins</Button>
            <Button type="primary" tag="router-link" :to="{ name: 'Promotions' }">Promotions</Button>
          </div>
        </div>
      </template>
      <cashier-modal :iframeUrl="cashierUrl" class="cashier-modal-c"></cashier-modal>
    </template>
  </section>
</template>

<script>
import Bonus from '@/components/atoms/Bonus.vue';
import Button from '@/components/atoms/Button.vue';
import CompleteProfile from '@/components/molecules/CompleteProfile.vue';
import Icon from '@/components/atoms/Icon.vue';
import CashierModal from '@/components/molecules/CashierModal.vue';
import EventBus from '@/helpers/EventBus';
import { mapGetters } from 'vuex';
import SemipolarSpinner from '@/components/atoms/SemipolarSpinner.vue';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  data() {
    return {
      uriPackageSelected: false,
      cashierNew: null,
      mostPopularDirty: null,
      mostPopularImageDirty: null,
      mostPopularSafe: null,
      mostPopularImageSafe: null,
      mostPopularDirtyFtd: null,
      mostPopularImageDirtyFtd: null,
      mostPopularSafeFtd: null,
      mostPopularImageSafeFtd: null,
      bundlesDirty: null,
      bundlesDirtyFtd: null,
      bundlesSafe: null,
      bundlesSafeFtd: null,
      ftdBundle: null,
      isBundleSelected: false,
      isFtdBundleSelected: false,
      currentBundle: null,
      preSetBundle: null,
      cashierState: null,
      profileCompleted: null,
      cashierUrl: null,
      paymentMethods: {
        card: true,
        transfer: true,
        skrill: true,
      },
      yourSavedPaymentMethods: null,
      trustlyAutoShowWidgetWhenNoSavedBanks: false,
      trustlyData: {
        establishData: {
          accessId: '64f9vK5JgzTYGmpu',
          merchantId: '1014225262',
          description: 'purchase',
          currency: 'USD',
          amount: '0.00',
          merchantReference: '',
          paymentType: 'Deferred',
          requestSignature: '',
          returnUrl: '/buy-coins',
          cancelUrl: '#',
          customer: {
            externalId: '',
            name: '',
            email: '',
            dateOfBirth: '',
            enrollDate: '',
            phone: '',
            address: {
              address1: '',
              city: '',
              state: '',
              zip: '',
              country: '',
            },
          },
        },
        trustlyOptions: {
          closeButton: false,
          dragAndDrop: true,
          widgetContainerId: 'widget',
        },
      },
      paymentCheckedCounter: 0,
      receiveMessage: (event) => {
        if (typeof event.data.type !== 'undefined' && event.data.type === 'PaymentSuccess') {
          EventBus.$emit('close-modal', 'cashier-modal');
          this.$store.dispatch('getBalance');
          this.$store.dispatch('getPlayerInfo');
          if (typeof event.data.orderId !== 'undefined' && event.data.orderId) {
            this.ga4purchase(event.data.orderId);
            this.$router.push({ name: 'Lobby', query: { orderId: event.data.orderId, gahandled: true } });
          }
        }
      },
    };
  },
  components: {
    Bonus,
    Button,
    CompleteProfile,
    Icon,
    CashierModal,
    SemipolarSpinner,
  },
  computed: {
    ...mapGetters(['playerData', 'sweep', 'endpointAPI', 'ageNeedsVerification', 'ageCheckerUuid', 'lobbyBanner', 'isLoading', 'sumsubStatus']),
    applePayAvailable() {
      if (window.ApplePaySession) return true;
      return false;
    },
    vipStatus() {
      if (!this.playerData?.vipStatus) return 0;
      return this.playerData?.vipStatus.toLowerCase();
    },
    isVipButNotRising() {
      if (this.playerData?.vipStatus && this.playerData?.vipStatus.toLowerCase() !== 'rising') return true;
      return false;
    },
    wowCoinsPercentageDiscount() {
      if (this.vipStatus === 'hosted') {
        return 25;
      }
      if (this.vipStatus === 'gold') {
        return 20;
      }
      if (this.vipStatus === 'silver') {
        return 15;
      }
      if (this.vipStatus === 'bronze') {
        return 10;
      }
      if (this.vipStatus === 'blue') {
        return 5;
      }
      return 0;
    },
    ageCheckerApiKey: () => (window.location.hostname === 'localhost' ? 'pcafkvQa0zpaqlMBc2wswQmfpnn7gOP0' : process.env.VUE_APP_AGECHECKER_API_KEY),
    bundles() {
      if (!this.cashierNew) return false;
      if (this.sweep && typeof this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false && this.cashierNew?.ftp_store_settings?.bundles_available) {
        return this.cashierNew.ftp_store_settings.bundles_available;
      }
      if (this.sweep) {
        if (this.vipStatus === 'hosted') {
          return this.cashierNew.platinum_store_settings.bundles_available;
        }
        if (this.vipStatus === 'gold') {
          return this.cashierNew.gold_store_settings.bundles_available;
        }
        if (this.vipStatus === 'silver') {
          return this.cashierNew.silver_store_settings.bundles_available;
        }
        if (this.vipStatus === 'bronze') {
          return this.cashierNew.bronze_store_settings.bundles_available;
        }
        if (this.vipStatus === 'blue') {
          return this.cashierNew.blue_store_settings.bundles_available;
        }
        return this.cashierNew.rising_star_store_settings.bundles_available;
      }
      if (typeof this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false && this.cashierNew?.social_ftp_store_settings?.bundles_available) {
        return this.cashierNew.social_ftp_store_settings.bundles_available;
      }
      return this.cashierNew.social_store_settings.bundles_available;
    },
    mostPopularImageFallback() {
      return 'https://cdn2.wowvegas.com/assets/most-popular-1.jpg';
    },
    mostPopular() {
      if (!this.cashierNew) return false;
      if (this.sweep && typeof this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false && this.cashierNew?.ftp_store_settings?.most_popular) {
        return {
          pack: this.cashierNew?.ftp_store_settings?.most_popular,
          image: this.cashierNew?.ftp_store_settings?.most_popular_image || this.mostPopularImageFallback,
        };
      }
      if (this.sweep) {
        if (this.vipStatus === 'hosted') {
          return {
            pack: this.cashierNew?.platinum_store_settings?.most_popular,
            image: this.cashierNew?.platinum_store_settings?.most_popular_image || this.mostPopularImageFallback,
          };
        }
        if (this.vipStatus === 'gold') {
          return {
            pack: this.cashierNew?.gold_store_settings?.most_popular,
            image: this.cashierNew?.gold_store_settings?.most_popular_image || this.mostPopularImageFallback,
          };
        }
        if (this.vipStatus === 'silver') {
          return {
            pack: this.cashierNew?.silver_store_settings?.most_popular,
            image: this.cashierNew?.silver_store_settings?.most_popular_image || this.mostPopularImageFallback,
          };
        }
        if (this.vipStatus === 'bronze') {
          return {
            pack: this.cashierNew?.bronze_store_settings?.most_popular,
            image: this.cashierNew?.bronze_store_settings?.most_popular_image || this.mostPopularImageFallback,
          };
        }
        if (this.vipStatus === 'blue') {
          return {
            pack: this.cashierNew?.blue_store_settings?.most_popular,
            image: this.cashierNew?.blue_store_settings?.most_popular_image || this.mostPopularImageFallback,
          };
        }
        return {
          pack: this.cashierNew?.rising_star_store_settings?.most_popular,
          image: this.cashierNew?.rising_star_store_settings?.most_popular_image || this.mostPopularImageFallback,
        };
      }
      if (typeof this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false) {
        return this.mostPopularSafeFtd; // TODO:
      }
      return this.mostPopularSafe; // TODO:
    },
    mostPopularImage() {
      if (this.sweep && typeof this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false) {
        return this.mostPopularImageDirtyFtd;
      }
      if (this.sweep) {
        return this.mostPopularImageDirty;
      }
      if (typeof this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false) {
        return this.mostPopularImageSafeFtd;
      }
      return this.mostPopularImageSafe;
    },
    uriPackage() {
      if (this.$route.query.package === '285' || this.$route.query.package === 285) {
        return '286';
      }
      if (this.$route.query.package === '392' || this.$route.query.package === 392) {
        return '399';
      }
      return this.$route.query.package;
    },
    ftdBundleAvailable() {
      if (this.ftdBundle && this.uriPackage && parseInt(this.ftdBundle.bonus_id, 10) === parseInt(this.uriPackage, 10) && this.playerData && typeof this.playerData?.madeDeposit !== 'undefined' && !this.playerData.madeDeposit) {
        return true;
      }
      return false;
    },
    uriTrustlyPending() {
      return this.$route.query.merchantReference ?? false;
    },
    yourSavedTrustlyBanks() {
      const banks = this.yourSavedPaymentMethods.filter((obj) => obj.type === 'BANK' && obj.details.filter((obj2) => obj2.key === 'NAME').length && obj.details.filter((obj2) => obj2.key === 'TRANSACTION_ID').length);
      if (banks && banks.length) {
        // return [banks[0]];
        return [[...banks].pop()];
      }
      return false;
    },
    showTrustly() {
      // if (this.paymentMethods.transfer && this.playerData?.kycStatus === 'PASS') {
      //   return true;
      // }
      // return false;
      return true; // always show trustly
    },
    isMobile() {
      return window.innerWidth <= 768;
    },
    computedDescription() {
      if (!this.currentBundle?.free_coins_amount || this.currentBundle?.free_coins_amount === '0') {
        return null;
      }
      const description = `${parseInt(this.currentBundle.free_coins_amount, 10).toLocaleString('en-US')} WOW Coins`;
      return description.replace('WOW Coins', '<span>WOW Coins</span>');
    },
    computedDescription2() {
      if (!this.currentBundle?.sweep_coins_amount || this.currentBundle?.sweep_coins_amount === '0') {
        return null;
      }
      return `<strong>+ GET ${this.currentBundle.sweep_coins_amount} FREE SC</strong>`;
    },
    skrillAvailable() {
      return this.paymentMethods.skrill && this.playerData?.country === 'US';
    },
  },
  methods: {
    // getBundleDescriptions(bundle) {
    //   //
    //   return;
    // },
    ga4purchase(orderId) {
      let bundleDescription = `${this.currentBundle.free_coins_amount} WOW Coins`;
      if (this.currentBundle.sweep_coins_amount && this.currentBundle.sweep_coins_amount !== '0') {
        bundleDescription += ` + ${this.currentBundle.sweep_coins_amount} SC`;
      }
      const wasFtdPurchase = sessionStorage.getItem('wasFtdPurchase');
      if (wasFtdPurchase) {
        window.dataLayer2.push({
          event: 'ftp',
        });
      }
      if (wasFtdPurchase && this.currentBundle.price > 9) {
        window.dataLayer2.push({
          event: 'ftp10',
        });
      }
      sessionStorage.removeItem('wasFtdPurchase');
      window.dataLayer2.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer2.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: orderId,
          value: this.currentBundle.price,
          currency: 'USD',
          items: [
            {
              item_id: this.currentBundle.bonus_id,
              item_name: bundleDescription,
              currency: 'USD',
              price: this.currentBundle.price,
            },
          ],
        },
      });
    },
    async selectBundle(bundle) {
      if (!this.playerData) {
        await sleep(600);
        this.selectBundle(bundle);
        return;
      }
      if (this.isFtdBundleSelected && this.uriPackage && !this.ftdBundleAvailable) {
        this.$router.push({ name: 'BuyCoins' });
        return;
      }
      this.preSetBundle = false;
      this.$store.dispatch('enableLoader');
      if (this.ageNeedsVerification === 'start') {
        await this.$store.dispatch('startAgeChecker');
        this.$store.dispatch('disableLoader');
        this.selectBundle(bundle);
        return;
      }
      if (this.ageNeedsVerification && this.ageCheckerUuid) {
        this.preSetBundle = bundle;
        window.AgeCheckerAPI.show(this.ageCheckerUuid);
        return;
      }
      if (this.ageNeedsVerification) {
        this.preSetBundle = bundle;
        window.AgeCheckerAPI.show();
        return;
      }
      setTimeout(() => {
        this.$store.dispatch('disableLoader');
        this.isBundleSelected = true;
        this.currentBundle = bundle;
        // scroll to top when selected
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      }, 400);
    },
    cashierSuccess() {
      this.cashierState = 'success';
      this.$store.dispatch('getBalance');
    },
    signUpCompleted() {
      this.profileCompleted = true;
      if (typeof this.$route.query.unlock !== 'undefined' && this.$route.query.unlock) {
        this.$router.push({ name: 'Lobby', params: { unlock: 1 } });
      }
    },
    isProfileCompleted(playerData) {
      if (
        playerData.firstName
        && playerData.lastName
        && playerData.address
        && playerData.city
        && playerData.postalCode
        && playerData.country
      ) {
        this.profileCompleted = true;
      } else {
        this.profileCompleted = false;
      }
    },
    payViaCard() {
      this.$store.dispatch('createSumsubApplicant', this.playerData);
      sessionStorage.setItem('currentBundle', JSON.stringify(this.currentBundle));
      if (this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false) {
        sessionStorage.setItem('wasFtdPurchase', true);
      } else {
        sessionStorage.removeItem('wasFtdPurchase');
      }
      this.$store.dispatch('enableLoader');
      const prepareDepositData = new FormData();
      prepareDepositData.append('paymentMethod', 'UNIPAAS');
      prepareDepositData.append('action', 'GET_EXCHANGE_INFO');
      this.$apiToken.post('prepareDeposit', prepareDepositData)
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            const { conversionId } = response.data;
            const processDepositData = new FormData();
            processDepositData.append('paymentMethod', 'UNIPAAS');
            processDepositData.append('conversionId', conversionId);
            processDepositData.append('amount', this.currentBundle.price);
            processDepositData.append('requestedBonusPlanId', this.currentBundle.bonus_id);
            this.$apiToken.post('processDeposit', processDepositData)
              .then((response2) => {
                this.$store.dispatch('disableLoader');
                if (response2.data.status === 'CONTINUE_TO_PAYMENT_SITE') {
                  if (this.isMobile) {
                    window.location = response2.data.continueUrl;
                  } else {
                    this.cashierUrl = response2.data.continueUrl;
                  }
                } else {
                  this.$noty.error(response2.data.message);
                }
              });
          } else {
            this.$noty.error(response.data.status);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    payViaSkrill() {
      this.$store.dispatch('createSumsubApplicant', this.playerData);
      sessionStorage.setItem('currentBundle', JSON.stringify(this.currentBundle));
      if (this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false) {
        sessionStorage.setItem('wasFtdPurchase', true);
      } else {
        sessionStorage.removeItem('wasFtdPurchase');
      }
      this.$store.dispatch('enableLoader');
      const prepareDepositData = new FormData();
      prepareDepositData.append('paymentMethod', 'MONEYBOOKERS');
      prepareDepositData.append('action', 'GET_EXCHANGE_INFO');
      this.$apiToken.post('prepareDeposit', prepareDepositData)
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            const { conversionId } = response.data;
            const processDepositData = new FormData();
            processDepositData.append('paymentMethod', 'MONEYBOOKERS');
            processDepositData.append('conversionId', conversionId);
            processDepositData.append('amount', this.currentBundle.price);
            processDepositData.append('requestedBonusPlanId', this.currentBundle.bonus_id);
            processDepositData.append('payFromEmail', this.playerData.email);
            this.$apiToken.post('processDeposit', processDepositData)
              .then((response2) => {
                this.$store.dispatch('disableLoader');
                if (response2.data.status === 'CONTINUE_TO_PAYMENT_SITE') {
                  const paymentUrl = new URL(response2.data.continueUrl, this.endpointAPI);
                  this.cashierUrl = paymentUrl.href;
                } else {
                  this.$noty.error(response2.data.message);
                }
              });
          } else {
            this.$noty.error(response.data.status);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    payViaBank(id, widget) {
      this.$store.dispatch('createSumsubApplicant', this.playerData);
      sessionStorage.setItem('currentBundle', JSON.stringify(this.currentBundle));
      if (this.playerData?.madeDeposit !== 'undefined' && this.playerData.madeDeposit === false) {
        sessionStorage.setItem('wasFtdPurchase', true);
      } else {
        sessionStorage.removeItem('wasFtdPurchase');
      }
      let isLightbox = true;
      this.trustlyData.trustlyOptions.widgetContainerId = 'widget';
      if (typeof widget !== 'undefined' && this.trustlyAutoShowWidgetWhenNoSavedBanks) {
        isLightbox = false;
        this.trustlyData.trustlyOptions.widgetContainerId = 'widget-trustly';
      }
      this.$store.dispatch('enableLoader');
      const prepareDepositData = new FormData();
      prepareDepositData.append('paymentMethod', 'TRUSTLYPBB_BANKTRANSFER');
      prepareDepositData.append('action', 'GET_EXCHANGE_INFO');
      this.$apiToken.post('prepareDeposit', prepareDepositData)
        .then((response) => {
          // console.log(response);
          // console.log(response.data);
          if (response.data.status === 'SUCCESS') {
            const { conversionId } = response.data;
            const processDepositData = new FormData();
            processDepositData.append('paymentMethod', 'TRUSTLYPBB_BANKTRANSFER');
            processDepositData.append('conversionId', conversionId);
            processDepositData.append('description', 'purchase');
            processDepositData.append('amount', this.currentBundle.price);
            processDepositData.append('requestedBonusPlanId', this.currentBundle.bonus_id);
            if (id) {
              processDepositData.append('paymentInformationId', id);
            }
            this.$apiToken.post('processDeposit', processDepositData)
              .then((response2) => {
                this.$store.dispatch('disableLoader');
                // console.log('response2', response2);
                // console.log('response2', response2.data);
                if (response2.data.status === 'CONTINUE_TO_PAYMENT_SITE') {
                  const {
                    accessId, calculatedSignature, merchantId, merchantReference, customer, transactionId, description,
                  } = response2.data;
                  this.trustlyData.establishData.accessId = accessId;
                  this.trustlyData.establishData.requestSignature = calculatedSignature;
                  this.trustlyData.establishData.merchantId = merchantId;
                  this.trustlyData.establishData.merchantReference = merchantReference;
                  this.trustlyData.establishData.customer = customer;
                  if (response2.data.description === 'refreshToken') {
                    this.trustlyData.establishData.description = description;
                    this.trustlyData.establishData.paymentType = 'Verification';
                    this.trustlyData.establishData.transactionId = transactionId;
                    this.trustlyData.establishData.authToken = 'new';
                  }
                  if (isLightbox) {
                    window.Trustly.establish(this.trustlyData.establishData, this.trustlyData.trustlyOptions);
                  } else {
                    window.Trustly.selectBankWidget(this.trustlyData.establishData, this.trustlyData.trustlyOptions);
                  }
                } else if (response2.data.status === 'SUCCESS') {
                  const {
                    paymentId,
                  } = response2.data;
                  this.$router.push({ name: 'BuyCoins', query: { merchantReference: paymentId } });
                } else {
                  this.$noty.error(response2.data.message);
                }
              });
          } else {
            this.$noty.error(response.data.status);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    ageChecker(w, d) {
      const config = {
        mode: 'manual',
        key: this.ageCheckerApiKey,
        onclosed: async () => {
          console.log('onclosed');
          await this.$store.dispatch('updateExtraInfo', { ageNeedsVerification: 'accepted', sumsubStatus: 'init' });
          if (this.preSetBundle) {
            this.selectBundle(this.preSetBundle);
          }
          this.$store.dispatch('disableLoader');
        },
        onstatuschanged: (data) => {
          console.log('onstatuschanged', data);
          if (data.status === 'accepted') {
            this.$store.dispatch('updateExtraInfo', { ageNeedsVerification: data.status, ageCheckerUuid: data.uuid, sumsubStatus: 'init' });
          } else {
            this.$store.dispatch('updateExtraInfo', { ageNeedsVerification: data.status, ageCheckerUuid: data.uuid });
          }
        },
      };
      w.AgeCheckerConfig = config;
      if (config.path && (w.location.pathname + w.location.search).indexOf(config.path)) return;
      const h = d.getElementsByTagName('head')[0];
      const a = d.createElement('script');
      a.src = 'https://cdn.agechecker.net/static/popup/v1/popup.js';
      a.crossOrigin = 'anonymous';
      // eslint-disable-next-line func-names
      a.onerror = function () {
        w.location.href = 'https://agechecker.net/loaderror';
      };
      h.appendChild(a, h.firstChild);
    },
    async checkPaymentStatus(firstTime) {
      if (firstTime) {
        this.paymentCheckedCounter = 0;
      }
      this.paymentCheckedCounter += 1;
      if (this.$route.query.merchantReference && !this.$route.query.cancelled) {
        const mRef = this.$route.query.merchantReference.replace('DEPOSIT-', '').replace('DEPOSIT_REQUEST-', '').replace('VERIFICATION-', '');
        if (firstTime) {
          this.$store.dispatch('enableLoader');
        }
        const checkTrustlyPaymentStatus = await this.$apiToken.get('checkPaymentStatus', {
          params: {
            paymentMethod: 'TRUSTLYPBB_BANKTRANSFER',
            paymentId: mRef,
          },
        });
        this.$store.dispatch('disableLoader');
        if (checkTrustlyPaymentStatus && checkTrustlyPaymentStatus.data?.paymentStatus === 'COMPLETED') {
          // this.$noty.error('Your purchase was successful.');
          this.$store.dispatch('getBalance');
          // this.$router.replace({ query: null });
          setTimeout(() => {
            this.$router.push({ name: 'Lobby', query: { orderId: mRef } });
          }, 300);
        } else if (checkTrustlyPaymentStatus && checkTrustlyPaymentStatus.data?.paymentStatus === 'PENDING' && checkTrustlyPaymentStatus.data?.status === 'CONTINUE_TO_PAYMENT_SITE') {
          const {
            accessId, calculatedSignature, merchantId, merchantReference, customer, transactionId, description,
          } = checkTrustlyPaymentStatus.data;
          this.trustlyData.establishData.accessId = accessId;
          this.trustlyData.establishData.requestSignature = calculatedSignature;
          this.trustlyData.establishData.merchantId = merchantId;
          this.trustlyData.establishData.merchantReference = merchantReference;
          this.trustlyData.establishData.customer = customer;
          this.trustlyData.establishData.paymentType = 'Verification';
          this.trustlyData.establishData.authToken = 'new';
          this.trustlyData.establishData.transactionId = transactionId;
          this.trustlyData.establishData.description = description;
          this.trustlyData.establishData.cancelUrl = '/buy-coins?cancelled=true';
          window.Trustly.establish(this.trustlyData.establishData, this.trustlyData.trustlyOptions);
        } else if (checkTrustlyPaymentStatus && checkTrustlyPaymentStatus.data?.paymentStatus === 'PENDING') {
          if (firstTime) {
            this.$noty.error('Thank you, we are processing your purchase.');
          }
          if (this.paymentCheckedCounter > 5) {
            this.$noty.error('Payment pending. Processing should take up to 30min.');
            this.$router.push({ name: 'BuyCoins' });
          } else {
            setTimeout(() => {
              this.checkPaymentStatus(false);
            }, 3500);
          }
        } else if (checkTrustlyPaymentStatus.data?.paymentStatus === 'FAILED') {
          this.$router.push({ name: 'BuyCoins' });
          this.$noty.error(`Payment failed - ${checkTrustlyPaymentStatus.data?.message}`);
        } else if (checkTrustlyPaymentStatus.data?.status === 'VALIDATION_FAIL') {
          this.$router.go();
          this.$noty.error('Something went wrong! Please try again or contact support.');
        }
      } else {
        this.$noty.error('Your payment has been cancelled.');
        this.$router.push({ name: 'BuyCoins' });
      }
    },
  },
  async created() {
    this.$store.dispatch('enableLoader');
    if (typeof window.AgeCheckerConfig === 'undefined') {
      this.ageChecker(window, document);
    }
    this.$apiCmsNew.get('/cashier').then(async (response) => {
      this.cashierNew = response.data.new;

      // SAVE FTD PACKAGE SWEEP
      if (response.data.new.ftp_store_settings.most_popular) {
        this.ftdBundle = response.data.new.ftp_store_settings.most_popular;
      }
      // console.log('uriPackage', this.uriPackage);
      if (response.data.new.ftp_store_settings.most_popular && this.uriPackage && parseInt(response.data.new.ftp_store_settings.most_popular.bonus_id, 10) === parseInt(this.uriPackage, 10)) {
        console.log('uriFtp');
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.isFtdBundleSelected = true;
          this.selectBundle(response.data.new.ftp_store_settings.most_popular);
        }, 500);
      }
      if (response.data.labor_package && this.uriPackage && response.data.labor_package.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package);
        }, 500);
      }
      if (response.data.labor_package_2 && this.uriPackage && response.data.labor_package_2.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_2);
        }, 500);
      }
      if (response.data.labor_package_3 && this.uriPackage && response.data.labor_package_3.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_3);
        }, 500);
      }
      if (response.data.labor_package_4 && this.uriPackage && response.data.labor_package_4.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_4);
        }, 500);
      }
      if (response.data.labor_package_5 && this.uriPackage && response.data.labor_package_5.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_5);
        }, 500);
      }
      if (response.data.labor_package_6 && this.uriPackage && response.data.labor_package_6.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_6);
        }, 500);
      }
      if (response.data.labor_package_7 && this.uriPackage && response.data.labor_package_7.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_7);
        }, 500);
      }
      if (response.data.labor_package_8 && this.uriPackage && response.data.labor_package_8.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_8);
        }, 500);
      }
      if (response.data.labor_package_9 && this.uriPackage && response.data.labor_package_9.bonus_id === this.uriPackage) {
        this.uriPackageSelected = true;
        setTimeout(() => {
          this.selectBundle(response.data.labor_package_9);
        }, 500);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      this.$store.dispatch('disableLoader');
    });
    this.$apiToken.get('getPaymentInformation').then((response) => {
      this.yourSavedPaymentMethods = response.data.data;
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      console.log('fina');
    });
    if (this.$route.query.merchantReference) {
      await this.checkPaymentStatus(true);
    }
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage);
    if (this.playerData) {
      this.isProfileCompleted(this.playerData);
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage);
  },
  watch: {
    isBundleSelected() {
      if (this.yourSavedTrustlyBanks && this.yourSavedTrustlyBanks.length) {
        // this.payViaBank(false, 'widget');
      } else if (this.trustlyAutoShowWidgetWhenNoSavedBanks) {
        this.payViaBank(false, 'widget');
      }
    },
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.isProfileCompleted(playerDataReady);
      }
    },
    cashierUrl(iframeUrl) {
      if (iframeUrl) {
        EventBus.$emit('open-modal', 'cashier-modal');
      }
    },
    '$route.query.merchantReference': {
      handler(merchantReference) {
        console.log('watch', merchantReference);
        if (merchantReference) {
          this.checkPaymentStatus(true);
        }
      },
      deep: true,
      immediate: false,
    },
  },
};
</script>

<style scoped>
.banner-lobby-mobile {
  display: none;
}
.banner-lobby-desktop {
  display: block;
}
.banner-lobby-desktop[src*="veags-ftd-desktop"] {
  margin-left: -28px;
  margin-right: -28px;
  width: calc(100% + 62px);
  max-width: calc(100% + 62px);
  margin-top: 0;
  margin-bottom: 0;
  cursor: pointer;
}
.banner-lobby-mobile[src*="veags-ftd-mobile"] {
  margin-left: -8px;
  margin-right: -8px;
  width: calc(100% + 16px);
  max-width: calc(100% + 16px);
  margin-top: 0;
  margin-bottom: 0;
  cursor: pointer;
}
.trustly-processing {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.nopromo-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.6rem;
}
.nopromo-btns .button {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  max-width: unset;
  width: auto;
  min-width: 160px;
}

.nopromoavl {
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .banner-lobby-mobile {
    display: block;
  }
  .banner-lobby-desktop {
    display: none;
  }
}
</style>
