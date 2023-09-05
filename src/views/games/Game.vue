<template>
  <div>
    <section class="play container section">
      <div v-if="loading" class="page-loader-wrapper" key="asd1">
        <div class="page-loader"></div>
      </div>
      <transition-group name="fade" mode="in-out">
        <div v-if="!loading" key="asd2">
          <div class="game-info mb-single">
            <p v-if="name">You are playing <span class="standout" v-html="name"></span> <template v-if="showPlatformName && platformName">from the guys at <span v-html="platformName"></span></template></p>
            <Button type="primary" :width="100" @click="goBack">Back</Button>
          </div>
          <div class="game-container" v-if="platform && associateAccounts" :class="{ 'evolution-container': platformName == 'Evolution' }">
            <iframe
              class="game-frame"
              :key="currencyMode"
              :src="getSource"
              frameborder="0"
              scrolling="no"
              noresize="noresize"
              allowfullscreen="allowfullscreen"
              ref="gameIframe">
            </iframe>
          </div>
          <div v-if="playerData && sweep" class="game-footer">
            <div class="container">
              <div class="game-footer-flex">
                <div v-if="stateFull && (playerData.province.toUpperCase() === 'NY' || playerData.province.toUpperCase() === 'FL')" class="game-footer-disclaimer">
                  <span class="i-province">i</span> {{ stateFull }} <router-link :to="{ name: 'Sweepstakes Rules' }">sweepstakes rules</router-link> apply.
                </div>
                <div v-else class="game-footer-disclaimer">
                  <span class="i-province">i</span> <router-link :to="{ name: 'Sweepstakes Rules' }">Sweepstakes rules</router-link> apply.
                </div>
                <div>
                  <Button type="secondary" tag="router-link" :to="{ name: 'BuyCoins' }">Buy Coins</Button>
                </div>
              </div>
            </div>
          </div>
          <div class="game-close">
            <router-link to="/lobby" tag="button">
              <Icon name="close-white" :width="15" :height="15"></Icon>
            </router-link>
          </div>
        </div>
      </transition-group>
    </section>
    <transition name="fade">
      <modal :opened="showBalanceDropBanner" name="lowcoins-modal" ref="modal" :closeButton="true">
        <div class="lowcoins-modal-inner">
          <h2>Out of WOW Coins?</h2>
          <p>Don't worry, we've got you covered! Claim your free WOW Coins now and keep the fun going.</p>
          <p class="low-coins-amount"><Icon name="blue_coin" :height="25"></Icon> 15,000 WOW Coins</p>
          <Button type="primary" @click="claimVBC">CLAIM NOW</Button>
        </div>
      </modal>
    </transition>
    <rotate-device-modal v-if="orientation" :orientation="orientation"></rotate-device-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import EventBus from '@/helpers/EventBus';
import RotateDeviceModal from '@/components/molecules/RotateDeviceModal.vue';
import Modal from '@/components/templates/Modal.vue';
import abbrState from '@/helpers/stateAbbrConverter';

