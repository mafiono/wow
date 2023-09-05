<template>
  <section>
    <!-- Deposit Limits -->
    <div class="deposit-limits">
      <template v-if="personalLimit">
        <div class="deposit-limits--top">
          <h4>Purchase Limits</h4>
          <Button type="primary" @click="toggleEditable">
            <template v-if="!this.editable"
              >Edit<Icon :height="17" :width="17" name="edit"></Icon
            ></template>
            <template v-else>Cancel<Icon :height="15" :width="15" name="close"></Icon></template>
          </Button>
        </div>
        <!-- Limits -->
        <div v-if="this.currency" class="deposit-limits--table">
          <table>
            <tr>
              <th class="empty"></th>
              <th>Daily Limit</th>
              <th>Weekly Limit</th>
              <th>Monthly Limit</th>
            </tr>
            <tr>
              <th><template v-if="editable">New</template><template v-else>Current</template> Purchase Limit</th>
              <td data-col="Daily Limit" :data-currency="getCurrencySymbol(this.currency)" :class="{'numberValue': daily != 'No limit'}">
                <FormInput
                  :disable="!editable"
                  v-model="daily"
                  @input="editNewLimit($event, 'daily')"
                  @focus="startTyping($event, 'daily')"
                  @blur="endTyping($event, 'daily')"
                >
                </FormInput>
              </td>
              <td data-col="Weekly Limit" :data-currency="getCurrencySymbol(this.currency)" :class="{'numberValue': weekly != 'No limit'}">
                <FormInput
                  :disable="!editable"
                  v-model="weekly"
                  @input="editNewLimit($event, 'weekly')"
                  @focus="startTyping($event, 'weekly')"
                  @blur="endTyping($event, 'weekly')"
                >
                </FormInput>
              </td>
              <td data-col="Monthly Limit" :data-currency="getCurrencySymbol(this.currency)" :class="{'numberValue': monthly != 'No limit'}">
                <FormInput
                  :disable="!editable"
                  v-model="monthly"
                  @input="editNewLimit($event, 'monthly')"
                  @focus="startTyping($event, 'monthly')"
                  @blur="endTyping($event, 'monthly')"
                >
                </FormInput>
              </td>
            </tr>
            <tr v-if="hasPendingDaily || hasPendingWeekly || hasPendingMonthly" class="tr-pending">
              <th>Pending Purchase Limit</th>
              <td data-col="Pending Daily" :data-currency="getCurrencySymbol(this.currency)" :class="{'numberValue': pendingDaily != 'No pending limit' && pendingDaily != 'No limit', 'has-pending': hasPendingDaily}">
                {{ pendingDaily }}
                <div v-if="hasPendingDaily" class="effective-date">Effective {{ hasPendingDaily | toLocalDateTime }}</div>
              </td>
              <td data-col="Pending Weekly" :data-currency="getCurrencySymbol(this.currency)" :class="{'numberValue': pendingWeekly != 'No pending limit' && pendingWeekly != 'No limit', 'has-pending': hasPendingWeekly}">
                {{ pendingWeekly }}
                <div v-if="hasPendingWeekly" class="effective-date">Effective {{ hasPendingWeekly | toLocalDateTime }}</div>
              </td>
              <td data-col="Pending Monthly" :data-currency="getCurrencySymbol(this.currency)" :class="{'numberValue': pendingMonthly != 'No pending limit' && pendingMonthly != 'No limit', 'has-pending': hasPendingMonthly}">
                {{ pendingMonthly }}
                <div v-if="hasPendingMonthly" class="effective-date">Effective {{ hasPendingMonthly | toLocalDateTime }}</div>
              </td>
            </tr>
            <tr v-if="false" data-algo="a">
              <th>Maximum Purchase Limit</th>
              <td data-col="Maximum Daily" :data-currency="getCurrencySymbol(this.currency)" class="numberValue">{{ maxDaily }}</td>
              <td data-col="Maximum Weekly" :data-currency="getCurrencySymbol(this.currency)" class="numberValue">{{ maxWeekly }}</td>
              <td data-col="Maximum Monthly" :data-currency="getCurrencySymbol(this.currency)" class="numberValue">{{ maxMonthly }}</td>
            </tr>
          </table>

          <Button
            type="primary"
            @click="confirmUpdateLimits"
            :disabled="disableButton"
            :loading="loading"
            >Continue</Button
          >
          <div class="sucess-text" v-if="setLimitsSucess">
            Your purchase limits have been updated successfully.
          </div>
        </div>
      </template>
      <!-- Error -->
      <template  v-else-if="getLimitsError">
        <h4>Purchase Limits</h4>
        <p class="mt-single">Unable to retrieve your purchase limits. Complete your profile first.</p>
      </template>
      <!-- Pop Ups -->
      <PopUp
        v-if="discardPopUp"
        title="Discard changes"
        acceptLabel="Discard"
        @accepted="acceptedDiscard"
        @cancelled="cancelledDiscard"
      >
        <template v-slot:message>
          <p>Your changes have not been saved.</p>
          <p>Do you want to discard them?</p>
        </template>
      </PopUp>
      <PasswordPopUp
        v-if="confirmPopUp"
        @accepted="acceptedConfirmLimits"
        @cancelled="cancelledConfirmLimits"
      >
        <template v-slot:message>
          <p>
            When changing your deposit limits any decrease in limits become effective immediately.
            However any increase in limits will take 7 days to come into effect. Enter password to continue.
          </p>
        </template>
      </PasswordPopUp>
    </div>
  </section>
