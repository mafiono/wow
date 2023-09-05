<template>
  <!-- Self Exclusion -->
  <div class="self-exclusion">
    <h4>Self Exclusion</h4>
    <p> Below are your options to restrict access to your account.</p>
    <div class="self-exclusion--option">
      <div class="info">
        <p class="title">Permanent Self-Exclusion</p>
        <p>The account will be permanently locked. Please note this option cannot be undone by
          yourself or by anyone at WOW Vegas and may prevent you from opening other accounts in the future.</p>
      </div>
      <div>
        <Button type="primary" @click="showLockPopUp = true;" expanded>Permanent Lock</Button>
      </div>
    </div>
    <div class="self-exclusion--option">
      <div class="info">
        <p class="title">Limited Timeout</p>
        <p>The account will be locked until a specific date. If you choose this option, you will need to choose an appropriate date on which you
          would like to return to the casino. Please note that once set this cannot be changed by yourself or anyone at WOW Vegas.</p>
      </div>
      <div>
        <Button type="primary" @click="showChooseDate = true;" expanded>Timeout</Button>
      </div>
    </div>
    <choose-date-pop-up
      v-if="showChooseDate"
      @confirmed="acceptedTimeout($event)"
      @cancelled="showChooseDate = false">
    </choose-date-pop-up>
    <pop-up
      v-if="showLockPopUp"
      title="Permanent Self-Exclusion"
      acceptLabel="Confirm"
      @accepted="acceptedLock"
      @cancelled="showLockPopUp = false">
      <template v-slot:message>
        <p>Your account will be permanently locked. This cannot be underdone.</p>
      </template>
    </pop-up>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';
import ChooseDatePopUp from '@/components/molecules/ChooseDatePopUp.vue';
import PopUp from '@/components/molecules/PopUp.vue';

export default {
  data() {
    return {
      showChooseDate: false,
      showLockPopUp: false,
    };
  },
  components: {
    Button,
    ChooseDatePopUp,
    PopUp,
  },
  methods: {
    acceptedTimeout(days) {
      this.showChooseDate = false;
      this.$store.dispatch('timeoutPlayer', days);
    },
    acceptedLock() {
      this.showLockPopUp = false;
      this.$store.dispatch('permanentLock');
    },
  },
};
</script>
