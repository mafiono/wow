<template>
  <div class="pop-up-wrapper">
    <div class="pop-up" :class="{'pop-up--tAndC': termsAndConditions}">
      <h5>{{ title }}</h5>
      <slot name="message"></slot>
      <div class="options">
        <Button v-if="!termsAndConditions" type="primary" @click="$emit('accepted')">{{ acceptLabel }}</Button>
        <Button type="secondary" @click="$emit('cancelled')">{{ closeLabel }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';

export default {
  props: {
    title: String,
    acceptLabel: {
      String,
      default: 'Accept',
    },
    closeLabel: {
      String,
      default: 'Cancel',
    },
    termsAndConditions: {
      Boolean,
      default: false,
    },
  },
  components: {
    Button,
  },
};
</script>
