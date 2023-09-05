<template>
  <div class="container error-page">
    <div class="message">
      <h1 class="extra">404</h1>
      <p>Looks like the page you are looking for does not exist or is no longer accessible…</p>
      <Button type="primary" tag="router-link" to="/lobby">Back to lobby</Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';

export default {
  components: {
    Button,
  },
};
</script>