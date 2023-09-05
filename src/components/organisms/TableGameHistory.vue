<template>
  <!-- Game History -->
  <div class="profile-history--section" v-if="gameHistory">
    <div class="select-dates">
      <h4>Game History</h4>
      <div class="input-group">
        <form-input v-model="gameHistoryDate.startDate" name="From:" type="date" initial-view="day"></form-input>
      </div>
      <div class="input-group">
        <form-input v-model="gameHistoryDate.endDate" name="To:" type="date" initial-view="day"></form-input>
      </div>
      <Button type="primary" @click="updateGameHistory" :loading="gameHistoryLoading" expanded>Search</Button>
    </div>
    <table id="game-history">
      <tr>
        <th>Date</th>
        <th>Game name</th>
        <th>Transaction</th>
        <th>Amount</th>
        <th>Balance</th>
        <th>Transaction ID</th>
      </tr>
      <template v-if="gameHistory.length > 0">
        <tr v-for="transaction in gameHistory" :key="transaction.id + transaction.transactionId">
          <td data-col="Date">{{ transaction.dateTime | formatDate }} <small class="timesmall">{{ transaction.dateTime | getTimeFromDateTime }}</small></td>
          <td data-col="Game name">{{ transaction.gameName }}</td>
          <td data-col="Transaction">{{ transaction.tranType.replace("_", " ") | capitalize }}</td>
          <td data-col="Amount" class="amount">
            {{ transaction.amount | formatMoney(transaction.currency) }}
          </td>
          <td data-col="Balance">
            {{
              transaction.postBalance | formatMoney(transaction.currency)
            }}
          </td>
          <td data-col="Transaction ID">{{ transaction.gameTranId }}</td>
        </tr>
      </template>
    </table>
    <div class="pagination" v-if="totalPages > 0">
      <Button @click="previousPage" class="arrow" :disabled="currentPage == 1">
        <Icon name="prev" :height="20" :width="20"></Icon>
      </Button>
      <button
        v-for="page in pagesArr"
        :key="page"
        @click="changePage(page)"
        :class="[{ active: currentPage == page }, 'page']"
      >
        {{ page }}
      </button>
      <Button @click="nextPage" class="arrow" :disabled="currentPage == this.totalPages">
        <Icon name="next" :height="20" :width="20"> </Icon>
      </Button>
    </div>
    <p v-if="gameHistory.length == 0" class="mt-double">No transactions found.</p>
    <transition name="fade">
      <loader v-if="(totalRecords && gameHistory && !gameHistory.length) || gameHistoryLoading" />
    </transition>
  </div>
</template>

<script>
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Loader from '@/components/molecules/Loader.vue';

export default {
  data() {
    return {
      gameHistoryDate: {
        startDate: null,
        endDate: null,
      },
      gameHistory: [],
      totalRecords: 0,
      gameHistoryLoading: false,
      currentPage: 1,
      perPage: 20,
    };
  },
  components: {
    FormInput,
    Button,
    Icon,
    Loader,
  },
  computed: {
    weekago() {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return date;
    },
    today() {
      return new Date();
    },
    offset() {
      return (this.currentPage - 1) * this.perPage;
    },
    totalPages() {
      return Math.ceil(this.totalRecords / this.perPage);
    },
    pagesArr() {
      const pagesArr = [];
      let first;
      let last;
      if (this.totalPages > 5) {
        if (this.currentPage === 1 || this.currentPage === 2) {
          // First
          first = 1;
          last = 5;
        } else if (this.currentPage === this.totalPages) {
          // Last
          first = this.currentPage - 4;
          last = this.currentPage;
        } else if (this.currentPage === this.totalPages - 1) {
          // Second to last
          first = this.currentPage - 3;
          last = this.currentPage + 1;
        } else {
          // Rest
          first = this.currentPage - 2;
          last = this.currentPage + 2;
        }
      } else {
        // Less than 5 pages
        first = 1;
        last = this.totalPages;
      }
      for (let i = first; i <= last; i += 1) {
        pagesArr.push(i);
      }
      return pagesArr;
    },
  },
  methods: {
    previousPage() {
      this.currentPage -= 1;
    },
    nextPage() {
      this.currentPage += 1;
    },
    changePage(page) {
      this.currentPage = page;
      const el = document.getElementById('game-history');
      el.scrollIntoView({ behavior: 'smooth' });
    },
    async updateGameHistory() {
      const startDate = new Date(this.gameHistoryDate.startDate);
      const endDate = new Date(this.gameHistoryDate.endDate);
      // Set end date to 23:59 to include entire day
      const endDateEnd = new Date(this.gameHistoryDate.endDate);
      endDateEnd.setHours(23, 59, 59, 999);
      if (startDate > endDate) {
        this.$noty.error('Start date has to be previous that end date');
      } else if (startDate > this.today || endDate > this.today) {
        this.$noty.error('Dates cannot be in the future');
      } else {
        const diff = this.getDiffDates(startDate, endDate);
        if (diff > 28) {
          this.$noty.error('A maximum date range of 28 days is allowed, please amend your dates.');
        } else {
          // await this.$store.dispatch('getGameHistory', { startDate: startDateFormatted, endDate: endDateFormatted });
          await this.getGameHistory({ startDate: this.gameHistoryDate.startDate, endDate: this.gameHistoryDate.endDate });
        }
      }
    },
    async getGameHistory(payload) {
      // this.gameHistory = [];
      this.gameHistoryLoading = true;
      const startDate = `${payload.startDate.toISOString().split('.')[0]}Z`;
      const endDate = `${payload.endDate.toISOString().split('.')[0]}Z`;
      await this.$apiToken
        .get('/getTransactionHistoryByCurrency?tranType="GAME_BET"&tranType="GAME_WIN"', {
          params: {
            startDateTime: startDate,
            endDateTime: endDate,
            currency: 'all',
            type: 'game',
            pageSize: this.perPage,
            pageNum: this.currentPage,
          },
        })
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            this.gameHistory = response.data.transactionList;
            this.totalRecords = response.data.totalRecords;
          }
        })
        .catch((error) => {
          this.$noty.error(error.message);
        })
        .finally(() => {
          this.gameHistoryLoading = false;
        });
    },
  },
  async created() {
    // Set range from 7 days ago to today
    this.gameHistoryDate.startDate = this.weekago;
    this.gameHistoryDate.endDate = this.today;
    // this.$store.dispatch('getGameHistory', this.gameHistoryDate);
    await this.getGameHistory(this.gameHistoryDate);
  },
  watch: {
    async currentPage(val) {
      if (val) {
        await this.getGameHistory(this.gameHistoryDate);
      }
    },
  },
  mixins: ['dateToString', 'getDiffDates'],
};
</script>
