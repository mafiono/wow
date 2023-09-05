<template>
  <div class="custom-enter-amount-wrapper">
    <template v-if="balance">
      <!-- Custom amount input -->
      <section class="custom-enter-amount">
        <div class="custom-enter-amount-content">
          <p>Here you can redeem your SC winnings for real prizes</p>
          <p style="margin-bottom: 0;">Coin rate:</p>
          <h3 style="margin-top: 10px;">{{ 1 | formatMoney('WOC') }} = {{ 1 | formatMoney('USD') }}</h3>
          <p style="margin-top: 10px;">Total balance: <strong>{{ balance.totalBalance | formatMoney('WOC') }}</strong></p>
          <p style="margin-top: 10px;">
            <span :class="{ danger: balance.withdrawableBalance < minWithdrawal }">Redeemable balance: <strong>{{ balance.withdrawableBalance | formatMoney('WOC') }}</strong></span>
            <br />Min: <strong>{{ minWithdrawal | formatMoney('WOC') }}</strong>
            <br />Max: <strong>{{ maxWithdrawal | formatMoney('WOC') }}</strong>
          </p>
          <p>Enter the amount to redeem:</p>
          <input
            class="input-currency"
            ref="input"
            v-model="customAmount"
            v-currency="{
              autoDecimalMode: false,
              locale: 'en',
              valueAsInteger: false,
              distractionFree: true,
              precision: 2,
              valueRange: { min: minWithdrawal, max: maxWithdrawalAvailable },
              allowNegative: false,
              currency: { suffix: ' SC' },
            }"
          >
        </div>
        <!-- <h3 v-if="yourSavedTrustlyBanks && yourSavedTrustlyBanks.length">SAVED REDEEM METHODS</h3>
            <div v-if="yourSavedTrustlyBanks && yourSavedTrustlyBanks.length" class="options">
              <Button v-for="bankDetails in yourSavedTrustlyBanks" :key="`trus-${bankDetails.id}`" class="payment-method--button" @click="chooseAmount('TRUSTLY-81')">
                <Icon class="payment-method--icon" name="trustly2" :height="30" style="margin: -5px -10px;"></Icon>
                <span class="payment-method--text">Demo Checking Account *6576</span>
                <Icon class="payment-method--next" name="next" :height="20"></Icon>
              </Button>
            </div>
        <h3 v-if="yourSavedTrustlyBanks && yourSavedTrustlyBanks.length">OTHER REDEEM METHODS</h3> -->
        <Button class="payment-method--button" @click="chooseAmount('TRUSTLY')" :loading="loading">
          <Icon class="payment-method--icon" name="trustly2" :height="30" style="margin: -5px -10px;"></Icon>
          <span class="payment-method--text">Online Banking <span v-if="requestAmount > 5000" class="max5000">(Max 5000 SC)</span></span>
          <Icon class="payment-method--next" name="next" :height="20"></Icon>
        </Button>
        <!-- <Button class="payment-method--button" @click="chooseAmount('BANK')" :loading="loading">
          <Icon class="payment-method--icon" name="bank" :loading="loading"></Icon>
          <span class="payment-method--text">Redeem with BANK</span>
          <Icon class="payment-method--next" name="next" :height="20"></Icon>
        </Button> -->
        <Button v-if="skrillAvailable" class="payment-method--button" @click="chooseAmount('SKRILL')" :loading="loading">
          <Icon class="payment-method--icon" name="skrill" :loading="loading"></Icon>
          <span class="payment-method--text">Redeem with Skrill</span>
          <Icon class="payment-method--next" name="next" :height="20"></Icon>
        </Button>
        <!-- <Button type="primary" @click="chooseAmount()" :loading="loading">Continue</Button> -->
      </section>
    </template>
    <template v-else>
      <Loader></Loader>
    </template>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Loader from '@/components/molecules/Loader.vue';
import Button from '@/components/atoms/Button.vue';
import { CurrencyDirective } from 'vue-currency-input';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      customAmount: '0.00',
      loading: false,
      maxWithdrawal: 10000,
      yourSavedPaymentMethods: null,
    };
  },
  computed: {
    ...mapGetters(['balance', 'playerData']),
    minWithdrawal: () => process.env.VUE_APP_MIN_WITHDRAWAL,
    maxWithdrawalAvailable() {
      console.log('typeof this', typeof this);
      if (!this.balance) {
        return 0;
      }
      if (this.balance?.withdrawableBalance && parseFloat(this.balance.withdrawableBalance.replace(/,/g, '')) > this.maxWithdrawal) {
        return this.maxWithdrawal;
      }
      if (this.balance?.totalBalance) {
        return parseFloat(this.balance.withdrawableBalance.replace(/,/g, ''));
      }
      return 0;
    },
    yourSavedTrustlyBanks() {
      if (this.yourSavedPaymentMethods) {
        const banks = this.yourSavedPaymentMethods.filter((obj) => obj.type === 'BANK' && obj.details.filter((obj2) => obj2.key === 'NAME').length);
        if (banks && banks.length) {
          return [banks[0]];
        }
      }
      return false;
    },
    requestAmount() {
      let requestAmount = 0;
      requestAmount = this.customAmount.replace(/€|,/gi, '');
      requestAmount = requestAmount.replace(/$|,/gi, '');
      requestAmount = requestAmount.replace('SC ', '');
      requestAmount = requestAmount.replace(' SC', '');
      requestAmount = requestAmount.replaceAll(',', '');
      return parseFloat(requestAmount, 10);
    },
    skrillAvailable() {
      return this.playerData?.country === 'US';
    },
  },
  components: {
    Icon,
    Button,
    Loader,
  },
  directives: {
    currency: CurrencyDirective,
  },
  created() {
    this.$apiToken.get('getPaymentInformation').then((response) => {
      this.yourSavedPaymentMethods = response.data.data;
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      console.log('fina');
    });
  },
  methods: {
    chooseAmount(method) {
      this.$emit('amountEntered', { service: method, amount: this.customAmount });
    },
  },
};
</script>

<style>
.custom-enter-amount span.danger {
  color: red;
}
span.max5000 {
  color: red;
  font-size: 11px;
  display: block;
  margin-bottom: -1px;
}
</style>
