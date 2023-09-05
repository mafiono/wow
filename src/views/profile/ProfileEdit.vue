<template>
  <div class="edit-profile">
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <section>
      <h3>Personal Details</h3>
      <template v-show="playerData && validCountries">
        <profile-user-form></profile-user-form>
        <profile-password-form></profile-password-form>
      </template>
      <transition name="fade">
        <loader v-if="!playerData || !validCountries" />
      </transition>
    </section>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import ProfileUserForm from '@/components/organisms/ProfileUserForm.vue';
import ProfilePasswordForm from '@/components/organisms/ProfilePasswordForm.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    ProfileUserForm,
    ProfilePasswordForm,
    Loader,
  },
  computed: {
    ...mapGetters(['playerData', 'validCountries']),
  },
};
</script>
