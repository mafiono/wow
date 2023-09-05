/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  validCountries: false,
  ipCountryInfo: false,
  blacklistStates: [
    "AS",
    "FM",
    "GU",
    "MH",
    "NV",
    "PW",
    "PR",
    "VI",
    "AA",
    "MP",
    "AE",
    "AP",
    "WA",
    "ID",
  ],
};
export const getters = {
  validCountries: (state) => state.validCountries,
  ipCountryInfo: (state) => state.ipCountryInfo,
  currentCountryCode: (state) =>
    typeof state.ipCountryInfo.countryInfo !== "undefined"
      ? state.ipCountryInfo.countryInfo.iso2Code
      : "",
  blacklistStates: (state) => state.blacklistStates,
};

export const mutations = {
  SET_VALID_COUNTRIES(state, payload) {
    state.validCountries = payload;
  },
  SET_CURRENT_COUNTRY(state, payload) {
    state.ipCountryInfo = payload;
  },
};

export const actions = {
  getCountries(context) {
    this.$api
      .get("/getCountries")
      .then((response) => {
        if (response.data) {
          context.commit("SET_VALID_COUNTRIES", response.data.countries);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  getCountryInfo(context) {
    // get country info based on req ip address
    this.$api
      .get("/getCountryInfo")
      .then((response) => {
        if (response.data) {
          context.commit("SET_CURRENT_COUNTRY", response.data);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
