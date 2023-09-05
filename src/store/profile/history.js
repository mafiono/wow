/* eslint-disable no-shadow */
import Vue from "vue";
import format from "date-fns/format";

export const state = {
  bonusHistory: null,
  depositHistory: null,
  withdrawalHistory: null,
  gameHistory: null,
};

export const getters = {
  bonusHistory: (state) => state.bonusHistory,
  depositHistory: (state) => state.depositHistory,
  withdrawalHistory: (state) => state.withdrawalHistory,
  gameHistory: (state) => state.gameHistory,
};

export const mutations = {
  SET_BONUS_HISTORY(state, payload) {
    state.bonusHistory = payload;
  },
  SET_DEPOSIT_HISTORY(state, payload) {
    state.depositHistory = payload;
  },
  SET_WITHDRAWAL_HISTORY(state, payload) {
    state.withdrawalHistory = payload;
  },
  SET_GAME_HISTORY(state, payload) {
    state.gameHistory = payload;
  },
};

export const actions = {
  async getBonusHistory(context, payload) {
    const datePlusOne = new Date(payload.endDate);
    datePlusOne.setDate(datePlusOne.getDate() + 1);
    const startDateFormatted = format(payload.startDate, "yyyy-MM-dd");
    const endDateFormatted = format(datePlusOne, "yyyy-MM-dd");
    await this.$apiToken
      .get("/getBonuses", {
        params: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
          currency: "all", // TODO: uncomment when  bonus description available
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          const { bonuses } = response.data;
          // const bonusHistory = bonuses.filter((bonus) => bonus.status !== 'CANCELLED' && bonus.triggerType !== 'DEPOSIT');
          const bonusHistory = bonuses.filter(
            (bonus) =>
              bonus.status !== "CANCELLED" &&
              bonus.description !== "internal" &&
              bonus.amountNumber !== 0
          ); // TODO: uncomment when  bonus description available
          bonusHistory.sort((a, b) => b.id - a.id);
          context.commit("SET_BONUS_HISTORY", bonusHistory);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async getDepositHistory(context, payload) {
    const startDateFormatted = format(payload.startDate, "yyyy-MM-dd");
    const endDateFormatted = format(payload.endDate, "yyyy-MM-dd");
    await this.$apiToken
      .get("/getBankingHistory", {
        params: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          const { histories } = response.data;
          const depositHistories = histories.filter(
            (history) => history.type === "DEPOSIT"
          );
          depositHistories.sort((a, b) => b.id - a.id);
          context.commit("SET_DEPOSIT_HISTORY", depositHistories);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async getWithdrawalHistory(context, payload) {
    const startDateFormatted = format(payload.startDate, "yyyy-MM-dd");
    const endDateFormatted = format(payload.endDate, "yyyy-MM-dd");
    await this.$apiToken
      .get("/getBankingHistory", {
        params: {
          startDate: startDateFormatted,
          endDate: endDateFormatted,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          const { histories } = response.data;
          const withdrawalHistories = histories.filter(
            (history) => history.type === "WITHDRAWAL"
          );
          withdrawalHistories.sort((a, b) => b.id - a.id);
          context.commit("SET_WITHDRAWAL_HISTORY", withdrawalHistories);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async getGameHistory(context, payload) {
    const startDate = `${payload.startDate.toISOString().split(".")[0]}Z`;
    const endDate = `${payload.endDate.toISOString().split(".")[0]}Z`;
    await this.$apiToken
      .get(
        '/getTransactionHistoryByCurrency?tranType="GAME_BET"&tranType="GAME_WIN"',
        {
          params: {
            startDateTime: startDate,
            endDateTime: endDate,
            currency: "all",
            type: "game",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          const gameHistory = response.data.transactionList;
          context.commit("SET_GAME_HISTORY", gameHistory);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
