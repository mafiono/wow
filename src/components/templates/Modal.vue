<template>
  <transition name="fadequick" mode="out-in">
    <div class="modal" v-if="showModal || opened">
      <div class="modal-wrapper">
        <button v-if="closeButton" class="btn" @click="closeModal">
          <Icon name="close"></Icon>
        </button>
        <div class="container">
          <div class="section">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import EventBus from '@/helpers/EventBus';
import Icon from '@/components/atoms/Icon.vue';

export default {
  props: {
    name: String,
    closeButton: {
      type: Boolean,
      default: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  components: {
    Icon,
  },
  methods: {
    toggleModal() {
      EventBus.$emit('no-scroll');
      this.showModal = !this.showModal;
    },
    closeModal() {
      this.showModal = false;
      EventBus.$emit('remove-no-scroll');
      this.$emit('closed');
    },
  },
  created() {
    if (this.opened) {
      EventBus.$emit('add-no-scroll');
    }
    EventBus.$on('toggle-modal', (name) => {
      if (name === this.name) {
        this.toggleModal();
      }
    });
    EventBus.$on('close-modal', (name) => {
      if (name === this.name) {
        this.showModal = false;
        EventBus.$emit('remove-no-scroll');
      }
    });
    EventBus.$on('open-modal', (name) => {
      if (name === this.name) {
        this.showModal = true;
        EventBus.$emit('add-no-scroll');
      }
    });
  },
  beforeDestroy() {
    EventBus.$emit('remove-no-scroll');
  },
};
</script>
