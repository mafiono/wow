<template>
  <div class="container error-page">
    <div class="message">
      <div class="logo"><router-link to="/"><Icon name="logo2" :height="50"></Icon></router-link></div><br/>
      <h3>WOW Vegas is currently down for maintenance.</h3>
      <p>We expect to be back soon. Thanks for your patience.</p>
    </div>
  </div>
</template>

<script>
import Icon from '../../components/atoms/Icon.vue';

export default {
  components: {
    Icon,
  },
};
</script>