</template>

<script>
import FormInput from '@/components/atoms/FormInput.vue';
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import PopUp from '@/components/molecules/PopUp.vue';
import PasswordPopUp from '@/components/molecules/PasswordPopUp.vue';
import { zonedTimeToUtc } from 'date-fns-tz';
import { mapGetters } from 'vuex';
import format from 'date-fns/format';

export default {
  data() {
    return {
      currency: null,
      // Max
      maxDaily: null,
      maxWeekly: null,
      maxMonthly: null,
      // Current
      daily: null,
      weekly: null,
      monthly: null,
      // Init
      initDaily: null,
      initWeekly: null,
      initMonthly: null,
      // Pending
      pendingDaily: null,
      pendingWeekly: null,
      pendingMonthly: null,
      // Pending
      hasPendingDaily: null,
      hasPendingWeekly: null,
      hasPendingMonthly: null,
      // Button
      editable: false,
      loading: false,
      // Pop up
      discardPopUp: false,
      confirmPopUp: false,
    };
  },
  computed: {
    ...mapGetters(['personalLimit', 'getLimitsError', 'setLimitsSucess']),
    disableButton() {
      let disable = true;
      if (this.initDaily !== this.daily && this.daily !== '') {
        disable = false;
      } else if (
        this.initWeekly !== this.weekly
        && this.weekly !== ''
      ) {
        disable = false;
      } else if (
        this.initMonthly !== this.monthly
        && this.monthly !== ''
      ) {
        disable = false;
      }
      // Always make it disable if table isn't editable
      if (!this.editable) {
        disable = true;
      }
      return disable;
    },
  },
  created() {
    this.$store.commit('SET_LIMITS_SUCCESS', false);
    this.$store.dispatch('getPersonalDepositLimits', 'getLimitsError');
  },
  watch: {
    personalLimit(personalLimitReady) {
      if (personalLimitReady) {
        this.setLimits(personalLimitReady);
      }
    },
  },
  mounted() {
    if (this.personalLimit) {
      this.setLimits(this.personalLimit);
    }
  },
  methods: {
    /*
      Init
    */
    // When init page set limits from API
    setLimits(limits) {
      // Currency
      // this.currency = limits.currency;
      this.currency = 'USD';
      // Max
      this.maxDaily = parseFloat(limits.dailyMax);
      this.maxWeekly = parseFloat(limits.weeklyMax);
      this.maxMonthly = parseFloat(limits.monthlyMax);
      // Current
      this.daily = this.checkNull(limits.dailyLimit);
      this.weekly = this.checkNull(limits.weeklyLimit);
      this.monthly = this.checkNull(limits.monthlyLimit);
      // Init
      this.initDaily = this.daily;
      this.initWeekly = this.weekly;
      this.initMonthly = this.monthly;
      // Pending
      this.pendingDaily = this.checkPending(limits.pendingDailyLimit, limits.pendingDailyLimitEffectiveDate);
      this.pendingWeekly = this.checkPending(limits.pendingWeeklyLimit, limits.pendingWeeklyLimitEffectiveDate);
      this.pendingMonthly = this.checkPending(limits.pendingMonthlyLimit, limits.pendingMonthlyLimitEffectiveDate);
      // Pending
      this.hasPendingDaily = limits.pendingDailyLimitEffectiveDate;
      this.hasPendingWeekly = limits.pendingWeeklyLimitEffectiveDate;
      this.hasPendingMonthly = limits.pendingMonthlyLimitEffectiveDate;
    },
    // Format input so it shows 'no limit' instead of null
    checkNull(value) {
      if (value === 'No limit') return null;
      if (!value) return 'No limit';
      return parseFloat(value);
    },
    // Format input so it shows 'no pending limit' instead of null
    checkPending(value, effectiveDate) {
      if (!value && effectiveDate) return 'No limit';
      if (!value) return 'No pending limit';
      return parseFloat(value);
    },

    /*
      Reset limits
    */
    discardChanges() {
      this.daily = this.initDaily;
      this.weekly = this.initWeekly;
      this.monthly = this.initMonthly;
    },

    /*
      Edit Button
    */
    toggleEditable() {
      if (this.editable) {
        this.discardPopUp = true;
      } else {
        this.editable = true;
      }
    },
    // Discard Pop up
    acceptedDiscard() {
      this.editable = false;
      this.discardChanges();
      this.discardPopUp = false;
    },
    cancelledDiscard() {
      this.discardPopUp = false;
    },

    /*
      Input events
    */
    // Event: Change -> Convert to number
    editNewLimit(limit, typeLimit) {
      if (limit) {
        this[typeLimit] = parseFloat(limit);
      }
    },
    // Event: Focus
    startTyping(event, typeLimit) {
      if (event === 'No limit') {
        this[typeLimit] = '';
      }
    },
    // Event: Blur
    endTyping(eventValue, typeLimit) {
      if (eventValue === '') {
        this[typeLimit] = 'No limit';
      } else {
        const isNumber = this.isValidNumber(eventValue);
        if (!isNumber) {
          // Check if value is a number
          this.$noty.error('Invalid value. Limit has to be a number.');
          this.discardChanges();
        } else {
          // Check if value is valid
          const eventValueInt = parseFloat(eventValue);
          this.checkValueIsValid(eventValueInt, typeLimit);
        }
      }
    },
    // Validations
    isValidNumber(value) {
      const reg = /^[0-9]*[.]?[0-9]*$/;
      return reg.test(value);
    },
    checkValueIsValid(eventValue, typeLimit) {
      if (typeLimit === 'daily') {
        if (eventValue > this.maxDaily) {
          this.$noty.error('Daily limit has to be lower than maximum daily limit.');
          this.discardChanges();
        } else if (this.isValidNumber(this.weekly) && eventValue > this.weekly) {
          this.$noty.error('Daily limit has to be lower than weekly.');
          this.discardChanges();
        } else if (this.isValidNumber(this.monthly) && eventValue > this.monthly) {
          this.$noty.error('Daily limit has to be lower than monthly.');
          this.discardChanges();
        }
      } else if (typeLimit === 'weekly') {
        if (eventValue > this.maxWeekly) {
          this.$noty.error('Weekly limit has to be lower than maximum weekly limit.');
          this.discardChanges();
        } else if (this.isValidNumber(this.daily) && eventValue < this.daily) {
          this.$noty.error('Weekly limit has to be higher than daily.');
          this.discardChanges();
        } else if (this.isValidNumber(this.monthly) && eventValue > this.monthly) {
          this.$noty.error('Weekly limit has to be lower tan monthly.');
          this.discardChanges();
        }
      } else if (typeLimit === 'monthly') {
        if (eventValue > this.maxMonthly) {
          this.$noty.error('Monthly limit has to be lower than maximum monthly limit.');
          this.discardChanges();
        } else if (this.isValidNumber(this.daily) && eventValue < this.daily) {
          this.$noty.error('Monthly limit has to be higher than daily.');
          this.discardChanges();
        } else if (this.isValidNumber(this.weekly) && eventValue < this.weekly) {
          this.$noty.error('Monthly limit has to be lower tan weekly.');
          this.discardChanges();
        }
      }
    },

    /*
      Set up new limit and send to Omega
    */
    // Show confirm message
    confirmUpdateLimits() {
      this.confirmPopUp = true;
    },
    acceptedConfirmLimits() {
      this.updateLimits();
      this.confirmPopUp = false;
    },
    cancelledConfirmLimits() {
      this.editable = false;
      this.discardChanges();
      this.confirmPopUp = false;
    },
    // Update limits
    async updateLimits() {
      this.loading = true;
      this.editable = false;
      const resetLimits = [];
      if (this.initMonthly !== this.monthly) {
        if (this.monthly === 'No limit' || this.monthly === 0) {
          resetLimits.push('monthly');
        } else {
          const params = { monthlyLimit: this.monthly };
          this.$store.dispatch('setPersonalDepositLimits', params);
          this.loading = false;
        }
      }
      if (this.initWeekly !== this.weekly) {
        if (this.weekly === 'No limit' || this.weekly === 0) {
          resetLimits.push('weekly');
        } else {
          const params = { weeklyLimit: this.weekly };
          this.$store.dispatch('setPersonalDepositLimits', params);
          this.loading = false;
        }
      }
      if (this.initDaily !== this.daily) {
        if (this.daily === 'No limit' || this.daily === 0) {
          resetLimits.push('daily');
        } else {
          const params = { dailyLimit: this.daily };
          await this.$store.dispatch('setPersonalDepositLimits', params);
          this.loading = false;
        }
      }
      if (resetLimits && resetLimits.length) {
        await this.$store.dispatch('resetPersonalDepositLimits', { limitPeriod: resetLimits.toString() });
        this.loading = false;
      }
    },
  },
  filters: {
    toLocalDateTime(value) {
      if (!value) return '';
      const d = value.substring(0, 2);
      const m = value.substring(3, 5);
      const y = value.substring(6, 10);
      const time = value.substring(11, 19);
      const newDate = new Date(`${y}-${m}-${d}T${time}`);
      const utcDate = zonedTimeToUtc(newDate, 'America/New_York');
      return format(utcDate, 'dd MMM yyyy HH:mm');
    },
  },
  components: {
    FormInput,
    Icon,
    Button,
    PopUp,
    PasswordPopUp,
  },
  mixins: ['getCurrencyS'],
};
</script>

<style>
.tr-pending td.has-pending {
  position: relative;
  padding-bottom: 15px !important;
}
.deposit-limits--table table .tr-pending td.numberValue.has-pending:after {
  line-height: 35px;
}
.effective-date {
  font-size: 11px;
  /* position: absolute; */
  margin-bottom: -15px;
  text-align: center;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .effective-date {
    display: inline-block;
    margin: 0 0 0 5px !important;
  }
}
</style>
