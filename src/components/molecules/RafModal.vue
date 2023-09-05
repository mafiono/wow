<template>
  <modal :opened="rafModalOpened" @closed="closed" name="raf-modal" ref="modal" :closeButton="true">
    <div class="raf-modal">
      <div class="raf-modal-inner">
        <div class="content">
          <template v-if="playerData">
            <img src="https://cdn2.wowvegas.com/assets/raf-logo.png" alt="Refer a Friend" class="raf-logo" />
            <p class="lead">Receive <strong>5,000 WOW Coins</strong> and <strong>20SC</strong> free for each referral, up to 30 qualifying friends*</p>
            <div class="raf-results">
              <div>
                <img src="https://cdn2.wowvegas.com/assets/raf-i1.png" alt="" class="raf-i" />
                <p class="raf-results-label">Friends invited:</p>
                <p class="raf-results-value">{{ myRafData.reg }}</p>
              </div>
              <div>
                <img src="https://cdn2.wowvegas.com/assets/raf-i2.png" alt="" class="raf-i" />
                <p class="raf-results-label">Friends qualified:</p>
                <p class="raf-results-value">{{ myRafData.cpa }}</p>
              </div>
              <div>
                <img src="https://cdn2.wowvegas.com/assets/raf-i3.png" alt="" class="raf-i" />
                <p class="raf-results-label">Rewards earned:</p>
                <p class="raf-results-value">SC{{ myRafData.credited }}</p>
              </div>
            </div>
            <div class="input-group input-group--copy-input">
              <div>
                <label class="label">Your WOW Vegas URL:</label>
                <div class="flexx">
                  <input v-on:focus="$event.target.select()" ref="clone" type="text" name="First name" readonly="readonly" disabled="disabled" class="input" :value="rafUrl" />
                  <Button type="primary" @click="copy">Copy</Button>
                </div>
              </div>
            </div>
            <p class="raf-disc">*Friends qualify by signing up with your referral link, purchasing Gold Coin packages worth $15 in total and not with an existing account with WOW Vegas. <router-link :to="{ name: 'Sweepstakes Rules' }">Terms and Conditions apply</router-link>.</p>
            <FormInput name="Don't show it again" type="checkbox" v-model="dontshowitagain" expanded></FormInput>
          </template>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    //
  },
  data() {
    return {
      loading: false,
      rafModalOpened: true,
      dontshowitagain: false,
      rafData: false,
    };
  },
  components: {
    Modal,
    FormInput,
    Button,
    // Icon,
  },
  computed: {
    ...mapGetters(['playerData']),
    rafUrl() {
      return `https://www.wowvegas.com/?raf=${this.playerData.partyId}`;
    },
    getRafEntryUrl() {
      return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'wp-json/raf/v1/entry');
    },
    myRafData() {
      if (!this.playerData || !this.rafData) {
        return {
          cpa: 0,
          reg: 0,
          credited: 0,
        };
      }
      return this.rafData;
    },
  },
  methods: {
    closed() {
      this.rafModalOpened = false;
      this.$cookies.set('swraf', true, '10d');
    },
    fillPlayerData(playerData) {
      if (playerData && playerData.mobilePhone) {
        this.mobilePhoneStr = playerData.mobilePhone;
      }
    },
    copy() {
      this.$noty.error('Your WOW Vegas URL has been copied to the clipboard!');
      this.$refs.clone.select();
      this.$refs.clone.setSelectionRange(0, 99999); // For mobile devices
      navigator.clipboard.writeText(this.$refs.clone.value);
    },
    async getRafEntry() {
      if (!this.playerData) {
        return;
      }
      await this.$http(`${this.getRafEntryUrl}`, {
        params: {
          party_id: this.playerData.partyId,
        },
      })
        .then((response) => {
          this.rafData = response.data.result;
        });
    },
  },
  watch: {
    // playerData is not ready when mounted (when user enters page directly from url)
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.fillPlayerData(playerDataReady);
        this.getRafEntry();
      }
    },
    dontshowitagain(value) {
      if (value) {
        this.rafModalOpened = false;
        this.$store.dispatch('updateExtraInfo', { raf: false });
        this.$cookies.set('swraf', true, '365d');
      }
    },
  },
  created() {
    this.getRafEntry();
  },
  mounted() {
    if (this.playerData) {
      this.fillPlayerData(this.playerData);
    }
  },
};
</script>

<style lang="scss">
.raf-modal {
  width: 850px;
  background: linear-gradient(180deg, #4B33DF 0%, #0A052A 100%);
  background-image: url('https://cdn2.wowvegas.com/assets/raf-bg.jpg');
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

  img.raf-logo {
    margin-right: -50px;
    width: 200px;
    margin-bottom: 1.5rem;
  }
  .input {
    width: 100%;
  }
  .flexx {
    display: flex;
  }
  .raf-results {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    margin: 2rem 0;
  }
  .raf-results>div {
    background: linear-gradient(180deg, #F7B32C 0%, #FB5F1B 100%);
    border: 3px solid #FFFFFF;
    border-radius: 8px;
    text-align: center;
    padding: 1.5rem;
  }
  p.raf-results-value {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 1.6rem;
  }
  p.raf-disc {
    font-size: 12px;
    color: #fff;
  }
  img.raf-i {
    width: 49px;
  }
  p.raf-results-label {
    margin-top: .5rem;
    margin-bottom: 0.2rem !important;
  }

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

  img.wow-raf-logo {
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
    background: #111118;
    color: #fff;
    border: 2px solid #fff;
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

  .flexx button.button.button--primary {
    border: 2px solid #fff;
    border-left: 0 !important;
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
    color: rgba(255, 255, 255, 1);
    letter-spacing: 1px;
    width: 600px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }
  label.checkbox-label {
    margin-bottom: 0 !important;
  }
  .content {
    margin-bottom: 0;
  }
}
.raf-modal-inner {
  width: 100%;
}

@media (max-width: 767px) {
  .raf-modal{
    max-height: calc(100vh - 4rem);
    padding: 2rem 1rem;
    background-position: top right;

    img.raf-logo {
      margin-right: -40px;
      width: 150px;
      margin-bottom: 1rem;
    }
    .raf-results > div {
      padding: 01rem 0.5rem;
      font-size: 12px;
    }
    p.raf-results-label {
      white-space: nowrap;
      margin-bottom: .6rem;
    }
    .flexx {
      flex-wrap: wrap;
    }
    .flexx button.button.button--primary {
      width: 100%;
      padding: 10px;
      border-left: 2px solid #fff !important;
      border-top: 0 !important;
    }
    input.input {
      padding-left: .5rem;
      padding-right: 0.5rem;
    }
    p.raf-results-value {
      font-size: 1.3rem;
      line-height: 1;
    }

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
    p.raf-results-label {
      font-size: 8px;
    }
    .raf-results {
      margin: 1rem 0;
    }
  }
}
</style>
