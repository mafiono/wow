/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  accountVerified: null,
};

export const getters = {
  accountVerified: (state) => state.accountVerified,
};

export const mutations = {
  SET_ACC0UNT_VERIFIED(state, payload) {
    state.accountVerified = payload;
  },
};

export const actions = {
  async verifyAccount(context, payload) {
    const { verificationCode, verificationEmail } = payload;
    context.dispatch("enableLoader");
    await this.$api
      .get("/signupConfirmation", {
        params: {
          confirmationCode: verificationCode,
          email: verificationEmail,
        },
      })
      .then((response) => {
        const statusResults = ["SUCCESS", "DUPLICATES", "NOT_FOUND"];
        if (statusResults.includes(response.data.status)) {
          context.commit("SET_ACC0UNT_VERIFIED", response.data.status);
          if (typeof response.data.sessionKey !== "undefined") {
            // Login successful
            context.commit("SET_LOGIN_DATA", response.data);
            context.commit("SET_TOKEN", response.data.sessionKey);
            context.commit("SET_IS_AUTHENTICATED", true);
            localStorage.setItem("access_token", response.data.sessionKey);
            context.dispatch("getBalance");
            context.dispatch("getPlayerInfo");
            context.dispatch("getUserConsents");
          }
        } else {
          context.commit("SET_ACC0UNT_VERIFIED", "FAIL");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.dispatch("disableLoader");
      });
  },
};
