/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  contactPrefUpdated: false,
  consents: null,
  userConsents: null,
  consentsLoading: false,
};
export const getters = {
  contactPrefUpdated: (state) => state.contactPrefUpdated,
  consents: (state) => state.consents,
  userConsents: (state) => state.userConsents,
  // Sweepstakes Rules
  sweepRulesConsentVersion: (state) => {
    const consentVersion = state.userConsents?.find(
      (element) => element.consent.key === "SWEEPSTAKES_RULES"
    );
    return consentVersion;
  },
  haveToAcceptNewSweepRules: (state, getters, rootState, rootGetters) => {
    const { sweep } = rootGetters;
    if (
      sweep &&
      getters.sweepRulesConsentVersion?.consentStatus === "NOT_CONSENTED"
    ) {
      return true;
    }
    return false;
  },
  // Terms and Conditions
  termsAndConditionsConsentVersion: (state) => {
    const consentVersion = state.userConsents?.find(
      (element) => element.consent.key === "TERMS_AND_CONDITIONS"
    );
    return consentVersion;
  },
  haveToAcceptNewTermsAndConditions: (state, getters) => {
    if (
      getters.termsAndConditionsConsentVersion?.consentStatus ===
      "NOT_CONSENTED"
    ) {
      return false; // true here TODO:
    }
    return false;
  },
};
// TERMS_AND_CONDITIONS
export const mutations = {
  SET_CONTACT_PREF_UPDATED(state, payload) {
    state.contactPrefUpdated = payload;
  },
  SET_CONSENTS(state, payload) {
    state.consents = payload;
  },
  SET_USER_CONSENTS(state, payload) {
    state.userConsents = payload;
  },
  SET_CONSENTS_LOADING(state, payload) {
    state.consentsLoading = payload;
  },
};

export const actions = {
  async contactPreferences(context, contactType) {
    await this.$apiToken
      .get("/user/contact/preference/save", {
        params: {
          contactPreference: contactType,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_CONTACT_PREF_UPDATED", true);
        } else {
          Vue.noty.error("There was an error");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async getConsents(context) {
    if (context.state.consentsLoading) {
      return;
    }
    context.commit("SET_CONSENTS_LOADING", true);
    await this.$api
      .get("/consents")
      .then((response) => {
        if (response.data.consents) {
          context.commit("SET_CONSENTS", response.data.consents);
        } else {
          Vue.noty.error("There was an error");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.commit("SET_CONSENTS_LOADING", false);
      });
  },
  async getUserConsents(context) {
    if (context.state.consentsLoading) {
      return;
    }
    context.commit("SET_CONSENTS_LOADING", true);
    await this.$apiToken
      .get("/user/consents")
      .then((response) => {
        if (response.data.userConsents) {
          context.commit("SET_USER_CONSENTS", response.data.userConsents);
        } else {
          Vue.noty.error("There was an error");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.commit("SET_CONSENTS_LOADING", false);
      });
  },
  async updateUserConsents(context, payload) {
    const { consentedVersions, unConsentedVersions } = payload;
    let payloadString = "?";
    if (consentedVersions && consentedVersions.length) {
      payloadString += `consentedVersions=${consentedVersions.join(
        "&consentedVersions="
      )}`;
    }
    if (unConsentedVersions && unConsentedVersions.length) {
      if (consentedVersions && consentedVersions.length) {
        payloadString += "&";
      }
      payloadString += `unConsentedVersions=${unConsentedVersions.join(
        "&unConsentedVersions="
      )}`;
    }
    if (payloadString === "?") {
      return;
    }
    await this.$apiToken
      .get(`/user/consents/save${payloadString}`)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.dispatch("getUserConsents");
          context.commit("SET_CONTACT_PREF_UPDATED", true);
        } else {
          Vue.noty.error("There was an error");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
