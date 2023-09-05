<template>
  <modal name="rotate-device" ref="modal" :closeButton="false">
    <div class="rotate-device">
      <h3 class="title">Rotate your device</h3>
      <p>This game is for {{ orientation.toLowerCase() }} mode only.</p>
      <Icon name="rotation" :width="150" :height="150"></Icon>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import Icon from '@/components/atoms/Icon.vue';

export default {
  props: {
    orientation: String,
  },
  data() {
    return {
      accepted: false,
      showTickbox: false,
    };
  },
  components: {
    Modal,
    Icon,
  },
};
</script>
