<template>
  <div class="complete-profile">
    <div class="content">
      <Icon name="pencil" :height="50"></Icon>
      <h3 style="margin-top: .5rem;">Almost there...</h3>
      <p v-html="text" style="margin-bottom: 2rem;"></p>
      <div class="edit-profile">
        <form @submit.prevent="submitForm">
          <div class="edit-profile--form">
            <div class="edit-profile--form--col">
              <div class="input-group">
                <form-input v-model="user.firstName" name="First name" type="text"></form-input>
                <div v-if="submitted && $v.user.firstName.$error" class="error">
                  <span v-if="!$v.user.firstName.required">First name is required</span>
                </div>
              </div>
              <div class="input-group">
                <form-input v-model="user.lastName" name="Last name" type="text"></form-input>
                <div v-if="submitted && $v.user.lastName.$error" class="error">
                  <span v-if="!$v.user.lastName.required">Last name is required</span>
                </div>
              </div>
              <div class="input-group">
                <form-input v-model="user.gender" name="Gender" type="gender"></form-input>
                <div v-if="submitted && $v.user.gender.$error" class="error">
                  <span v-if="!$v.user.gender.required">Gender is required</span>
                </div>
              </div>
              <div class="input-group">
                <label class="label"> Mobile number </label>
                <vue-tel-input v-model="mobilePhone" @input="setFormattedPhoneNumber" :preferredCountries="['US']" :disabled="mobilePhoneDisabled"><template v-slot:arrow-icon> <span class="arrow">▼</span> </template></vue-tel-input>
                <div v-if="submitted && $v.user.mobilePhone.$error" class="error">
                  <span v-if="!$v.user.mobilePhone.required">Valid mobile number is required</span>
                </div>
              </div>
            </div>
            <div class="edit-profile--form--col">
              <div class="input-group">
                <form-input v-model="user.address" name="Address" type="text"></form-input>
                <div v-if="submitted && $v.user.address.$error" class="error">
                  <span v-if="!$v.user.address.required">Address is required</span>
                </div>
              </div>
              <div class="input-group">
                <form-input v-model="user.city" name="City" type="text"></form-input>
                <div v-if="submitted && $v.user.city.$error" class="error">
                  <span v-if="!$v.user.city.required">City is required</span>
                </div>
              </div>
              <div class="input-group">
                <form-input v-model="user.postalCode" name="Zip code" type="text"></form-input>
                <div v-if="submitted && $v.user.postalCode.$error" class="error">
                  <span v-if="!$v.user.postalCode.required">Zip code is required</span>
                </div>
              </div>
              <div class="input-group">
                <form-input v-if="validCountries" v-model="user.country" name="Country" type="countrySelect" :whiteList="validCountries"></form-input>
                <div v-if="submitted && $v.user.country.$error" class="error">
                  <span v-if="!$v.user.country.required">Country is required</span>
                </div>
              </div>
              <div class="input-group">
                <form-input v-model="user.province" name="State" type="regionSelect" :countryRegions="user.country" :blackList="blacklistStates"></form-input>
                <div v-if="submitted && $v.user.province.$error" class="error">
                  <span v-if="!$v.user.province.required">State is required</span>
                </div>
              </div>
            </div>
          </div>
          <Button type="primary" native-type="submit" :loading="loading">Proceed</Button>
        </form>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';

const VueTelInput = () => Promise.all([
  import(/* webpackChunkName: "chunk-vue-tel-input" */ 'vue-tel-input'),
  import(/* webpackChunkName: "chunk-vue-tel-input" */ 'vue-tel-input/dist/vue-tel-input.css'),
]).then(([{ VueTelInput }]) => VueTelInput); // eslint-disable-line

export default {
  props: {
    text: String,
  },
  data() {
    return {
      errors: {},
      user: {
        firstName: null,
        lastName: null,
        address: null,
        city: null,
        postalCode: null,
        country: null,
        mobilePhone: null,
        gender: null,
        birthDate: null,
        email: null,
        nickname: null,
        province: null,
      },
      submitted: false,
      loading: false,
      mobilePhone: null,
      mobilePhoneDisabled: false,
    };
  },
  validations: {
    user: {
      firstName: { required },
      lastName: { required },
      address: { required },
      city: { required },
      postalCode: { required },
      country: { required },
      gender: { required },
      mobilePhone: { required },
      province: { required },
    },
  },
  components: {
    Icon,
    FormInput,
    Button,
    VueTelInput,
  },
  computed: {
    ...mapGetters(['playerData', 'validCountries', 'blacklistStates']),
  },
  methods: {
    setFormattedPhoneNumber(inputStr, data) {
      if (data.valid && data.number) {
        this.user.mobilePhone = data.number;
      } else {
        this.user.mobilePhone = inputStr;
      }
    },
    submitForm() {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.completeProfile(this.user);
      }
    },
    async completeProfile(user) {
      this.loading = true;
      const userclone = { ...user };
      // if (this.playerData.mobilePhone) {
      //   userclone.mobilePhone = undefined;
      // }
      await this.$apiToken
        .get('/updatePlayerInfo', {
          params: {
            mobilePhone: 'null',
          },
        });
      const check = await this.$store.dispatch('completeProfile', userclone);
      this.loading = false;
      if (check) {
        this.$emit('signUpCompleted');
      }
    },
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
        this.user.birthDate = playerData.birthDate;
      }
      if (playerData.address) {
        this.user.address = playerData.address;
      }
      if (playerData.gender === 'N') {
        this.user.gender = null;
      }
      if (playerData.mobilePhone) {
        this.mobilePhone = playerData.mobilePhone;
        this.mobilePhoneDisabled = true;
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
    // get countries
    this.$store.dispatch('getCountries');
  },
};
</script>