export default {
  name: 'Play',
  props: {
    slug: String,
  },
  data() {
    return {
      id: String,
      mobileId: null,
      name: 'Name',
      tableId: String,
      platformName: String,
      showPlatformName: false,
      pollingBalance: null,
      loading: true,
      platform: String,
      orientation: null,
      receiveMessage: (event) => {
        console.log('event', event);

        if (!event.data || typeof event.data === 'string') {
          return;
        }
        const disableLoaderOnTheseMsgs = [
          'exi_onPostMessageBasedInterfaceReady',
          'exi_onMainGameRoundCompleted',
          'exi_onGameInitialized',
          'loaded',
        ];
        if (typeof event.data.exi_fMessageType_str !== 'undefined' && disableLoaderOnTheseMsgs.includes(event.data.exi_fMessageType_str)) {
          this.$store.dispatch('disableLoader');
        }
        // pragmatic play
        if (typeof event.data.event !== 'undefined' && disableLoaderOnTheseMsgs.includes(event.data.event)) {
          this.$store.dispatch('disableLoader');
        }
        if (typeof event.data.name !== 'undefined' && (event.data.name === 'gameQuit' || event.data.name === 'notifyCloseContainer')) {
          this.$router.push({ name: 'Lobby' });
        }
      },
    };
  },
  computed: {
    ...mapGetters(['balance', 'token', 'currencyMode', 'associateAccounts', 'sweep', 'playerData']),
    stateFull() {
      if (!this.playerData) return null;
      return abbrState(this.playerData.province);
    },
    getSource() {
      const platform = this.platform.toUpperCase();
      let sessionKey = this.token;
      if (this.currencyMode === 'FUN') {
        const funAccount = this.associateAccounts.find((account) => account.currency === 'VBC');
        sessionKey = funAccount.sessionKey;
      }
      let gameId = this.id;
      if (this.isMobile && this.mobileId) {
        gameId = this.mobileId;
      }
      let host = process.env.VUE_APP_API_HOST;
      host = host.replace('ips/', '');
      let source = `${host}game/GameContainer.action?platform=${platform}&gameId=${gameId}&playForReal=true&sessionKey=${sessionKey}`;
      if (this.tableId) {
        source = `${source}&lang=en&tid=${this.tableId}`;
      }
      return source;
    },
    isMobile() {
      return typeof window.orientation !== 'undefined';
    },
    balanceReal() {
      const balances = this.balance?.currencyBalances;
      if (!balances) return null;
      return balances.find((balance) => balance.currency === 'WOC');
    },
    balanceFun() {
      const balances = this.balance?.currencyBalances;
      if (!balances) return null;
      return balances.find((balance) => balance.currency === 'VBC');
    },
    showBalanceDropBanner() {
      if (this.balanceFun && typeof this.balanceFun.totalBalanceNumber !== 'undefined' && parseFloat(this.balanceFun.totalBalanceNumber) < 10) {
        return true;
      }
      return false;
    },
  },
  components: {
    Button,
    Icon,
    RotateDeviceModal,
    Modal,
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    updateBalance() {
      this.$store.dispatch('getBalance');
    },
    async getGame() {
      try {
        this.$store.dispatch('enableLoader');
        const response = await this.$apiCmsNew.get(`/game?slug=${this.slug}`);
        const game = response.data[0];
        this.id = game.game_id;
        this.name = game.title.rendered;
        this.tableId = game.tableId;
        this.platform = game.game_provider.slug;
        this.platformName = game.game_provider.name;
        if (game.game_id_mobile) {
          this.mobileId = game.game_id_mobile;
        }
        if (game.orientation) {
          this.orientation = game.orientation;
        }
        this.loading = false;
        setTimeout(() => {
          this.$store.dispatch('disableLoader');
        }, 3500);
        return true;
      } catch {
        this.$noty.error('Error loading the game');
        this.$store.dispatch('disableLoader');
        EventBus.$emit('close-modal', 'select-mode');
        this.$router.push({ name: '404 Error' });
        return false;
      }
    },
    toggleSelectMode() {
      const tickbox = true;
      EventBus.$emit('toggle-modal', 'select-mode', tickbox);
    },
    // Check user's orientation
    checkOrientation() {
      // If user's on mobile and the game needs a specific orientation
      if (this.isMobile && (this.orientation === 'PORTRAIT' || this.orientation === 'LANDSCAPE')) {
        this.orientationChanged();
        window.addEventListener('orientationchange', this.orientationChanged);
      }
    },
    // Show rotate message
    orientationChanged() {
      const currentOrientation = this.getOrientation();
      if (currentOrientation === 'PORTRAIT' && this.orientation === 'LANDSCAPE') {
        EventBus.$emit('open-modal', 'rotate-device');
      } else if (currentOrientation === 'LANDSCAPE' && this.orientation === 'PORTRAIT') {
        EventBus.$emit('open-modal', 'rotate-device');
      } else {
        EventBus.$emit('close-modal', 'rotate-device');
      }
    },
    getOrientation() {
      if (window.orientation === 90 || window.orientation === -90) {
        return 'LANDSCAPE';
      }
      return 'PORTRAIT';
    },
    async claimVBC() {
      console.log(this.$refs);
      this.$store.dispatch('enableLoader');
      this.$apiToken
        .get('/redeemBonus', {
          params: {
            bonusCode: 'EXTRASPIN',
          },
        })
        .then((response) => {
          console.log('responseresponse', response);
          if (response.data.status === 'SUCCESS') {
            this.$store.dispatch('getBalance');
            this.$noty.error('Success! We just added 15,000 WOW Coins to your account.');
          }
        })
        .catch((error) => {
          this.$noty.error(error.message);
        })
        .finally(async () => {
          this.$store.dispatch('disableLoader');
          const iframe = this.$refs.gameIframe;
          // eslint-disable-next-line no-self-assign
          iframe.src = iframe.src;
        });
    },
  },
  async created() {
    if (this.playerData && this.playerData.registrationStatus === 'QUICK_REG') {
      this.$router.push({ name: 'BuyCoins' });
    } else {
      const checkGameE = await this.getGame();
      if (checkGameE) {
        // call getBalance every 4 seconds
        this.pollingBalance = setInterval(() => {
          this.updateBalance();
        }, 4000);
        if (!localStorage.remember_currency && this.sweep) {
          this.toggleSelectMode();
        }
        // Check user's orientation after getting game's orientation
        this.checkOrientation();
        // if (this.isMobile) {
        //   window.location.replace(this.getSource); // Redirect
        // }
        window.addEventListener('message', this.receiveMessage);
      }
    }
  },
  mounted() {
    //
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    // remove polling @ leave
    clearInterval(this.pollingBalance);
    window.removeEventListener('message', this.receiveMessage);
  },
  watch: {
    playerData(playerDataReady) {
      if (playerDataReady && playerDataReady.registrationStatus === 'QUICK_REG') {
        clearInterval(this.pollingBalance);
        this.$router.push({ name: 'BuyCoins' });
      }
    },
  },
};
</script>

<style>
.lowcoins-modal-inner {
  background: rgb(0 0 0 / 85%);
  text-align: center;
  width: 650px;
  padding: 2rem;
  border-radius: 6px;
  border: 2px solid #00c5ff;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}
p.low-coins-amount {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 800;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
p.low-coins-amount>.icon {
  margin-right: 10px;
}
</style>
