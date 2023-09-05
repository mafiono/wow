<template>
  <div class="withdrawal-form">
    <template v-if="!success && !hasPaymentInfo && service === 'BANK' ">
      <h3>Redeem Coins - Bank Details</h3>
      <!-- <pre>success: {{success}} | hasPaymentInfo: {{hasPaymentInfo}}</pre> -->
      <form @submit.prevent="checkBankForm">
        <div class="select-metod">
          <div class="select-metod-item" :class="{ 'active' : selectedMethod === 'ach' }" @click="selectedMethod = 'ach'">Local Bank Account</div>
          <!-- <div class="select-metod-item" :class="{ 'active' : selectedMethod === 'swift' }" @click="selectedMethod = 'swift'">SWIFT</div> -->
        </div>
        <div v-if="selectedMethod === 'ach'" class="ach-form-inner">
          <div class="input-group">
            <form-input v-model="formFields.fullName" name="Full Name" type="text"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.ach.routing" name="ACH Routing Number" type="text"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.ach.accountNumber" name="Account Number" type="text"></form-input>
          </div>
          <div class="input-group">
            <label class="label">
              Account Type
            </label>
            <label class="radio-label">
              <input v-model="formFields.ach.accountType" type="radio" id="actype-checking" name="actype" value="checking">
              <span>Checking</span>
            </label>
            <label class="radio-label">
              <input v-model="formFields.ach.accountType" type="radio" id="actype-savings" name="actype" value="savings">
              <span>Savings</span>
            </label>
          </div>
        </div>
        <div v-if="selectedMethod === 'swift'" class="ach-form-inner">
          <div class="input-group">
            <form-input v-model="formFields.fullName" name="Full Name" type="text"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.swift.bic" name="SWIFT / BIC code" type="text"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.swift.accountNumber" name="IBAN / Account Number" type="text"></form-input>
          </div>
        </div>
        <h4>Bank Address</h4>
        <div class="address-form-inner">
          <div class="input-group">
            <form-input v-model="formFields.country" name="Country" :whiteList="['US']" type="countrySelect"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.city" name="City" type="text"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.address" name="Address" type="text"></form-input>
          </div>
          <div class="input-group">
            <form-input v-model="formFields.postcode" name="Post Code" type="text"></form-input>
          </div>
        </div>
        <Button class="mt-single" type="primary" native-type="submit" :loading="userFormLoading">{{ buttonLabel }}</Button>
      </form>
    </template>

    <template v-if="!success && !hasSkrillInfo && service === 'SKRILL'">
      <h3>Redeem Coins - Skrill Account</h3>
      <form @submit.prevent="checkSkrillForm">
        <div class="ach-form-inner">
          <div class="input-group">
            <form-input v-model.trim="formFields.skrillEmail" name="Skrill Email Address" type="text"></form-input>
            <div v-if="submitted && $v.formFields.skrillEmail.$error" class="error">
              <span v-if="!$v.formFields.skrillEmail.required">Email is required</span>
              <span v-if="!$v.formFields.skrillEmail.email">Email is invalid</span>
            </div>
          </div>
        </div>
        <Button class="mt-single" type="primary" native-type="submit" :loading="userFormLoading">{{ buttonLabel }}</Button>
      </form>
    </template>

    <template v-if="!success && service === 'TRUSTLY'">
      <h3>Redeem Coins - Online Banking</h3>
      <div id="widget-trustly"></div>
    </template>

    <template v-if="success">
      <h3>Redeem Coins</h3>
      <div>
        <p>Congratulations, your SC redemption request is now being processed!</p>
        <p>Redemptions can take 3-5 business days depending on your individual player account.</p>
        <p>If this is your first redemption then this could take up to 5 business days, as we need to perform some additional checks.</p>
        <p>All subsequent redemptions will take 3-5 business days after the day you made the redemption request.</p>
        <p>During this time your coins are still yours and are available for use. You can access them at any time by clicking transaction history in your account or by clicking the "Cancel" button below.</p>
        <p>If you have any questions about this please drop us a message.</p>
        <div class="back-to-amount" style="margin-top: 1rem;">
          <Button type="primary" tag="router-link" :to="{ name: 'Lobby' }">Back to Games</Button>
          <Button type="danger" v-if="paymentId" @click="cancelWithdrawal($event, paymentId)">Cancel Redemption Request</Button>
          <Button type="secondary" tag="router-link" :to="{ name: 'BuyCoins' }">Buy Coins</Button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  props: {
    method: {
      type: String,
      required: true,
    },
    initialAmount: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      default: 'BANK',
    },
    bonusId: Number,
  },
  components: {
    FormInput,
    Button,
  },
  data() {
    return {
      hasPaymentInfo: false,
      hasSkrillInfo: false,
      hasBankInfo: true,
      paymentId: 0,
      success: false,
      failureMessage: '',
      userFormLoading: false,
      chooseAmount: true,
      selectedMethod: 'ach',
      buttonLabel: 'Confirm',
      submitted: false,
      formFields: {
        fullName: '',
        skrillEmail: '',
        ach: {
          routing: '',
          accountNumber: '',
          accountType: false,
        },
        swift: {
          bic: '',
          accountNumber: '',
        },
        country: null,
        city: '',
        address: '',
        postcode: '',
      },
      trustlyData: {
        establishData: {
          accessId: '64f9vK5JgzTYGmpu',
          merchantId: '1014225262',
          description: 'redemption',
          currency: 'USD',
          amount: '0.00',
          merchantReference: '',
          paymentType: 'Deferred',
          requestSignature: '',
          returnUrl: '/withdrawal',
          cancelUrl: '#',
          customer: {
            externalId: '',
            name: '',
            email: '',
            dateOfBirth: '',
            enrollDate: '',
            phone: '',
            address: {
              address1: '',
              city: '',
              state: '',
              zip: '',
              country: '',
            },
          },
        },
        trustlyOptions: {
          closeButton: false,
          dragAndDrop: true,
          widgetContainerId: 'widget-trustly',
        },
      },
    };
  },
  validations: {
    formFields: {
      skrillEmail: {
        required,
        email,
      },
    },
  },
  computed: {
    ...mapGetters(['playerData']),
  },
  watch: {
    //
  },
  created() {
    this.checkPaymentInfo();
    if (this.service && this.service === 'TRUSTLY') {
      this.redeemWithTrustly(false);
    } else if (this.service && this.service.includes('TRUSTLY-')) {
      const paymentInformationId = this.service.replace('TRUSTLY-', '');
      this.redeemWithTrustly(paymentInformationId);
    } else if (this.$route.query.merchantReference) {
      this.success = true;
      this.paymentId = this.$route.query.merchantReference.replace('WITHDRAWAL_REQUEST-', '');
    }
  },
  methods: {
    goToLobby() {
      this.$router.push({ name: 'Lobby' });
    },

    // Check Bank form
    checkBankForm() {
      this.userFormLoading = true;
      this.addBankInfo();
    },

    // Check Skrill form
    checkSkrillForm() {
      this.submitted = true;
      this.$v.$touch();
      // If form is valid
      if (!this.$v.$invalid) {
        this.userFormLoading = true;
        this.redeemWithSkrill({
          email: this.formFields.skrillEmail,
        });
      }
    },

    // Check user available payment information
    checkPaymentInfo() {
      this.$store.dispatch('enableLoader');
      this.$apiToken.get('getPaymentInformation')
        .then((response) => {
          this.$store.dispatch('disableLoader');
          const { data } = response.data || [];
          if (data.length < 1) { this.hasPaymentInfo = false; } else {
            if (this.service === 'BANK') {
              const bankData = data.filter((d) => d.type === 'BANK');
              if (bankData.length) {
                const { details } = bankData[0];
                const paymentInfo = Object.assign({},
                  ...details.map((o) => ({
                    [o.key]: o.value,
                  })));
                this.redeemWithBank(paymentInfo);
              } else {
                this.hasBankInfo = false;
              }
            }

            if (this.service === 'SKRILL') {
              this.hasSkrillInfo = false;
            }
          }
        });
    },

    // Add user Bank Information
    addBankInfo() {
      const bankData = {
        NAME: this.formFields.fullName,
        ROUTING: this.formFields.ach.routing,
        NUMBER: this.formFields.ach.accountNumber,
        TYPE: this.formFields.ach.accountType,
        ADDRESS: this.formFields.address,
      };

      const preparePaymentInfo = new FormData();
      preparePaymentInfo.append('type', 'BANK');
      preparePaymentInfo.append('description', 'Cash withdrawal');
      preparePaymentInfo.append('fields', JSON.stringify(bankData));
      this.$apiToken.post('addPaymentInformation', preparePaymentInfo)
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            this.checkPaymentInfo();
          }
        });
    },

    // Add user Skrill information
    addSkrillInfo() {
      const skrillData = {
        skrillEmail: this.form.ach.skrillEmail,
      };

      const preparePaymentInfo = new FormData();
      preparePaymentInfo.append('type', 'SKRILL');
      preparePaymentInfo.append('description', 'Skrill withdrawal');
      preparePaymentInfo.append('fields', JSON.stringify(skrillData));
      this.$apiToken.post('addPaymentInformation', preparePaymentInfo)
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            console.log(response);
          }
        });
    },

    // Redeem with Skrill
    async redeemWithTrustly(paymentInformationId) {
      const prepareWithdrawalData = new FormData();
      prepareWithdrawalData.append('paymentMethod', 'TRUSTLYPBB_BANKTRANSFER');
      prepareWithdrawalData.append('action', 'GET_EXCHANGE_INFO');
      prepareWithdrawalData.append('amount', this.initialAmount);
      await this.$apiToken.post('prepareWithdrawal', prepareWithdrawalData)
        .then((response) => {
          const processWithdrawalData = new FormData();
          processWithdrawalData.append('paymentMethod', 'TRUSTLYPBB_BANKTRANSFER');
          processWithdrawalData.append('amount', this.initialAmount);
          processWithdrawalData.append('conversionId', response.data.conversionId);
          processWithdrawalData.append('description', 'redemption');
          if (paymentInformationId) {
            processWithdrawalData.append('paymentInformationId', paymentInformationId);
          }
          this.$apiToken.post('processWithdrawal', processWithdrawalData)
            .then((response2) => {
              this.$store.dispatch('disableLoader');
              console.log('response2', response2);
              console.log('response2', response2.data);
              if (response2.data.status === 'CONTINUE_TO_PAYMENT_SITE') {
                const {
                  accessId, calculatedSignature, merchantId, merchantReference, customer,
                } = response2.data;
                this.trustlyData.establishData.accessId = accessId;
                this.trustlyData.establishData.requestSignature = calculatedSignature;
                this.trustlyData.establishData.merchantId = merchantId;
                this.trustlyData.establishData.merchantReference = merchantReference;
                this.trustlyData.establishData.customer = customer;
                window.Trustly.selectBankWidget(this.trustlyData.establishData, this.trustlyData.trustlyOptions);
              } else if (response2.data.status === 'SUCCESS') {
                const {
                  paymentId,
                } = response2.data;
                this.paymentId = paymentId;
                this.userFormLoading = false;
                this.$store.dispatch('getBalance');
                this.success = true;
              } else {
                this.userFormLoading = false;
                this.failureMessage = response2.data.message;
                this.$noty.error(response2.data.status);
              }
            });
        });
    },

    // Redeem with Skrill
    async redeemWithSkrill(pi) {
      const prepareWithdrawalData = new FormData();
      prepareWithdrawalData.append('paymentMethod', 'MONEYBOOKERS');
      prepareWithdrawalData.append('action', 'GET_EXCHANGE_INFO');
      prepareWithdrawalData.append('amount', this.initialAmount);
      await this.$apiToken.post('prepareWithdrawal', prepareWithdrawalData)
        .then((response) => {
          const processWithdrawalData = new FormData();
          processWithdrawalData.append('paymentMethod', 'MONEYBOOKERS');
          processWithdrawalData.append('amount', this.initialAmount);
          processWithdrawalData.append('conversionId', response.data.conversionId);
          processWithdrawalData.append('skrillAccountEmail', pi.email);
          this.$apiToken.post('processWithdrawal', processWithdrawalData)
            .then((response2) => {
              if (response2.data.status === 'SUCCESS') {
                this.paymentId = response2.data.paymentId;
                this.userFormLoading = false;
                this.$store.dispatch('getBalance');
                this.success = true;
              } else {
                this.userFormLoading = false;
                this.failureMessage = response2.data.message;
                this.$noty.error(response2.data.status);
              }
            });
        });
    },

    // Redeem with Bank
    async redeemWithBank(pi) {
      const prepareWithdrawalData = new FormData();
      prepareWithdrawalData.append('paymentMethod', 'MONEYBOOKERS');
      prepareWithdrawalData.append('action', 'GET_EXCHANGE_INFO');
      prepareWithdrawalData.append('amount', this.initialAmount);
      await this.$apiToken.post('prepareWithdrawal', prepareWithdrawalData)
        .then(async (response1) => {
          const processWithdrawData = new FormData();
          processWithdrawData.append('paymentMethod', 'MB_BANKWIRE');
          processWithdrawData.append('amount', this.initialAmount);
          processWithdrawData.append('MB_BankAccountNumber', pi.NUMBER);
          processWithdrawData.append('MB_NAME', pi.NAME);
          processWithdrawData.append('MB_IBAN', pi.IBAN);
          processWithdrawData.append('MB_ROUTING', pi.ROUTING);
          processWithdrawData.append('MB_SWIFT_BIC', pi.SWIFT_BIC);
          processWithdrawData.append('MB_ADDRESS', pi.ADDRESS);
          processWithdrawData.append('MB_TYPE', pi.TYPE);
          processWithdrawData.append('conversionId', response1.data.conversionId);
          await this.$apiToken.post('processWithdrawal', processWithdrawData)
            .then((response) => {
              if (response.data.status === 'SUCCESS') {
                this.paymentId = response.data.paymentId;
                this.userFormLoading = false;
                this.$store.dispatch('getBalance');
                this.success = true;
              } else {
                this.failureMessage = response.data.message;
                this.$noty.error(response.data.status);
              }
            })
            .catch((error) => {
              console.log(error.response);
            });
        });
    },

    async cancelWithdrawal(event, paymentId) {
      event.preventDefault();
      this.$store.dispatch('enableLoader');
      await this.$apiToken.get('cancelWithdrawal', {
        params: {
          paymentId,
        },
      }).then((result) => {
        this.$store.dispatch('disableLoader');
        if (result.data.status === 'SUCCESS') {
          this.$noty.error(`Redemption ID ${paymentId} cancelled.`);
          this.$store.dispatch('getBalance');
          this.$router.push({ name: 'MyRedemptions' });
        } else {
          this.$noty.error(`Sorry, there was an error proccessing your request. Please try again.`);
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .withdrawal-form {
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
    .select-metod-item {
      border-bottom: 3px solid #111118;
      padding: .7rem;
      flex: 1;
      font-weight: 600;
      cursor: pointer;
    }
    .select-metod {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: stretch;
      margin-bottom: 2rem;
    }
    input.input {
      width: 100%;
    }
    .select-wrapper select {
      width: 100%;
    }
    .input-group .label {
      text-align: left;
    }
    label.radio-label {
      display: block;
      text-align: left;
      display: block;
      border: 1px solid #16161E;
      padding: 10px 15px 10px 15px;
      font-weight: 500;
      min-width: 300px;
      background: #111118;
      margin-bottom: 10px;
    }
    label.radio-label span {
      margin-left: 1em;
    }
    .active.select-metod-item {
      border-bottom-color: #019efe;
      color: #019efe;
    }
  }

  .back-to-amount>.button {
    margin-bottom: 1rem;
    width: auto;
    font-size: 12px;
    height: 40px;
  }
  @media (max-width: 768px) {
    .back-to-amount>.button {
      display: block;
      width: 100%;
    }
  }
  @media (min-width: 769px) {
    .back-to-amount>.button:not(:last-child) {
      margin-right: 1rem;
    }
  }
</style>
