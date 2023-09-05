<template>
  <div class="wow-header">
    <div class="header-main container">
      <div class="header-main--open">
        <button @click="toggleMenu"><Icon name="menu"></Icon></button>
        <!-- <div class="coins" @click="toggleSelectMode" v-if="sweep && loggedIn">
          <div class="circle circle--orange" :class="{ 'selected' : currencyMode === 'REAL' }"></div>
          <div class="circle circle--blue" :class="{ 'selected' : currencyMode === 'FUN' }"></div>
        </div> -->
        <router-link v-if="loggedIn" :to="{ name: 'Lobby', query: { search : '' } }" class="navbar-search">
          <Icon name="search" :height="20"></Icon>
        </router-link>
      </div>
      <div class="header-main--logo">
        <router-link to="/"><Icon name="logo" :height="50"></Icon></router-link>
      </div>
      <div class="header-main--info">
        <div class="currencies" v-if="balance && loggedIn">
          <div v-if="sweep" class="currency currency--real" :class="{ 'selected' : currencyMode === 'REAL' }" @click="changePlayMode('REAL')">
            <p v-if="currencyReal">{{ currencyReal.totalBalance }}</p>
            <p v-else>0.00</p>
            <Icon name="gold_coin" :height="25"></Icon>
          </div>
          <div class="currency currency--fun" :class="{ 'selected' : currencyMode === 'FUN' }" @click="changePlayMode('FUN')">
            <p v-if="currencyFun">{{ currencyFun.totalBalance }}</p>
            <p v-else>0.00</p>
            <Icon name="blue_coin" :height="25"></Icon>
          </div>
        </div>
        <div v-if="sweep" class="coins" @click="toggleSelectMode">
          <div class="circle circle--orange" :class="{ 'selected' : currencyMode === 'REAL' }"></div>
          <div class="circle circle--blue" :class="{ 'selected' : currencyMode === 'FUN' }"></div>
        </div>
      </div>
    </div>
    <!-- Buy Coins -->
    <Button type="secondary" class="header-buy-coins" v-if="(this.$route.meta.buyCoins)" tag="router-link" :to="{ name: 'BuyCoins' }">
      Buy Coins
    </Button>
    <!-- Mobile menu -->
    <transition name="fadequick" mode="out-in">
      <div class="header-menu" v-if="openMenu">
        <div class="header-menu--top container">
          <div><button @click="toggleMenu"><Icon name="close" :height="18"></Icon></button></div>
          <div class="logo"><router-link to="/"><Icon name="logo2" :height="50"></Icon></router-link></div>
          <div></div>
        </div>
          <div class="header-menu--links container">
            <div class="currencies" v-if="loggedIn && balance">
              <div v-if="sweep" class="currency currency--real" :class="{ 'selected' : currencyMode === 'REAL' }" @click="changePlayMode('REAL', true)">
                <p v-if="currencyReal">{{ currencyReal.totalBalance }}</p>
                <p v-else>0.00</p>
                <Icon name="gold_coin" :height="25"></Icon>
              </div>
              <div class="currency currency--fun" :class="{ 'selected' : currencyMode === 'FUN' }" @click="changePlayMode('FUN', true)">
                <p v-if="currencyFun">{{ currencyFun.totalBalance }}</p>
                <p v-else>0.00</p>
                <Icon name="blue_coin" :height="25"></Icon>
              </div>
            </div>
            <template v-if="loggedIn">
              <div><Button type="secondary" tag="router-link" :to="{ name: 'BuyCoins' }">Buy Coins</Button></div>
              <div v-if="sweep"><Button type="primary" tag="router-link" to="/redeem">Redeem Coins</Button></div>
              <hr />
              <router-link v-if="sweep" class="link" :to="{ name: 'Promotions' }"><h4>Promotions</h4></router-link>
              <router-link v-if="sweep" class="link" :to="{ name: 'VIP' }"><h4>STAR SYSTEM VIP</h4></router-link>
              <router-link v-if="sweep" class="link" :to="{ name: 'RAF' }"><h4>Refer a Friend</h4></router-link>
              <hr v-if="sweep" />
              <router-link class="link" :to="{ name: 'Lobby' }"><h4>Lobby</h4></router-link>
              <router-link v-if="sweep" class="link" :to="{ name: 'Jackpots' }"><h4>Prize drops</h4></router-link>
              <router-link
                class="link"
                v-for="category in menuCategories"
                :key="category.id"
                :to="{ name: 'Lobby', query: { category: category.slug } }">
                <h4>{{ category.name }}</h4>
              </router-link>
              <hr />
              <router-link v-if="sweep" class="link" :to="{ name: 'Star System FAQ' }"><h4>Star System FAQ</h4></router-link>
              <router-link v-if="sweep" class="link" :to="{ name: 'Payment FAQ' }"><h4>Payment FAQ</h4></router-link>
              <router-link v-if="sweep" class="link" :to="{ name: 'Verification FAQ' }"><h4>Verification FAQ</h4></router-link>
              <router-link class="link" :to="{ name: 'FAQ' }"><h4>General FAQ</h4></router-link>
              <hr />
              <router-link class="link" :to="{ name: 'Contact Us' }"><h4>24/7 Customer Help</h4></router-link>
              <hr v-if="sweep" />
              <router-link v-if="sweep" class="link" :to="{ name: 'MyRedemptions' }"><h4>My Redemptions</h4></router-link>
              <hr />
              <router-link class="link" :to="{ name: 'Profile' }"><h4>Profile</h4></router-link>
              <router-link class="link" :to="{ name: 'GameHistory' }"><h4>Gaming History</h4></router-link>
              <router-link class="link" :to="{ name: 'TransactionHistory' }"><h4>Transaction History</h4></router-link>
            </template>
            <template v-else>
              <div><Button type="secondary" tag="router-link" :to="{ name: 'Login' }">Login</Button></div>
              <div><Button type="primary" tag="router-link" :to="{ name: 'Register' }">Register</Button></div>
              <hr>
              <router-link class="link" :to="{ name: 'LandingPage' }"><h4>Home</h4></router-link>
              <router-link class="link" :to="{ name: 'Terms and Conditions' }"><h4>Terms &amp; Conditions</h4></router-link>
              <router-link class="link" :to="{ name: 'Privacy Policy' }"><h4>Privacy Policy</h4></router-link>
              <router-link class="link" :to="{ name: 'Responsible Gaming' }"><h4>Responsible Social Gaming</h4></router-link>
              <router-link class="link" :to="{ name: 'Contact Us' }"><h4>24/7 Customer Help</h4></router-link>
            </template>
            <template v-if="loggedIn">
              <hr>
              <a href="#" class="link" @click="logout"><h4>Logout</h4></a>
            </template>
          </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import { mapGetters } from 'vuex';
