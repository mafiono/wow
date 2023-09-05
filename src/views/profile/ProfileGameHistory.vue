<template>
  <div class="profile-history">
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <table-game-history></table-game-history>
  </div>
</template>

<script>
import TableGameHistory from '@/components/organisms/TableGameHistory.vue';
import Icon from '@/components/atoms/Icon.vue';
// import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    TableGameHistory,
    // Loader,
  },
  computed: {
    ...mapGetters(['gameHistory']),
  },
};
</script>

<style></style>
