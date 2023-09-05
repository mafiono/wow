<template>
  <div class="fullpage-loader">
    <semipolar-spinner />
    <h4 class="loader-text" style="display: none;">
      Loading...
    </h4>
  </div>
</template>

<script>
import SemipolarSpinner from '@/components/atoms/SemipolarSpinner.vue';

export default {
  name: 'Loader',
  props: {
    //
  },
  components: {
    SemipolarSpinner,
  },
};
</script>

<style lang="scss">
.fullpage-loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  z-index: 5;
  z-index: 999;
  flex-direction: column;
}
.page-play .loader-text,
.page-activatesweep .loader-text {
  display: block !important;
}
</style>
