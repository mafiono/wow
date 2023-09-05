<template>
  <div>
    <!-- Back arrow -->
    <div class="back-to-profile">
        <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <!-- Marketing preferences -->
    <section v-if="marketingConsents.length">
      <h3 class="mb-double">Contact preferences</h3>
      <p class="mb-double">Select how you'd like to be contacted.</p>
      <div v-for="(userConsent, index) in marketingConsents" :key="index">
        <div class="toggle-group" @input="toggleHasChanged = true">
          <Toggle v-model="consents[index]" @input="handleChange($event, index);" :id="userConsent.consent.name"/>
          <span>Receive {{ userConsent.consent.name }}</span>
        </div>
      </div>
      <Button
        class="mt-single"
        type="primary"
        :loading="loading"
        :disabled="!toggleHasChanged"
        @click="showPasswordPopUp = true">
        Update
      </Button>
      <div v-if="contactPrefUpdated && !loading" class="sucess-text">
        Contact preference updated.
      </div>
      <PasswordPopUp
        v-if="showPasswordPopUp"
        @accepted="passwordConfirmed"
        @cancelled="showPasswordPopUp = false"
      >
      </PasswordPopUp>
    </section>
    <transition name="fade">
      <loader v-if="!userConsents" />
    </transition>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import Toggle from '@/components/atoms/Toggle.vue';
import PasswordPopUp from '@/components/molecules/PasswordPopUp.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      consents: [],
      oldConsents: [],
      changedConsents: [],
      toggleHasChanged: false,
      showPasswordPopUp: false,
    };
  },
  computed: {
    ...mapGetters(['contactPrefUpdated', 'userConsents']),
    marketingConsents() {
      if (!this.userConsents || !this.userConsents.length) {
        return [];
      }
      const marketingConsents = this.userConsents.filter((consent) => consent.consent.parentKey === 'MARKETING');
      return marketingConsents;
    },
  },
  components: {
    Icon,
    Button,
    Toggle,
    PasswordPopUp,
    Loader,
  },
  methods: {
    handleChange(bool, index) {
      this.$store.commit('SET_CONTACT_PREF_UPDATED', false);
      if (bool !== this.oldConsents[index]) {
        this.changedConsents[index] = bool;
      } else {
        delete this.changedConsents[index];
      }
    },
    passwordConfirmed() {
      this.showPasswordPopUp = false;
      this.updateUserConsents();
    },
    async updateUserConsents() {
      const acceptConsents = [];
      const deleteConsents = [];
      this.loading = true;
      this.marketingConsents.forEach((userConsent, index) => {
        if (typeof this.changedConsents[index] === 'undefined') {
          return;
        }
        if (this.changedConsents[index]) {
          acceptConsents.push(userConsent.consent.consentVersionId);
        } else {
          deleteConsents.push(userConsent.consent.consentVersionId);
        }
      });
      this.loading = true;
      await this.$store.dispatch('updateUserConsents', {
        consentedVersions: acceptConsents,
        unConsentedVersions: deleteConsents,
      });
      this.changedConsents = [];
      this.oldConsents = [...this.consents];
      this.toggleHasChanged = false;
      this.loading = false;
    },
    async fetchUserConsents() {
    // Reset
      if (!this.userConsents) {
      // Get consents
        await this.$store.dispatch('getUserConsents');
      }
      // Init consents array. Consent will be boolean for toggle
      this.oldConsents = [];
      this.marketingConsents.forEach((userConsent) => {
        this.oldConsents.push(userConsent.consentStatus === 'CONSENTED');
      });
      this.consents = [];
      this.marketingConsents.forEach((userConsent) => {
        this.consents.push(userConsent.consentStatus === 'CONSENTED');
      });
    },
  },
  created() {
    this.$store.commit('SET_CONTACT_PREF_UPDATED', false);
    this.fetchUserConsents(false);
  },
};
</script>

<style lang="scss">
.toggle-group {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  span {
    margin-left: 15px;
    font-weight: 500;
  }
}
</style>
