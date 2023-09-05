<template>
  <div v-if="playerData">
    <template v-if="this.userStatus === 'QUICK_REG'">
      <p>Complete your personal details to finish sign up process.</p>
      <Button style="text-align: center;" tag="router-link" to="/buy-coins" class="mt-single" type="primary">Complete your profile</Button>
    </template>
    <form v-else @submit.prevent="checkForm">
      <div class="edit-profile--form">
        <div class="edit-profile--form--col">
          <div class="input-group">
            <form-input v-model="user.firstName" name="First name" type="text" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.firstName.$error" class="error">
              <span v-if="!$v.user.firstName.required">First name is required</span>
            </div>
          </div>
          <div class="input-group">
            <form-input v-model="user.lastName" name="Last name" type="text" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.lastName.$error" class="error">
              <span v-if="!$v.user.lastName.required">Last name is required</span>
            </div>
          </div>
          <!-- Not editable -->
          <div class="input-group">
            <form-input v-model="user.birthDate" name="Date of birth" type="date" initial-view="year" :disable="isFieldDisable"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="user.gender" name="Gender" type="gender" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.gender.$error" class="error">
              <span v-if="!$v.user.gender.required">Gender is required</span>
            </div>
          </div>
        </div>
        <div class="edit-profile--form--col">
          <div class="input-group">
            <form-input v-model="user.address" name="Address" type="text" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.address.$error" class="error">
              <span v-if="!$v.user.address.required">Address is required</span>
            </div>
          </div>
          <div class="input-group">
            <form-input v-model="user.city" name="City" type="text" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.city.$error" class="error">
              <span v-if="!$v.user.city.required">City is required</span>
            </div>
          </div>
          <div class="input-group">
            <form-input v-model="user.postalCode" name="Zip code" type="text" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.postalCode.$error" class="error">
              <span v-if="!$v.user.postalCode.required">Zip code is required</span>
            </div>
          </div>
          <div class="input-group">
            <form-input v-if="validCountries" v-model="user.country" name="Country" type="countrySelect" :whiteList="validCountries" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.country.$error" class="error">
              <span v-if="!$v.user.country.required">Country is required</span>
            </div>
          </div>
        </div>
        <div class="edit-profile--form--col">
          <!-- Not editable -->
          <div class="input-group mt-0">
            <form-input v-model="user.nickname" name="Nickname" type="email" disable></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="user.email" name="Email" type="email" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.email.$error" class="error">
              <span v-if="!$v.user.email.required">Emal is required</span>
            </div>
          </div>
        </div>
        <div class="edit-profile--form--col">
          <div class="input-group mt-0">
            <form-input v-model="user.province" name="State" type="regionSelect" :countryRegions="user.country" :blackList="blacklistStates" :disable="isFieldDisable"></form-input>
            <div v-if="userFormsubmitted && $v.user.province.$error" class="error">
              <span v-if="!$v.user.province.required">State is required</span>
            </div>
          </div>
          <div class="input-group">
            <label class="label"> Mobile number </label>
            <vue-tel-input v-model="mobilePhone" @input="setFormattedPhoneNumber" :preferredCountries="['US','GB']" :disabled="isFieldDisable"><template v-slot:arrow-icon> <span class="arrow">▼</span> </template></vue-tel-input>
            <div v-if="userFormsubmitted && $v.user.mobilePhone.$error" class="error">
              <span v-if="!$v.user.mobilePhone.required">Valid mobile number is required</span>
            </div>
          </div>
          <!-- <div class="input-group">
            <form-input v-model="user.language" name="Language" type="text" disable></form-input>
            <div v-if="userFormsubmitted && $v.user.language.$error" class="error">
              <span v-if="!$v.user.language.required">Language is required</span>
            </div>
          </div> -->
        </div>
      </div>
      <Button v-if="!isFieldDisable" class="mt-single" type="primary" native-type="submit" :loading="userFormLoading">{{ buttonLabel}}</Button>
    </form>
    <div class="sucess-text" v-if="playerInfoUpdated">
      Your profile has been updated successfully.
    </div>
    <password-pop-up
      v-if="shouldAskForPasswordBeforeSubmitting && showPasswordPopUp"
      @accepted="passwordConfirmed"
      @cancelled="showPasswordPopUp = false"
    >
    </password-pop-up>
  </div>
</template>

