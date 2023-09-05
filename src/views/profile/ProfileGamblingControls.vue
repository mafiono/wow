<template>
  <div>
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <section>
      <h3 class="mb-double">Spending Controls</h3>
      <template v-show="personalLimit || getLimitsError">
        <profile-deposit-limits></profile-deposit-limits>
        <profile-self-exclusion v-if="personalLimit || getLimitsError"></profile-self-exclusion>
      </template>
      <transition name="fade">
        <loader v-if="!personalLimit && !getLimitsError" />
      </transition>
    </section>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import ProfileSelfExclusion from '@/components/organisms/ProfileSelfExclusion.vue';
import ProfileDepositLimits from '@/components/organisms/ProfileDepositLimits.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    ProfileSelfExclusion,
    ProfileDepositLimits,
    Loader,
  },
  computed: {
    ...mapGetters(['personalLimit', 'getLimitsError']),
  },
};
</script>