import EventBus from '@/helpers/EventBus';

export default {
  data() {
    return {
      openMenu: false,
    };
  },
  components: {
    Icon,
    Button,
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    profilePicture() {
      return require(`../../assets/img/profile.jpeg`);
    },
    currencyReal() {
      const balances = this.balance.currencyBalances;
      return balances.find((balance) => balance.currency === 'WOC');
    },
    currencyFun() {
      const balances = this.balance.currencyBalances;
      return balances.find((balance) => balance.currency === 'VBC');
    },
    ...mapGetters(['balance', 'menuCategories', 'currencyMode', 'playerData', 'sweep']),
  },
  created() {
    EventBus.$on('close-menu', () => {
      if (this.openMenu) {
        this.toggleMenu();
      }
    });
    if (this.loggedIn) {
      this.$store.dispatch('getPlayerInfo');
    }
  },
  methods: {
    toggleSelectMode() {
      EventBus.$emit('toggle-modal', 'select-mode', false);
    },
    toggleMenu() {
      this.openMenu = !this.openMenu;
      EventBus.$emit('no-scroll');
    },
    logout(event) {
      event.preventDefault();
      this.toggleMenu();
      this.$store.dispatch('logout');
    },
    changePlayMode(mode, collapseMenu = false) {
      const payload = { mode };
      this.$store.dispatch('changePlayMode', payload);
      if (collapseMenu) {
        this.toggleMenu();
      }
    },
  },
};
</script>
