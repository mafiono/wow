<template>
  <div class="profile-history">
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <template v-show="depositHistory">
      <table-deposit-history></table-deposit-history>
    </template>
    <transition name="fade">
      <loader v-if="!depositHistory" />
    </transition>
  </div>
</template>

<script>
import TableDepositHistory from '@/components/organisms/TableDepositHistory.vue';
import Icon from '@/components/atoms/Icon.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    TableDepositHistory,
    Loader,
  },
  computed: {
    ...mapGetters(['depositHistory', 'withdrawalHistory']),
  },
};
</script>

<style></style>
