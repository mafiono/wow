/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  personalDepositLimits: null,
  getLimitsError: null,
  setLimitsSucess: null,
};

export const getters = {
  personalLimit: (state) => state.personalDepositLimits,
  getLimitsError: (state) => state.getLimitsError,
  setLimitsSucess: (state) => state.setLimitsSucess,
};

export const mutations = {
  SET_PERSONAL_DEPOSIT_LIMITS(state, payload) {
    state.personalDepositLimits = payload;
  },
  SET_LIMITS_ERROR(state, payload) {
    state.getLimitsError = payload;
  },
  SET_LIMITS_SUCCESS(state, payload) {
    state.setLimitsSucess = payload;
  },
};

export const actions = {
  async getPersonalDepositLimits(context) {
    await this.$apiToken
      .get("/getPersonalDepositLimits")
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_PERSONAL_DEPOSIT_LIMITS", response.data);
        } else {
          context.commit("SET_LIMITS_ERROR", true);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async setPersonalDepositLimits(context, params) {
    await this.$apiToken
      .get("/setPersonalDepositLimits", { params })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_LIMITS_SUCCESS", true);
          // Upddate personal limits
          context.dispatch("getPersonalDepositLimits");
        } else {
          if (response.data?.message) {
            Vue.noty.error(response.data?.message);
          }
          console.log("fail");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async resetPersonalDepositLimits(context, params) {
    await this.$apiToken
      .get("/resetPersonalDepositLimits", { params })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_LIMITS_SUCCESS", true);
          // Upddate personal limits
          context.dispatch("getPersonalDepositLimits");
        } else {
          console.log("fail");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async timeoutPlayer(context, days) {
    await this.$apiToken
      .get("/lockPlayer", {
        params: {
          isPermanent: false,
          lockType: "TIMEOUT",
          lockPeriodUnit: "DAY",
          lockPeriod: days,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          Vue.noty.error("Your account been locked out temporarily.");
          context.dispatch("logout");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async permanentLock(context) {
    await this.$apiToken
      .get("/lockPlayer", {
        params: {
          isPermanent: true,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          Vue.noty.error("Your account has been locked out permanently.");
          context.dispatch("logout");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
