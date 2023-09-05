<template>
  <modal name="cashier-modal" ref="modal" :closeButton="true">
    <div class="cashier-modal">
      <iframe :src="iframeUrl" class="cashier-iframe"></iframe>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';

export default {
  props: {
    iframeUrl: String,
  },
  data() {
    return {
      //
    };
  },
  components: {
    Modal,
  },
};
</script>

<style lang="scss">
.cashier-modal {
  width: 600px;
  background: #fff;
  height: 760px;
  max-height: 70vh;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  padding-top: 1rem;
}

.cashier-iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  border: 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

@media (max-width: 767px) {
  .cashier-modal {
    max-height: calc(100vh - 4rem);
    padding-top: 0;
    height: 1000px;
    border-radius: 0;
  }
  .cashier-modal-c {
    .container {
      padding-left: 0;
      padding-right: 0;
    }
    .section {
      margin: 0 !important;
    }
    .modal-wrapper {
      align-items: flex-end;
    }
  }
}
</style>
