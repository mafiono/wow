/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  resetEmailSent: false,
  codeChecked: null,
  passwordChanged: false,
};

export const getters = {
  emailSent: (state) => state.resetEmailSent,
  codeChecked: (state) => state.codeChecked,
  passwordChanged: (state) => state.passwordChanged,
};

export const mutations = {
  SET_RESET_EMAIL_SENT(state, payload) {
    state.resetEmailSent = payload;
  },
  SET_CODE_CHECKED(state, payload) {
    state.codeChecked = payload;
  },
  SET_PASSWORD_CHANGED(state, payload) {
    state.passwordChanged = payload;
  },
};

export const actions = {
  async sendEmailToResetPassword(context, payload) {
    const { email } = payload;
    await this.$api
      .get("/forgotPasswordStep1And2", { params: { email } })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_RESET_EMAIL_SENT", true);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  checkResetKey(context, payload) {
    const { email, resetKey } = payload;
    this.$api
      .get("/forgotPasswordPreStep3", {
        params: {
          email,
          resetPasswordKey: resetKey,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_CODE_CHECKED", true);
        } else {
          context.commit("SET_CODE_CHECKED", false);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async resetPassword(context, payload) {
    const { email, resetKey, newPassword } = payload;
    await this.$api
      .get("/forgotPasswordStep3", {
        params: {
          email,
          resetPasswordKey: resetKey,
          newPassword,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_PASSWORD_CHANGED", true);
        } else {
          console.log("Validation fail");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
