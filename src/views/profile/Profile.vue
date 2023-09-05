<template>
  <section class="my-profile section container" >
    <div class="profile-sections">
      <!-- Router links -->
      <div class="profile-sections--menu" :class="{'mobile-hide': this.$route.name != 'Profile' }">
        <div class="profile-info">
          <img v-if="playerData && vipStatus === 'blue'" src="@/assets/vip/blue.png" class="vip-class" />
          <img v-else-if="playerData && vipStatus === 'bronze'" src="@/assets/vip/bronze.png" class="vip-class" />
          <img v-else-if="playerData && vipStatus === 'silver'" src="@/assets/vip/silver.png" class="vip-class" />
          <img v-else-if="playerData && vipStatus === 'gold'" src="@/assets/vip/gold.png" class="vip-class" />
          <img v-else-if="playerData && vipStatus === 'hosted'" src="@/assets/vip/hosted.png" class="vip-class" />
          <img v-else-if="playerData && vipStatus === 'rising'" src="@/assets/vip/rising.png" class="vip-class" />
          <Icon v-else name="profile" :height="50"></Icon>
          <div v-if="playerData">
            <h5 v-if="playerData.firstName && playerData.lastName">{{ playerData.firstName }} {{ playerData.lastName }}</h5>
            <h5 v-else>{{ playerData.userId }}</h5>
            <p class="email">{{ playerData.email }}</p>
          </div>
        </div>
        <div class="btn-wrapper mt-double">
          <Button type="primary" tag="router-link" to="/profile/edit-profile">Personal Details</Button>
        </div>
        <div class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/contact-preferences">Contact Preferences</Button>
        </div>
        <div v-if="sweep" class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/vip">STAR SYSTEM VIP</Button>
        </div>
        <div v-if="sweep" class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/refer-a-friend">Refer a Friend</Button>
        </div>
        <div v-if="sweep" class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/redemptions">My Redemptions</Button>
        </div>
        <div class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/game-history">Gaming History</Button>
        </div>
        <div class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/transaction-history">Transaction History</Button>
        </div>
        <div class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/profile/spending-controls">Spending Controls</Button>
        </div>
        <div class="btn-wrapper mt-double">
          <Button type="secondary"  tag="router-link" to="/buy-coins">Buy Coins</Button>
        </div>
        <div v-if="sweep" class="btn-wrapper">
          <Button type="primary" tag="router-link" to="/redeem">Redeem Coins</Button>
        </div>
      </div>
      <!-- Router view -->
      <router-view class="profile-sections--view" :class="{'mobile-hide': this.$route.name == 'Profile' }"></router-view>
    </div>
  </section>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';

import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    Button,
  },
  computed: {
    ...mapGetters(['playerData', 'sweep']),
    vipStatus() {
      if (!this.playerData?.vipStatus) return 'rising';
      return this.playerData?.vipStatus.toLowerCase();
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },
  created() {
    this.$store.dispatch('getPlayerInfo');
  },
};
</script>

<style>
.vip-class {
  height: 50px;
}
</style>
