<template>
  <modal
    :opened="opened"
    name="sweep-modal" ref="modal" :closeButton="false">
    <div class="sweep-modal">
      <div class="sweep-modal-inner">
        <div class="content" style="margin-bottom: 0;">
          <h3>Welcome Back to WOW Vegas!</h3>
          <p><strong>🎉 Special Offer Just for You! 🎉</strong></p>
          <p>Unlock your account now to claim your <strong>free coins</strong>:</p>
          <div class="coinflexx-c">
            <div class="coinflexx"><Icon name="gold_coin" :height="25"></Icon> {{ scAmount }} SC</div>
            <div class="coinflexx"><Icon name="blue_coin" :height="25"></Icon> {{ wowAmount }} WOW Coins</div>
          </div>
          <Button type="primary" :loading="loading" @click="claimBonus(reopenBonusCode)" style="width: auto; white-space: nowrap; margin-bottom: 1rem;">🔓 Unlock & Claim</Button>
          <div style="font-size: 13px">
            <p>Enjoy your favorite games with these bonus rewards. Thank you for choosing WOW Vegas!</p>
            <p><a href="#" style="color: #c91919" @click.prevent="keepLocked">I'm not interested, keep my account closed</a></p>
          </div>
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

// SC ->  WOW ->  Bonus ID WOC ->  Bonus ID VBC ->  Bonus CODE for link
// 5 ->  312,500 ->  1095 ->  1094 ->  5REOP3A
// 10 ->  625,000 ->  1097 ->  1096 ->  10REOP3A
// 25 ->  1,875,000 ->  1099 ->  1098 ->  25REOP3A
// 50 ->  3,750,000 ->  1101 ->  1100 ->  50REOP3A
// 75 ->  5,000,000 ->  1103 ->  1102 ->  75REOP3A
// 100 ->  6,250,000 ->  1105 ->  1104 ->  100REOP3A
// 200 ->  12,500,000 ->  1107 ->  1106 ->  200REOP3A
// 300 ->  18,750,000 ->  1109 ->  1108 ->  300REOP3A
// 400 ->  25,000,000 ->  1111 ->  1110 ->  400REOP3A
// 500 ->  31,500,000 ->  1113 ->  1112 ->  500REOP3A

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
    ...mapGetters(['playerData', 'reopenBonusCode']),
    scAmount() {
      if (this.reopenBonusCode === '5REOP3A') {
        return 5;
      } if (this.reopenBonusCode === '10REOP3A') {
        return 10;
      } if (this.reopenBonusCode === '25REOP3A') {
        return 25;
      } if (this.reopenBonusCode === '50REOP3A') {
        return 50;
      } if (this.reopenBonusCode === '75REOP3A') {
        return 75;
      } if (this.reopenBonusCode === '100REOP3A') {
        return 100;
      } if (this.reopenBonusCode === '200REOP3A') {
        return 200;
      } if (this.reopenBonusCode === '300REOP3A') {
        return 300;
      } if (this.reopenBonusCode === '400REOP3A') {
        return 400;
      } if (this.reopenBonusCode === '500REOP3A') {
        return 500;
      }
      return 0;
    },
    wowAmount() {
      if (this.reopenBonusCode === '5REOP3A') {
        return '312,500';
      } if (this.reopenBonusCode === '10REOP3A') {
        return '625,000';
      } if (this.reopenBonusCode === '25REOP3A') {
        return '1,875,000';
      } if (this.reopenBonusCode === '50REOP3A') {
        return '3,750,000';
      } if (this.reopenBonusCode === '75REOP3A') {
        return '5,000,000';
      } if (this.reopenBonusCode === '100REOP3A') {
        return '6,250,000';
      } if (this.reopenBonusCode === '200REOP3A') {
        return '12,500,000';
      } if (this.reopenBonusCode === '300REOP3A') {
        return '18,750,000';
      } if (this.reopenBonusCode === '400REOP3A') {
        return '25,000,000';
      } if (this.reopenBonusCode === '500REOP3A') {
        return '31,500,000';
      }
      return 0;
    },
  },
  methods: {
    async keepLocked() {
      await this.$store.dispatch('permanentLock');
      this.opened = false;
    },
    async claimBonus(bonusCode) {
      const validBonuses = ['5REOP3A', '10REOP3A', '25REOP3A', '50REOP3A', '75REOP3A', '100REOP3A', '200REOP3A', '300REOP3A', '400REOP3A', '500REOP3A'];
      if (!validBonuses.includes(bonusCode)) {
        this.$noty.error('There was an error. Please try again later or contact support.');
        return;
      }
      this.loading = true;
      this.$store.dispatch('enableLoader');
      await this.$apiToken
        .get('/redeemBonus', {
          params: {
            bonusCode,
          },
        })
        .then(async (response) => {
          if (response.data.status === 'SUCCESS') {
            this.$store.dispatch('getBalance');
            if (bonusCode === '5REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '25REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 25 and 1,875,000 WOW Coins to your account.');
            } else if (bonusCode === '50REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '75REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 75 and 5,000,000 WOW Coins to your account.');
            } else if (bonusCode === '100REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 100 and 6,250,000 WOW Coins to your account.');
            } else if (bonusCode === '200REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 200 and 12,500,000 WOW Coins to your account.');
            } else if (bonusCode === '300REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 300 and 18,750,000 WOW Coins to your account.');
            } else if (bonusCode === '400REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 400 and 25,000,000 WOW Coins to your account.');
            } else if (bonusCode === '500REOP3A') {
              this.$noty.error('Welcome Back! We just added SC 500 and 31,500,000 WOW Coins to your account.');
            }
          } else {
            this.$noty.error('There was an error crediting your account. Please contact support.');
          }
        })
        .catch((error) => {
          this.$noty.error(error.message);
        })
        .finally(async () => {
          this.$store.dispatch('disableLoader');
          this.loading = false;
          this.opened = false;
          await this.$store.dispatch('updateExtraInfo', { acceptedUnlock: true, acceptedUnlockDateTime: new Date() });
          localStorage.setItem('acceptedUnlock', 1);
        });
    },
  },
  watch: {
    //
  },
  mounted() {
    //
  },
};
</script>

<style lang="scss">
.sweep-modal {
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

  #app & .vti__dropdown {
    border-right: 2px solid rgb(0 0 0 / 22%);
    background: #ffffff;
    color: #2c2c2c;
    font-size: 12px;
  }

  #app & .vti__dropdown-list {
    background-color: #ffffff;
  }

  #app & .vti__dropdown-item.highlighted {
    background-color: rgb(177 212 255);
  }

  img.wow-sweep-logo {
    width: 150px;
    margin-bottom: 2rem;
  }

  .content {
    font-size: 16px;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    width: 700px;
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

  p.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
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
}

.sweep-modal-inner {
  width: 100%;
}

.coinflexx {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    gap: 10px;
    margin-bottom: .5rem;
}

.coinflexx-c {
    margin-bottom: 1rem;
}

@media (max-width: 767px) {
  .sweep-modal {
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

    ul.ticks>li {
      margin-bottom: 8px;
    }
  }
}
</style>
