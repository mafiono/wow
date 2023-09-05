<template>
  <!-- My Redemptions -->
  <div class="profile-history--section" v-if="withdrawalHistory && sweep">
    <div class="select-dates">
      <h4>My Redemptions</h4>
      <div class="input-group">
        <form-input v-model="withdrawalDates.startDate" name="From:" type="date" initial-view="day"></form-input>
      </div>
      <div class="input-group">
        <form-input v-model="withdrawalDates.endDate" name="To:" type="date" initial-view="day"></form-input>
      </div>
      <Button type="primary" @click="updateWithdrawalHistory" :loading="withdrawalLoading" expanded>Search</Button>
    </div>
    <table>
      <tr>
        <th>Date Requested</th>
        <th>Amount</th>
        <!-- <th>Balance</th> -->
        <th>Method</th>
        <th>Status</th>
        <th>ID</th>
        <th></th>
      </tr>
      <template v-if="withdrawalHistory.length > 0">
        <tr v-for="history in withdrawalHistory" :key="history.id">
          <td data-col="Date Requested">{{ history.requestDate | formatDate }}</td>
          <td data-col="Amount" class="amount">
            {{ history.amount | formatMoney(history.currency) }}
          </td>
          <!-- <td data-col="Balance">{{ history.balance | formatMoney(history.currency) }}</td> -->
          <td data-col="Method">{{ history.method }}</td>
          <td data-col="Status" class="status">
            {{ history.status | capitalize }}
          </td>
          <td data-col="ID">{{ history.id }}</td>
          <td data-col="Options" class="options">
            <Button type="danger" v-if="history.status === 'PENDING'" @click="cancelWithdrawal($event, history.id)" :loading="loaders.includes(history.id)">Cancel<br>Redemption</Button>
            <Button type="primary" tag="router-link" :to="{ name: 'Contact Us' }">Contact<br>Support</Button>
          </td>
        </tr>
      </template>
    </table>

    <p v-if="withdrawalHistory.length == 0" class="mt-double">No transactions found.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  data() {
    return {
      loaders: [],
      withdrawalDates: {
        startDate: null,
        endDate: null,
      },
      withdrawalLoading: false,
    };
  },
  components: {
    FormInput,
    Button,
  },
  computed: {
    ...mapGetters(['withdrawalHistory', 'sweep']),
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
    async updateWithdrawalHistory() {
      const startDate = new Date(this.withdrawalDates.startDate);
      const endDate = new Date(this.withdrawalDates.endDate);
      if (startDate > endDate) {
        this.$noty.error('Start date has to be previous that end date');
      } else if (startDate > this.today || endDate > this.today) {
        this.$noty.error('Dates cannot be in the future');
      } else {
        this.withdrawalLoading = true;
        await this.$store.dispatch('getWithdrawalHistory', this.withdrawalDates);
        this.withdrawalLoading = false;
      }
    },
    async cancelWithdrawal(event, paymentId) {
      this.loaders.push(paymentId);
      await this.$apiToken.get('cancelWithdrawal', {
        params: {
          paymentId,
        },
      }).then((result) => {
        if (result.data.status === 'SUCCESS') {
          this.$noty.error(`Redemption ID ${paymentId} cancelled.`);
          // event.target.closest('td.status').innerHTML = 'Cancelled';
          this.loaders = this.loaders.filter((item) => item !== paymentId);
          this.$store.dispatch('getBalance');
          this.$store.dispatch('getWithdrawalHistory', this.withdrawalDates);
        } else {
          this.$noty.error(`Sorry, there was an error proccessing your request. Please try again.`);
        }
        console.log(result.data);
      });
    },
  },
  created() {
    this.withdrawalDates.startDate = this.weekago; // a week ago
    this.withdrawalDates.endDate = this.today; // today
    this.$store.dispatch('getWithdrawalHistory', this.withdrawalDates);
  },
  mixins: ['dateToString'],
};
</script>
