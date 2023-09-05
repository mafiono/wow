<template>
  <modal :opened="(mobileNeedsVerification && $route.meta.requiresAuth === 'yes')" name="phone-modal" ref="modal" :closeButton="false">
    <div class="phone-modal">
      <div v-if="start" class="phone-modal-inner">
        <div class="content">
          <img src="@/assets/wow-sweepstakes.png" alt="" class="wow-sweep-logo" />
          <p>Verify your cell phone number to secure your account. Play and win big with Sweepstakes Coins (SC).</p>
        </div>
        <form>
          <div class="input-group">
            <label class="label"> Cell phone Number </label>
            <vue-tel-input v-model="mobilePhoneStr" @input="setFormattedPhoneNumber" :preferredCountries="['US']"><template v-slot:arrow-icon> <span class="arrow">▼</span> </template></vue-tel-input>
            <div v-if="submitted && $v.mobilePhone.$error" class="error">
              <span v-if="!$v.mobilePhone.required">Valid mobile number is required</span>
            </div>
          </div>
          <ul class="ticks">
            <li><svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'tick'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path d="M8.455 16.212l4.363 4.073 8.728-8.727" stroke="#00C7FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x=".5" y="1.421" width="29" height="29" rx="14.5" stroke="#fff"/></svg> Used only for identity verification</li>
            <li><svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'tick'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path d="M8.455 16.212l4.363 4.073 8.728-8.727" stroke="#00C7FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x=".5" y="1.421" width="29" height="29" rx="14.5" stroke="#fff"/></svg> Fast, easy, secure process</li>
            <li><svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind:svg-inline="''" v-bind:class="'tick'" v-bind:role="'presentation'" v-bind:focusable="'false'" v-bind:tabindex="'-1'"><path d="M8.455 16.212l4.363 4.073 8.728-8.727" stroke="#00C7FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x=".5" y="1.421" width="29" height="29" rx="14.5" stroke="#fff"/></svg> We will NEVER share your data with third parties</li>
          </ul>
          <div class="buttons-verify">
            <Button type="primary" @click="submitForm('sms')" :loading="loading" :disabled="btnDisabled">TEXT MSG</Button>
            <Button type="primary" @click="submitForm('voice')" :loading="loading2" :disabled="btnDisabled">VOICE CALL</Button>
          </div>
          <p class="form-help">
            SMS and data charges may apply per your carrier agreement. We will only accept legitimate cell phone numbers for the verification process.
            One time/web-generated numbers will not be accepted. Attempts to create duplicate accounts are a violation of our terms and conditions
          </p>
        </form>
      </div>
      <div v-else class="phone-modal-inner--code">
        <div class="content">
          <h2>ALMOST THERE...</h2>
          <p>Verify your cell phone number to secure your account. Play and win big with Sweepstakes Coins (SC).</p>
        </div>
        <form @submit.prevent="submitCode">
          <div class="input-group">
            <form-input @input="ignoreSpaces" v-model="code" name="Enter Verification Code" type="text"></form-input>
            <div v-if="submittedCode && codeHasErrors" class="error">
              <span>Verification code is required</span>
            </div>
          </div>
          <Button type="primary" native-type="submit" :loading="loading">Verify Number</Button>
          <br />
          <a href="#" @click="wrongNumber" style="margin-top: 1rem; display: inline-block;">Wrong Number?</a>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';
import { mapGetters } from 'vuex';
import { required } from 'vuelidate/lib/validators';

const VueTelInput = () => Promise.all([
  import(/* webpackChunkName: "chunk-vue-tel-input" */ 'vue-tel-input'),
  import(/* webpackChunkName: "chunk-vue-tel-input" */ 'vue-tel-input/dist/vue-tel-input.css'),
]).then(([{ VueTelInput }]) => VueTelInput); // eslint-disable-line

