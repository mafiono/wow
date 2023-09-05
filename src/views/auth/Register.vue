<template>
    <div class="triple-section auth-form">
      <div class="triple-section--top">
        <router-link to="/"><Icon name="logo" :height="65"></Icon></router-link>
      </div>
      <div class="triple-section--middle container">
        <div class="input-group">
          <form-input name="Username" v-model="user.username" isWhite expanded></form-input>
          <div v-if="submitted && $v.user.username.$error" class="error">
            <span v-if="!$v.user.username.required">Username is required</span>
            <span v-if="!$v.user.username.lengthEmail">Username length has to be between 5 and 50 characters.</span>
          </div>
        </div>
        <div class="input-group">
          <form-input name="Email" v-model="user.email" type="email" isWhite expanded></form-input>
          <div v-if="submitted && $v.user.email.$error" class="error">
            <span v-if="!$v.user.email.required">Email is required</span>
            <span v-if="!$v.user.email.email">Email is invalid</span>
          </div>
        </div>
        <div class="input-group">
          <form-input name="Password" v-model="user.password" type="password" isWhite expanded></form-input>
          <div v-if="submitted && $v.user.password.$error" class="error">
            <span v-if="!$v.user.password.required">Password is required</span>
            <span v-else-if="!$v.user.password.length">Password must be between 6 and 32 characters</span>
            <span v-else-if="!$v.user.password.strongPassword">Password can't be all numbers or letters</span>
          </div>
        </div>
        <div class="input-group">
          <form-input name="Date of birth" type="date" v-model="user.date" expanded isWhite initial-view="year"></form-input>
          <div v-if="submitted && $v.user.date.$error" class="error">
            <span v-if="!$v.user.date.required">DOB is required</span>
            <span v-if="!$v.user.date.isOverEighteen">User must be over 18</span>
          </div>
        </div>
        <div class="margin-block">
          <div class="checkbox-group">
            <FormInput :name="tctext" type="checkbox" v-model="temsAccepted" expanded></FormInput>
            <div v-if="submitted && $v.temsAccepted.$error" class="error error--checkbox">
              <span>You need to accept the terms above</span>
            </div>
            <FormInput name="Receive promotional emails" type="checkbox" v-model="receivePromotions" expanded></FormInput>
          </div>
        </div>
        <div><Button type="primary" @click="handleSignUp" :width="370" expanded :loading="loading" :disabled="disabled">Sign up</Button></div>
      </div>
      <div class="triple-section--bottom">
        <router-link to="/login">Already a member? Log in!</router-link>
        <div class="need-help">NEED HELP? Contact us <router-link to="/contact-us">HERE</router-link> 24/7</div>
      </div>
    </div>
  </template>
  
  <script>
  import Icon from '@/components/atoms/Icon.vue';
  import Button from '@/components/atoms/Button.vue';
  import { required, email, sameAs } from 'vuelidate/lib/validators';
  import FormInput from '@/components/atoms/FormInput.vue';
  import format from 'date-fns/format';
  
  export default {
    data() {
      return {
        tctext: 'I confirm the following: I am at least 18 years old; I am not resident in the state of Washington, Nevada or Idaho; I accept the <a href="/terms-and-conditions">Terms and Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.',
        loading: false,
        submitted: false,
        // Data
        user: {
          username: null,
          email: null,
          password: null,
          date: null,
        },
        receivePromotions: false,
        referralId: null,
        temsAccepted: false,
        registerAsSweep: false,
        gclid: this.$cookies.get('gclid') ?? 'null',
        btag: this.$cookies.get('affx'),
      };
    },
    validations: {
      temsAccepted: {
        sameAs: sameAs(() => true),
      },
      user: {
        username: {
          required,
          // username must have between 8 and 50 characters
          lengthEmail(value) {
            if (value) {
              return (value.length >= 5 && value.length <= 50);
            }
            return true;
          },
        },
        email: {
          required,
          email,
        },
        password: {
          required,
          // password must have between 8 and 32 characters
          length(value) {
            if (value) {
              return (value.length >= 6 && value.length <= 32);
            }
            return true;
          },
          strongPassword(value) {
            return (/[a-z]/.test(value) && /[0-9]/.test(value));
          },
        },
        date: {
          required,
          isOverEighteen(value) {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age -= 1;
            }
            return age >= 18;
          },
        },
      },
    },
    components: {
      Icon,
      Button,
      FormInput,
    },
    computed: {
      checkIfSignupWithSweepURL() {
        return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'signup/');
      },
      disabled() {
        if (this.user.email && this.user.username && this.user.password && this.user.date) {
          return false;
        }
        return true;
      },
      sweepOrNot() {
        if (this.registerAsSweep) {
          return 'SP';
        }
        return 'EN';
      },
      termsAndConditionsConsentVersion() {
        const consentVersion = this.$store.getters.consents?.find((consent) => consent.key === 'TERMS_AND_CONDITIONS');
        return consentVersion;
      },
      mandatoryConsentVersion() {
        const consentVersion = this.$store.getters.consents?.find((consent) => consent.key === 'MANDATORY');
        return consentVersion;
      },
    },
    async mounted() {
      this.$store.dispatch('enableLoader');
      this.$store.dispatch('getConsents');
      this.$store.dispatch('getCountryInfo');
      await this.$http(`${this.checkIfSignupWithSweepURL}?signup=1`)
        .then((response) => {
          if (response.data.status === 1) {
            this.registerAsSweep = true;
          }
        });
      this.$store.dispatch('disableLoader');
    },
    methods: {
      handleSignUp() {
        this.submitted = true;
        this.$v.$touch();
        // If form is valid
        if (!this.$v.$invalid) {
          // Dispatch register action
          this.signupUser(this.user.email, this.user.username, this.user.password, this.user.date, this.receivePromotions, this.referralId);
        }
      },
      async signupUser(userEmail, userName, userPassword, date, promotions, referralId) {
        const whitelistedEmails = [
          'thefreelancenet@gmail.com',
          'kfilip@metawin.inc',
        ];
        this.loading = true;
        const router = this.$router;
        const dateFormatted = format(date, 'yyyy-MM-dd');
        const user = {
          email: userEmail,
          username: userName,
          password: userPassword,
          currency: 'WOC',
          secondaryCurrencies: 'VBC',
          receiveEmail: promotions,
          birthDate: dateFormatted,
          referralId,
          userTrackingCodes: {
            PCID: this.gclid,
          },
          // langCode: this.sweepOrNot,
        };
        if (this.mandatoryConsentVersion?.consentVersionId) {
          user.consentedVersions = this.mandatoryConsentVersion.consentVersionId;
        }
        if (this.btag) {
          user.userTrackingCodes.btag = this.btag;
        }
        if (userEmail && whitelistedEmails.includes(userEmail)) {
          user.extraInfo = '{"registeredAsSweep":"1"}';
        }
        if (this.registerAsSweep) {
          user.extraInfo = '{"registeredAsSweep":"1"}';
        }
        await this.$store.dispatch('register', { user, router });
        this.loading = false;
      },
    },
  };
  </script>
  