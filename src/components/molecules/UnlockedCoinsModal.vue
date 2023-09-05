<template>
  <modal :opened="opened" name="unlocked-coins-modal" ref="modal" :closeButton="false">
    <div class="unlocked-coins-modal">
      <div class="unlocked-coins-modal-inner">
        <div class="content">
          <h2>Congratulations!</h2>
          <p>Your user profile is now complete and your free coins are ready for use on all games.</p>
          <h3 style="margin-bottom: 0;">Balance</h3>
          <div class="flex">
            <p class="flex" v-if="sweep"><Icon name="gold_coin" :height="25"></Icon><strong>{{ currencyReal.totalBalance }} SC</strong></p>
            <p class="flex"><Icon name="blue_coin" :height="25"></Icon><strong>{{ currencyFun.totalBalance }} WC</strong></p>
          </div>
          <p v-if="sweep" class="small-help"><strong>REMINDER:</strong> Any SC that are won can be redeemed for real prizes at a rate of <strong style="white-space: nowrap;">1 SC = 1 USD</strong></p>
          <div class="small-help" v-if="sweep">
            Switch between WOW Coins and Sweepstakes Coins by using this icon
            <div class="coins">
              <div class="circle circle--orange selected"></div>
              <div class="circle circle--blue"></div>
            </div>
            in the top left of your screen
          </div>
          <p class="small-help">Any questions please <router-link :to="{ name: 'Contact Us' }">Contact Us</router-link></p>
          <Button type="primary" native-type="submit" @click="submitForm">PLAY NOW</Button>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    //
  },
  data() {
    return {
      loading: false,
      opened: true,
    };
  },
  components: {
    Modal,
    Button,
    Icon,
  },
  computed: {
    currencyReal() {
      const balances = this.balance.currencyBalances;
      return balances.find((balance) => balance.currency === 'WOC');
    },
    currencyFun() {
      const balances = this.balance.currencyBalances;
      return balances.find((balance) => balance.currency === 'VBC');
    },
    ...mapGetters(['balance', 'playerData', 'sweep']),
  },
  methods: {
    submitForm() {
      this.opened = false;
    },
  },
};
</script>

<style lang="scss">
.unlocked-coins-modal {
  width: 850px;
  background: linear-gradient(180deg, #4B33DF 0%, #0A052A 100%);
  background-image: url('https://cdn2.wowvegas.com/assets/pop-bg.jpg');
  background-position: center;
  background-size: cover;
  max-height: 70vh;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 0 100px 5px rgb(0, 0, 0, 0.60);

  .vue-tel-input {
    width: 400px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  #app & input.vti__input {
    background: #fff;
    color: #000;
    letter-spacing: 1px;
  }

  img.wow-unlocked-coins-logo {
    width: 150px;
    margin-bottom: 2rem;
  }

  .content {
    font-size: 16px;
    letter-spacing: 1px;
    margin-bottom: 0;
    width: 600px;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }

  .input-group .label {
    font-size: 16px;
    letter-spacing: 1px;
  }

  ul.ticks {
    list-style-type: none;
    display: flex;
    font-size: 11px;
    justify-content: center;
    font-weight: 600;
    padding: 0;
    margin-left: -1rem;
    margin-right: -1rem;
    margin-bottom: 2rem;
    align-items: center;
  }

  ul.ticks .tick {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }

  ul.ticks>li {
    padding-left: .5rem;
    padding-right: 0.5rem;
    display: flex;
    align-items: center;
    text-align: left;
  }

  input.input {
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    color: #000;
  }

  input.input {
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    color: #000;
  }

  .checkbox-label .checkmark {
    position: relative;
    margin-right: 13px;
  }

  label.checkbox-label {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: .6rem 0;
  }

  p.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin: 1rem;
    padding: 1rem;
    background: #b9d8ff1f;
    border-radius: 10px;
  }

  p.flex>.icon {
    margin-right: 10px;
  }
  .error.error--checkbox {
    text-align: center;
    padding: 0;
  }
  .form-help {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 1px;
    width: 600px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }
  .small-help {
    font-size: 13px;
    margin-bottom: 1rem;
  }
  button.button.button--primary {
    margin-top: 1rem;
  }
  .coins {
    display: inline-block;
    margin: 0 6px 0 10px;
    .circle {
      border-radius: 50%;
      width: 15px;
      height: 15px;
      opacity: 0.8;
      display: inline-block;
      transition: transform 0.4s cubic-bezier(.65, 1.95, .03, .32);
      &--blue {
        background: linear-gradient(180deg, #0054FF, #00C7FF);
      }
      &--orange {
        background: linear-gradient(180deg, #FFC758, #FF834D);
      }
      &.selected {
        transform: scale(1.9);
        transition: transform 0.4s cubic-bezier(.65, 1.95, .03, .32);
        transform-origin: center;;
      }
    }
  }
}
.unlocked-coins-modal-inner {
  width: 100%;
}

@media (max-width: 767px) {
  .unlocked-coins-modal{
    max-height: calc(100vh - 4rem);
    padding: 2rem 1rem;
    background-position: top right;

    .content {
      font-size: 13px;
    }
    .vue-tel-input {
      width: 100%;
    }
    #app & input.vti__input {
      min-width: unset;
    }
    p.form-help {
      font-size: 11px;
      line-height: 1.1;
      letter-spacing: .5px;
    }
    ul.ticks {
      flex-direction: column;
    }
    ul.ticks > li {
      margin-bottom: 8px;
    }
    .coins {
      transform: scale(0.7);
      margin-left: 0px;
      margin-right: 0px;
    }
  }
}
</style>
