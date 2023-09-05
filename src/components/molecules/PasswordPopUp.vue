<template>
  <div class="pop-up-wrapper">
    <div class="pop-up pop-up--password" :style="{ width: `${width}px` }">
      <h5>Enter password to make changes</h5>
      <slot name="message"></slot>
      <div class="input-group">
        <form-input v-model="password" name="Password" type="password"></form-input>
      </div>
      <p v-if="passwordChecked == false" class="mt-single">Incorrect password</p>
      <div class="options">
        <Button type="primary" @click="checkPassword" :loading="loading">Proceed</Button>
        <Button type="secondary" @click="$emit('cancelled')">Cancel</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    title: String,
    acceptLabel: {
      String,
      default: 'Accept',
    },
  },
  data() {
    return {
      password: null,
      loading: false,
      width: 550,
    };
  },
  computed: {
    ...mapGetters(['playerData', 'passwordChecked']),
  },
  components: {
    Button,
    FormInput,
  },
  methods: {
    async checkPassword() {
      const payload = {
        username: this.playerData.email,
        password: this.password,
      };
      this.loading = true;
      await this.$store.dispatch('checkPassword', payload);
      this.loading = false;
      if (this.passwordChecked) {
        this.$emit('accepted');
      }
    },
  },
  created() {
    this.$store.commit('SET_PASSWORD_CHECKED', null);
  },
};
</script>
