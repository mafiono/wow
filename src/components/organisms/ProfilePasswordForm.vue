<template>
  <div v-if="playerData">
    <form class="mt-double" @submit.prevent="submitPasswordForm">
      <div class="edit-profile--form">
        <div class="edit-profile--form--col">
          <h4 class="mt-double mb-double">Change password</h4>
          <div class="input-group">
            <form-input v-model="passwordChange.currentPassword" name="Current password" type="password"></form-input>
            <div v-if="passwordFormSubmitted && $v.passwordChange.currentPassword.$error" class="error">
              <span v-if="!$v.passwordChange.currentPassword.required">Current password is required</span>
            </div>
          </div>
          <div class="input-group">
            <form-input v-model="passwordChange.newPassword" name="New password" type="password"></form-input>
            <div v-if="passwordFormSubmitted && $v.passwordChange.newPassword.$error" class="error">
              <span v-if="!$v.passwordChange.newPassword.required">New password is required</span>
              <span v-if="!$v.passwordChange.newPassword.differentPassword">New password can't be the same as current password</span>
            </div>
          </div>
          <div class="input-group">
            <form-input v-model="passwordChange.confirmPassword" name="Confirm password" type="password"></form-input>
            <div v-if="passwordFormSubmitted && $v.passwordChange.confirmPassword.$error" class="error">
              <span v-if="!$v.passwordChange.confirmPassword.required">Confirm password is required</span>
              <span v-else-if="!$v.passwordChange.confirmPassword.samePassword">Passwords have to match</span>
            </div>
          </div>
        </div>
      </div>
      <Button class="mt-single" type="primary" native-type="submit" :loading="passwordFormLoading">Update password</Button>
    </form>
    <div class="sucess-text" v-if="passwordUpdated">
      Your password has been updated successfully.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  data() {
    return {
      showPasswordPopUp: false,
      passwordChange: {
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
      },
      passwordFormLoading: false,
      passwordFormSubmitted: false,
    };
  },
  validations: {
    passwordChange: {
      currentPassword: {
        required,
      },
      newPassword: {
        required,
        differentPassword(value) {
          return value !== this.passwordChange.currentPassword;
        },
      },
      confirmPassword: {
        required,
        samePassword(value) {
          return value === this.passwordChange.newPassword;
        },
      },
    },
  },
  computed: {
    ...mapGetters(['passwordUpdated', 'playerData']),
  },
  components: {
    FormInput,
    Button,
  },
  methods: {
    async submitPasswordForm() {
      this.passwordFormSubmitted = true;
      this.$v.$touch();
      if (!this.$v.passwordChange.$invalid) {
        this.passwordFormLoading = true;
        const payload = {
          oldPassword: this.passwordChange.currentPassword,
          newPassword: this.passwordChange.newPassword,
        };
        await this.$store.dispatch('updatePassword', payload);
        this.passwordFormLoading = false;
      }
    },
  },
  created() {
    this.$store.commit('SET_PASSWORD_UPDATED', false);
  },
};
</script>
