<template>
    <modal name="select-mode" ref="modal">
      <div class="select-mode">
        <h3 class="title">SELECT COIN MODE</h3>
          <div class="select-mode-flex">
            <div class="single-mode">
              <icon name="gold_coin_big"></icon>
              <h3>Real Play</h3>
              <p>Sweepstakes Coins can be used to play for real cash and prizes. Winnings made with Sweepstakes Coins can be redeemed.</p>
              <Button type="secondary" @click="changePlayMode('REAL')">Play for real</Button>
            </div>
            <div class="single-mode">
              <icon name="blue_coin_big"></icon>
              <h3>Fun Play</h3>
              <p>Wow Coins are made for fun play, you won't be able to redeem your wins.</p>
              <Button type="primary" @click="changePlayMode('FUN')">Play for fun</Button>
            </div>
          </div>
        <div class="remember-me" v-if="showTickbox">
          <form-input
            name="Remember my choice"
            type="checkbox" v-model="accepted" expanded>
          </form-input>
        </div>
      </div>
    </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import EventBus from '@/helpers/EventBus';

export default {
  data() {
    return {
      accepted: false,
      showTickbox: false,
    };
  },
  components: {
    Modal,
    Button,
    Icon,
    FormInput,
  },
  methods: {
    changePlayMode(mode) {
      this.$refs.modal.toggleModal();
      const payload = {
        mode,
        remember: this.accepted,
      };
      this.$store.dispatch('changePlayMode', payload);
    },
  },
  created() {
    EventBus.$on('toggle-modal', (name, tickbox) => {
      this.showTickbox = tickbox;
    });
  },
};
</script>
