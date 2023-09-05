<template>
  <!-- Deposit History -->
  <div class="profile-history--section" v-if="depositHistory">
    <div class="select-dates">
      <h4>Purchase History</h4>
      <div class="input-group">
        <form-input v-model="depositDates.startDate" name="From:" type="date" initial-view="day"></form-input>
      </div>
      <div class="input-group">
        <form-input v-model="depositDates.endDate" name="To:" type="date" initial-view="day"></form-input>
      </div>
      <Button type="primary" @click="updateDepositHistory" :loading="depositLoading" expanded>Search</Button>
    </div>
    <table>
      <tr>
        <th>Date</th>
        <th>Amount</th>
        <th>Method</th>
        <th>Status</th>
        <th>ID</th>
      </tr>
      <template v-if="depositHistory.length > 0">
        <tr v-for="history in depositHistory" :key="history.id">
          <td data-col="Date">{{ history.requestDate | formatDate }} <small class="timesmall">{{ history.requestDate | getTimeFromDateTime }}</small></td>
          <td data-col="Amount" class="amount">
            {{ history.amountNumber | formatMoney('USD') }}
          </td>
          <td data-col="Method">{{ history.method }}</td>
          <td data-col="Status">{{ history.status === 'PENDING' ? 'Pending / Not finalized' : history.status | capitalize }}</td>
          <td data-col="ID">{{ history.id }}</td>
        </tr>
      </template>
      <p v-if="depositHistory.length == 0" class="mt-double">No transactions found.</p>
    </table>
    <template v-if="bonusHistory">
      <h4 class="bonus-h4">Coin History</h4>
      <table>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Wagering</th>
          <th>Description</th>
          <th>ID</th>
          <th>Expiry Date</th>
        </tr>
        <template v-if="bonusHistory.length > 0">
          <tr v-for="bonus in bonusHistory" :key="bonus.id">
            <td data-col="Date">{{ bonus.triggerDate | formatDate }} <small class="timesmall">{{ bonus.triggerDate | getTimeFromDateTime }}</small></td>
            <td data-col="Amount" class="amount">
              {{ bonus.amount | formatMoney(bonus.currency) }}
            </td>
            <td data-col="Wagering">
              <template v-if="bonus.currency === 'WOC'">
                {{ bonus.amountWageredNumber | formatMoney(bonus.currency) }} / {{ bonus.wagerRequirementNumber | formatMoney(bonus.currency) }}
              </template>
              <template v-else>
                -
              </template>
            </td>
            <td data-col="Name">{{ bonus.description ? bonus.description : bonus.bonusPlanName }}</td>
            <td data-col="ID">{{ bonus.id }}</td>
            <td data-col="Expiry Date">
              <template v-if="bonus.status === 'CANCELED'">
                Canceled/Expired
              </template>
              <template v-else>
                {{ bonus.expiryDate | formatDate }} <small class="timesmall">{{ bonus.expiryDate | getTimeFromDateTime }}</small>
              </template>
            </td>
          </tr>
        </template>
        <p v-if="bonusHistory.length == 0" class="mt-double">No transactions found.</p>
      </table>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  data() {
    return {
      depositDates: {
        startDate: null,
        endDate: null,
      },
      // Loading states
      depositLoading: false,
    };
  },
  components: {
    FormInput,
    Button,
  },
  computed: {
    ...mapGetters(['depositHistory', 'bonusHistory']),
    weekago() {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return date;
    },
    today() {
      return new Date();
    },
  },
  methods: {
    async updateDepositHistory() {
      const startDate = new Date(this.depositDates.startDate);
      const endDate = new Date(this.depositDates.endDate);
      if (startDate > endDate) {
        this.$noty.error('Start date has to be previous that end date');
      } else if (startDate > this.today || endDate > this.today) {
        this.$noty.error('Dates cannot be in the future');
        this.depositLoading = true;
        await this.$store.dispatch('getDepositHistory', this.depositDates);
        await this.$store.dispatch('getBonusHistory', this.depositDates);
        this.depositLoading = false;
      } else {
        this.depositLoading = true;
        await this.$store.dispatch('getDepositHistory', this.depositDates);
        await this.$store.dispatch('getBonusHistory', this.depositDates);
        this.depositLoading = false;
      }
    },
  },
  created() {
    // Set range from 7 days ago to today
    this.depositDates.startDate = this.weekago; // a week ago
    this.depositDates.endDate = this.today; // today
    this.$store.dispatch('getDepositHistory', this.depositDates);
    this.$store.dispatch('getBonusHistory', this.depositDates);
  },
  mixins: ['dateToString'],
};
</script>

<style>
.bonus-h4 {
  margin-top: 2.5rem;
}
</style>