<script>
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';
import PasswordPopUp from '@/components/molecules/PasswordPopUp.vue';
import { required, email } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import format from 'date-fns/format';

const VueTelInput = () => Promise.all([
  import(/* webpackChunkName: "chunk-vue-tel-input" */ 'vue-tel-input'),
  import(/* webpackChunkName: "chunk-vue-tel-input" */ 'vue-tel-input/dist/vue-tel-input.css'),
]).then(([{ VueTelInput }]) => VueTelInput); // eslint-disable-line

export default {
  data() {
    return {
      user: {
        nickname: null,
        firstName: null,
        lastName: null,
        email: null,
        birthDate: null,
        address: null,
        city: null,
        postalCode: null,
        country: null,
        mobilePhone: null,
        gender: null,
        language: null,
        province: null,
      },
      mobilePhone: null,
      userFormLoading: false,
      userFormsubmitted: false,
      shouldAskForPasswordBeforeSubmitting: false,
      showPasswordPopUp: false,
    };
  },
  validations: {
    user: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      address: { required },
      city: { required },
      postalCode: { required },
      country: { required },
      mobilePhone: { required },
      gender: { required },
      language: { required },
      province: { required },
      birthDate: {},
    },
  },
  components: {
    FormInput,
    Button,
    PasswordPopUp,
    VueTelInput,
  },
  computed: {
    ...mapGetters(['playerData', 'playerInfoUpdated', 'validCountries', 'blacklistStates']),
    buttonLabel() {
      if (this.userStatus === 'QUICK_REG') {
        return 'Save';
      }
      return 'Update';
    },
    userStatus() {
      return this.playerData.registrationStatus;
    },
    isFieldDisable() {
      return this.userStatus !== 'QUICK_REG';
    },
  },
  methods: {
    setFormattedPhoneNumber(inputStr, data) {
      if (data.valid && data.number) {
        this.user.mobilePhone = data.number;
      } else {
        this.user.mobilePhone = null;
      }
    },
    checkForm() {
      this.$store.commit('SET_PLAYER_INFO_UPDATED', false);
      this.userFormsubmitted = true;
      this.$v.$touch();
      if (!this.$v.user.$invalid) {
        if (this.shouldAskForPasswordBeforeSubmitting) {
          this.showPasswordPopUp = true;
        } else {
          this.updatePlayer(this.user);
        }
      }
    },
    passwordConfirmed() {
      this.showPasswordPopUp = false;
      this.updatePlayer(this.user);
    },
    async updatePlayer(user) {
      const playerData = { ...user };
      if (playerData.birthDate) {
        playerData.birthDate = format(playerData.birthDate, 'yyyy-MM-dd');
      }
      this.userFormLoading = true;
      if (this.userStatus === 'QUICK_REG') {
        // Complete Sign Up process
        await this.$store.dispatch('completeProfile', playerData);
      } else {
        // Update player info
        await this.$store.dispatch('updatePlayerInfo', playerData);
      }
      this.userFormLoading = false;
    },
    // Fill the form with player data (if it's not empty)
    fillPlayerData(playerData) {
      if (playerData) {
        this.user = { ...playerData };
      }
      if (playerData.country !== 'US' && playerData.country !== 'CA') {
        this.user.country = null;
      }
      if (playerData.birthDate) {
        // Change date format to DD-MM-YYYY to YYYY-MM-DD
        // const date = playerData.birthDate;
        // const shortDate = date.split(' ')[0].split('-');
        // const day = shortDate[0];
        // const month = shortDate[1];
        // const year = shortDate[2];
        // const newDate = `${year}-${month}-${day}`;
        // const newDate = new Date(year, (month - 1), day);

        // playerData.birthDate in format YYYY-MM-DD to new Date()
        const newDate = new Date(playerData.birthDate);
        this.user.birthDate = newDate;
      }
      if (playerData.gender === 'N') {
        this.user.gender = null;
      }
      if (playerData.mobilePhone) {
        this.mobilePhone = playerData.mobilePhone;
      }
    },
  },
  watch: {
    // playerData is not ready when mounted (when user enters page directly from url)
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.fillPlayerData(playerDataReady);
      }
    },
  },
  mounted() {
    if (this.playerData) {
      this.fillPlayerData(this.playerData);
    }
  },
  created() {
    this.$store.commit('SET_PLAYER_INFO_UPDATED', false);
    if (!this.validCountries) {
      this.$store.dispatch('getCountries');
    }
  },
};
</script>
