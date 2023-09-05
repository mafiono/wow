<template>
  <div class="container section withdrawal">
    <CompleteProfile v-if="profileCompleted == false"
      signUpCompleted="signUpCompleted"
      text="Your profile has to be completed to redeem coins."
      >
    </CompleteProfile>
    <template v-else>
      <div v-if="!showCashier">
        <h3>Redeem Coins</h3>
        <enter-amount @amountEntered="goToCashier($event)"></enter-amount>
      </div>
      <div v-else>
        <Loader v-if="loading"></Loader>
        <div v-if="showVerification" class="custom-enter-amount-wrapper">
          <section class="custom-enter-amount custom-enter-amount-content">
            <h3>Verification</h3>
            <p>We've sent a verification code to {{ playerData.mobilePhone }}.</p>
            <input
              v-model="code"
              class="input-currency"
              ref="inputa"
              placeholder="Enter code"
              style="margin-bottom: 1rem;"
            >
            <p class="voice-ver" @click="verifyPhoneStart('voice')">Voice Verification</p>
            <Button type="primary" @click="verifyPhoneCode" :loading="loading2" :disabled="submitDisabled">Submit</Button>
            <p><a href="#" @click="cancel" class="cancel-ver">Cancel</a></p>
          </section>
        </div>
        <Cashier v-else method="withdrawal" :service="withdrawalService" :initialAmount="this.initialAmount"></Cashier>
        <!-- <div class="back-to-amount" style="margin-top: 1rem;">
          <Button type="secondary" @click="goToAmount">Back</Button>
        </div> -->
      </div>
    </template>
  </div>
</template>

