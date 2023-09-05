/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  activeProviders: null,
};

export const getters = {
  activeProviders: (state) => state.activeProviders,
};

export const mutations = {
  SET_ACTIVE_PROVIDERS(state, payload) {
    state.activeProviders = payload;
  },
};

export const actions = {
  async getActiveProviders(context) {
    await this.$apiCmsNew
      .get(`/game_provider?filter[meta_value]=1&filter[meta_key]=isActive`, {
        params: {
          _embed: true,
        },
      })
      .then((response) => {
        if (response.data) {
          const providers = response.data;
          const providersSlugs = providers.map((provider) => provider.slug);
          context.commit("SET_ACTIVE_PROVIDERS", providersSlugs);
        } else {
          Vue.noty.error("Error while fetching games");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
