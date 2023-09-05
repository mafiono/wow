<template>
    <div class="triple-section auth-form">
      <div class="triple-section--top">
        <router-link to="/"><Icon name="logo" :height="65"></Icon></router-link>
      </div>
      <div class="triple-section--middle container">
        <div class="input-group">
          <form-input name="Username or Email" v-model="user.username" isWhite expanded></form-input>
          <div v-if="submitted && $v.user.username.$error" class="error">
            <span v-if="!$v.user.username.required">Username is required</span>
          </div>
        </div>
        <div class="input-group">
          <form-input name="Password" v-model="user.password" type="password" isWhite expanded></form-input>
          <div v-if="submitted && $v.user.password.$error" class="error">
            <span v-if="!$v.user.password.required">Password is required</span>
          </div>
        </div>
        <div><Button type="primary" :width="370" expanded @click="handleLogin" :loading="loading">Log In</Button></div>
        <router-link to="/forgot-password">Forgot password?</router-link>
      </div>
      <div class="triple-section--bottom">
        <router-link to="/register">Don’t have an account? Sign up!</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import Icon from '@/components/atoms/Icon.vue';
  import Button from '@/components/atoms/Button.vue';
  import { required } from 'vuelidate/lib/validators';
  import FormInput from '@/components/atoms/FormInput.vue';
  
  export default {
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
        loading: false,
        submitted: false,
      };
    },
    validations: {
      user: {
        username: { required },
        password: { required },
      },
    },
    components: {
      Icon,
      Button,
      FormInput,
    },
    methods: {
      handleLogin() {
        this.submitted = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.loginUser(this.user.username, this.user.password);
        }
      },
      async loginUser(user, password) {
        const router = this.$router;
        this.loading = true;
        await this.$store.dispatch('login', {
          user, password, router, redirect: this.$route.query.redirect,
        });
        this.loading = false;
      },
    },
  };
  </script>
  