export default {
  props: {
    //
  },
  data() {
    return {
      mobilePhone: null,
      mobilePhoneStr: null,
      loading: false,
      loading2: false,
      btnDisabled: false,
      start: true,
      submitted: false,
      code: '',
      submittedCode: false,
    };
  },
  validations: {
    mobilePhone: { required },
  },
  components: {
    Modal,
    FormInput,
    Button,
    VueTelInput,
  },
  computed: {
    ...mapGetters(['playerData', 'mobileNeedsVerification']),
    verifyPhoneURL() {
      return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'phone/');
    },
    codeHasErrors() {
      console.log(this.code.length);
      if (this.code && this.code.length === 4) {
        return false;
      }
      return true;
    },
  },
  methods: {
    setFormattedPhoneNumber(inputStr, data) {
      if (data.valid && data.number) {
        this.mobilePhone = data.number;
      } else {
        this.mobilePhone = null;
      }
    },
    wrongNumber(e) {
      e.preventDefault();
      this.submittedCode = false;
      this.code = '';
      this.start = true;
    },
    async verifyPhoneStart(channel) {
      this.btnDisabled = true;
      if (channel === 'voice') {
        this.loading2 = true;
      } else {
        this.loading = true;
      }
      const phoneUpdated = await this.updatePlayerPhone();
      if (typeof phoneUpdated.data.status !== 'undefined' && phoneUpdated.data.status === 'SUCCESS') {
        await this.$http(`${this.verifyPhoneURL}`, {
          params: {
            action: 'start',
            channel,
            phone: this.mobilePhone,
          },
        })
          .then((response) => {
            console.log(response);
            this.start = false;
          });
      } else {
        this.$noty.error('There was an error verifying your phone number. Please try again or contact support if the problem persists.');
      }
      this.loading = false;
      this.loading2 = false;
      this.btnDisabled = false;
    },
    async verifyPhoneCode() {
      this.loading = true;
      await this.$http(`${this.verifyPhoneURL}`, {
        params: {
          action: 'code',
          phone: this.mobilePhone,
          code: this.code,
        },
      })
        .then(async (response) => {
          console.log(response);
          if (response.data.valid) {
            window.dataLayer2.push({
              event: 'verification',
            });
            await this.$store.dispatch('updateExtraInfo', { mobileNeedsVerification: false, mobileVerified: true });
          } else {
            this.$noty.error('Invalid code. Please try again.');
          }
        })
        .catch((error) => {
          console.log(error);
          this.$noty.error('There was an error verifying your phone number. Please try again or contact support if the problem persists.');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    ignoreSpaces(input) {
      console.log(input);
      // this.user.mobilePhone = input.replace(' ', '').replace('.', '');
    },
    submitForm(channel) {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.verifyPhoneStart(channel);
      }
    },
    async updatePlayerPhone() {
      const result = await this.$apiToken
        .get('/updatePlayerInfo', {
          params: {
            mobilePhone: this.mobilePhone,
          },
        });
      return result;
    },
    submitCode() {
      this.submittedCode = true;
      if (!this.codeHasErrors) {
        this.verifyPhoneCode();
      }
    },
    fillPlayerData(playerData) {
      if (playerData && playerData.mobilePhone) {
        this.mobilePhoneStr = playerData.mobilePhone;
      }
    },
  },
  watch: {
    // playerData is not ready when mounted (when user enters page directly from url)
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.fillPlayerData(playerDataReady);
      }
    },
  },
  mounted() {
    if (this.playerData) {
      this.fillPlayerData(this.playerData);
    }
  },
};
</script>

<style lang="scss">
.phone-modal {
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
}
.phone-modal-inner {
  width: 100%;
}

.form-help {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
  width: 600px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
}

.buttons-verify {
  display: flex;
  justify-content: center;
  align-items: center;
}
.buttons-verify>.button:not(:last-child) {
  margin-right: 1rem;
}
.buttons-verify>.button:last-child {
  background: transparent;
  border: 1px solid #00c4ff;
}
.phone-modal-inner--code, .phone-modal-inner {
    max-width: 100%;
}

@media (max-width: 767px) {
  .phone-modal{
    max-height: calc(100vh - 4rem);
    padding: 2rem 1rem;
    background-position: top right;

    .content {
      font-size: 14px;
      width: auto;
    }
    .vue-tel-input {
      width: 100%;
    }
    #app & input.vti__input {
      min-width: unset;
    }
    p.form-help {
      font-size: 9px;
      line-height: 1.1;
      letter-spacing: .5px;
    }
    ul.ticks {
      flex-direction: column;
    }
    ul.ticks > li {
      margin-bottom: 8px;
    }
  }
}
</style>
