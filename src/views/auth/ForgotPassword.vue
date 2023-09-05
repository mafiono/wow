<template>
    <div class="triple-section auth-form">
      <div class="triple-section--top">
        <router-link to="/"><Icon name="logo" :height="65"></Icon></router-link>
      </div>
      <div class="triple-section--middle container">
        <form v-if="enterEmail" @submit.prevent="resetPasswordEmail()">
          <div v-if="emailSent" class="email-sent">
            <Icon name="check"></Icon>
            <h5>Email sent</h5>
            <div class="sucess-message">
              If the information provided is correct, a confirmation email will be sent to the registered email address.
            </div>
          </div>
          <div v-else>
            <p>Forgotten password?</p>
            <div class="input-group">
              <form-input
                name="Email"
                v-model="formEmail"
                isWhite
                expanded
              ></form-input>
              <div v-if="submitted && $v.formEmail.$error" class="error">
                <span v-if="!$v.formEmail.required">Email is required</span>
                <span v-if="!$v.formEmail.email">Email is invalid</span>
              </div>
            </div>
            <div>
              <Button type="primary" native-type="submit" :width="370" expanded :loading="loading">Get new password</Button>
            </div>
          </div>
        </form>
        <form v-else @submit.prevent="changePassword()">
          <!-- Password has been updated -->
          <div v-if="passwordChanged" class="email-sent">
            <Icon name="check"></Icon>
            <h5>Password changed succesfully</h5>
            <Button tag="router-link" to="/login" type="primary">Login</Button>
          </div>
          <!-- Show form to change password -->
          <div v-else>
            <div v-if="codeChecked === false" class="email-sent">
              <Icon name="cross"></Icon>
              <h5>Invalid code</h5>
              <div class="sucess-message">
                The confirmation code is invalid or expired. You will need a valid code to change the password.
              </div>
            </div>
            <template v-else-if="codeChecked">
              <div class="input-group">
                <form-input name="New password" type="password" isWhite v-model="formNewPassword" expanded></form-input>
                <div v-if="submitted && $v.formNewPassword.$error" class="error">
                  <span v-if="!$v.formNewPassword.required">Password is required</span>
                  <span v-else-if="!$v.formNewPassword.length">Password must be between 6 and 32 characters</span>
                  <span v-else-if="!$v.formNewPassword.strongPassword">Password can't be all numbers or letters</span>
                </div>
              </div>
              <div class="input-group">
                <form-input name="Confirm password" type="password" isWhite v-model="formConfirmPassword" expanded></form-input>
                <div v-if="submitted && $v.formConfirmPassword.$error" class="error">
                  <span v-if="!$v.formConfirmPassword.required">Confirm password is required</span>
                  <span v-else-if="!$v.formConfirmPassword.samePassword">Password must match</span>
                </div>
              </div>
              <Button type="primary" :width="350" native-type="submit" expanded :loading="loading">Reset password</Button>
            </template>
          </div>
        </form>
      </div>
      <div class="triple-section--bottom">
        <router-link to="/register">Don’t have an account? Sign up!</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import Icon from '@/components/atoms/Icon.vue';
  import Button from '@/components/atoms/Button.vue';
  import FormInput from '@/components/atoms/FormInput.vue';
  import { required, email } from 'vuelidate/lib/validators';
  import { mapGetters } from 'vuex';
  
  export default {
    data() {
      return {
        formEmail: '',
        formNewPassword: '',
        formConfirmPassword: '',
        loading: false,
        submitted: false,
        enterEmail: null,
        linkEmail: '',
        linkCode: '',
      };
    },
    validations: {
      formEmail: { required, email },
      formNewPassword: {
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
      formConfirmPassword: {
        required,
        samePassword(value) {
          return value === this.formNewPassword;
        },
      },
    },
    computed: {
      ...mapGetters(['emailSent', 'passwordChanged', 'codeChecked']),
    },
    components: {
      Icon,
      Button,
      FormInput,
    },
    methods: {
      async resetPasswordEmail() {
        this.submitted = true;
        this.$v.$touch();
        if (!this.$v.formEmail.$invalid) {
          this.loading = true;
          await this.$store.dispatch('sendEmailToResetPassword', { email: this.formEmail });
          this.loading = false;
        }
      },
      async changePassword() {
        this.submitted = true;
        this.$v.$touch();
        if (!this.$v.formNewPassword.$invalid && !this.$v.formConfirmPassword.$invalid) {
          this.loading = true;
          await this.$store.dispatch('resetPassword',
            {
              email: this.linkEmail,
              resetKey: this.linkCode,
              newPassword: this.formNewPassword,
            });
          this.loading = false;
        }
      },
    },
    created() {
      // Reset
      this.$store.commit('SET_PASSWORD_CHANGED', false);
      this.$store.commit('SET_CODE_CHECKED', null);
      this.$store.commit('SET_RESET_EMAIL_SENT', false);
  
      // Get link code and email from url
      this.linkCode = this.$route.query.confirmationCode;
      this.linkEmail = this.$route.query.email;
      if (this.linkCode && this.linkEmail) {
        this.enterEmail = false;
        this.$store.dispatch('checkResetKey',
          {
            email: this.linkEmail,
            resetKey: this.linkCode,
          });
      } else {
        this.enterEmail = true;
      }
    },
  };
  </script>
  