<script>
import EnterAmount from '@/components/molecules/EnterAmount.vue';
import Cashier from '@/components/molecules/Cashier.vue';
import CompleteProfile from '@/components/molecules/CompleteProfile.vue';
import Button from '@/components/atoms/Button.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      showCashier: false,
      initialAmount: '0.0',
      withdrawalService: null,
      profileCompleted: null,
      showVerification: false,
      loading: false,
      code: '',
      loading2: false,
      mobred: this.$cookies.get('mobred'),
    };
  },
  components: {
    EnterAmount,
    Cashier,
    CompleteProfile,
    Button,
    Loader,
  },
  computed: {
    ...mapGetters(['balance', 'playerData']),
    submitDisabled() {
      if (this.code && this.code.length >= 4 && this.code.length <= 6) return false;
      return true;
    },
    verifyPhoneURL() {
      return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'phone/');
    },
    minWithdrawal: () => process.env.VUE_APP_MIN_WITHDRAWAL,
  },
  methods: {
    goToCashier(data) {
      this.withdrawalService = data.service;
      this.initialAmount = data.amount.replace(/€|,/gi, '');
      this.initialAmount = this.initialAmount.replace(/$|,/gi, '');
      this.initialAmount = this.initialAmount.replace('SC ', '');
      this.initialAmount = this.initialAmount.replace(' SC', '');
      this.initialAmount = this.initialAmount.replaceAll(',', '');
      const initialFloat = parseFloat(this.initialAmount, 10);
      // console.log(initialFloat);
      let balanceFloat = this.balance.totalBalance.replaceAll(',', '');
      // console.log('bal', balanceFloat);
      balanceFloat = parseFloat(balanceFloat, 10);
      // console.log('bal', balanceFloat);

      if (initialFloat === 0) {
        this.$noty.error(`Amount can't be empty`);
      } else if (initialFloat > balanceFloat) {
        this.$noty.error(`Amount cant' be higher than balance`);
      } else if (initialFloat < process.env.VUE_APP_MIN_WITHDRAWAL) {
        this.$noty.error(`Amount cant' be lower than ${process.env.VUE_APP_MIN_WITHDRAWAL}`);
      } else if (initialFloat > 5000 && this.withdrawalService === 'TRUSTLY') {
        this.$noty.error(`The maximum amount for online banking transactions is 5000 SC. Please enter a lower amount or select a different redeem method.`);
      } else if (!this.mobred) {
        this.verifyPhoneStart('sms');
      } else {
        // if (this.withdrawalService === 'SKRILL') {
        // }
        this.showCashier = true;
      }
    },
    async verifyPhoneStart(channel) {
      this.btnDisabled = true;
      this.loading = true;
      this.showCashier = true;
      this.showVerification = true;
      await this.$http(`${this.verifyPhoneURL}`, {
        params: {
          action: 'start',
          channel,
          phone: this.playerData.mobilePhone,
        },
      })
        .then((response) => {
          console.log(response);
          this.showCashier = true;
        })
        .catch(() => {
          this.$noty.error(`Too many requests! Please wait 15min and try again later.`);
          this.cancel();
        });
      this.loading = false;
    },
    cancel(e = null) {
      if (e) {
        e.preventDefault();
      }
      this.showVerification = false;
      this.showCashier = false;
    },
    async verifyPhoneCode() {
      this.loading2 = true;
      await this.$http(`${this.verifyPhoneURL}`, {
        params: {
          action: 'code',
          phone: this.playerData.mobilePhone,
          code: this.code,
        },
      })
        .then(async (response) => {
          if (response.data.valid) {
            this.$cookies.set('mobred', true, '1d');
            this.showCashier = true;
            this.showVerification = false;
          } else {
            this.$noty.error('Invalid code. Please try again.');
          }
        })
        .catch(() => {
          this.$noty.error('There was an error verifying your phone number. Please try again or contact support if the problem persists.');
        })
        .finally(() => {
          this.loading2 = false;
        });
    },
    goToAmount() {
      this.showCashier = false;
    },
    signUpCompleted() {
      this.profileCompleted = true;
    },
    isProfileCompleted(playerData) {
      if (
        playerData.firstName
        && playerData.lastName
        && playerData.address
        && playerData.city
        && playerData.postalCode
        && playerData.country
      ) {
        this.profileCompleted = true;
      } else {
        this.profileCompleted = false;
      }
    },
    checkKycStatus(playerData) {
      const { kycStatus, registrationStatus } = playerData;
      // console.log('kycStatus', kycStatus);
      // console.log('registrationStatus', registrationStatus);
      // console.log('withdrawableBalance', parseFloat(this.balance?.withdrawableBalance.replace(/,/g, '')));
      // console.log('minWithdrawal', this.minWithdrawal);
      // if (kycStatus !== 'PASS') {
      if (registrationStatus === 'PLAYER' && kycStatus !== 'PASS' && parseFloat(this.balance?.withdrawableBalance.replace(/,/g, '')) >= this.minWithdrawal) {
        this.$router.push({ name: 'Verify Identity' });
      }
    },
  },
  mounted() {
    if (this.playerData) {
      this.isProfileCompleted(this.playerData);
      this.checkKycStatus(this.playerData);
    }
  },
  created() {
    if (this.$route.query.merchantReference) {
      this.showCashier = true;
      this.withdrawalService = '';
    }
  },
  watch: {
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.isProfileCompleted(playerDataReady);
        this.checkKycStatus(playerDataReady);
      }
    },
    balance(balanceReady) {
      if (balanceReady && this.playerData) {
        this.checkKycStatus(this.playerData);
      }
    },
  },
};
</script>

<style>
.withdrawal {
  text-align: center;
}
.voice-ver {
  color: #0082ff;
  text-decoration: underline;
  font-size: 13px;
  margin-top: -10px;
  margin-bottom: 1rem;
  cursor: pointer;
}
.cancel-ver {
  color: #c13131;
  text-decoration: underline;
  font-size: 13px;
  cursor: pointer;
  margin-top: 0.5rem;
  display: block;
  margin-bottom: -1rem;
}
</style>
