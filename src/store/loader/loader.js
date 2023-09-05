/* eslint-disable no-shadow */

export const state = {
  isLoading: false,
  isHardcoreLoading: false,
};

export const getters = {
  isLoading: (state) => state.isLoading,
  isHardcoreLoading: (state) => state.isHardcoreLoading,
};

export const mutations = {
  SET_LOADER_STATE(state, payload) {
    state.isLoading = payload;
  },
  SET_HARDCORE_LOADER_STATE(state, payload) {
    state.isHardcoreLoading = payload;
  },
};

export const actions = {
  enableLoader(context) {
    context.commit("SET_LOADER_STATE", true);
  },
  disableLoader(context) {
    context.commit("SET_LOADER_STATE", false);
  },
  enableHardcoreLoader(context) {
    context.commit("SET_HARDCORE_LOADER_STATE", true);
  },
  disableHardcoreLoader(context) {
    context.commit("SET_HARDCORE_LOADER_STATE", false);
  },
};
