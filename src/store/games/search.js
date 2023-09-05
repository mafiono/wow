/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  // Search
  searchResults: [],
  searchReady: false,
  searchResultsTotal: null,
};

export const getters = {
  // Search
  searchResults: (state) => state.searchResults,
  searchReady: (state) => state.searchReady,
  searchResultsTotal: (state) => state.searchResultsTotal,
};

export const mutations = {
  // Search results
  SET_SEARCH_RESULTS(state, payload) {
    state.searchResults = payload;
  },
  SEARCH_READY(state, payload) {
    state.searchReady = payload;
  },
  SET_SEARCH_TOTAL(state, payload) {
    state.searchResultsTotal = payload;
  },
};

export const actions = {
  async searchGame(context, payload) {
    const { keyword, page } = payload;
    await this.$apiCmsNew
      .get(`/game?filter[s]=${keyword}`, {
        params: {
          fields:
            "id,title,game_id,game_provider,game_thumbnail_new,game_category,acf,_links",
          per_page: 15,
          page,
          cc: context.getters.currentCountryCode,
        },
      })
      .then((response) => {
        if (response.data) {
          const games = [...state.searchResults];
          response.data.forEach((game) => {
            // Create new object for each game and change the name of the keys
            const { id, date } = game;
            let thumbnail = "";
            if (game.game_thumbnail_new?.sizes) {
              thumbnail = game.game_thumbnail_new?.sizes.medium;
            }
            let cat = "";
            const categories = [];
            if (game.game_category[0]) {
              // eslint-disable-next-line prefer-destructuring
              cat = game.game_category[0];
              game.game_category.forEach((cate) => {
                categories.push(cate);
              });
            }
            const platform = game.game_provider.slug;
            const platformName = game.game_provider.name;
            const gameSlug = game.slug;
            const gameId = game.game_id;
            const tableId = game.table_id;
            const name = game.title.rendered;
            const modGame = {
              id,
              image: thumbnail,
              category: cat,
              categories,
              platform,
              gameId,
              gameSlug,
              tableId,
              name,
              platformName,
              date,
            };
            games.push(modGame);
          });
          const total = parseInt(response.headers["x-wp-total"], 10);
          context.commit("SET_SEARCH_RESULTS", games);
          context.commit("SEARCH_READY", true);
          context.commit("SET_SEARCH_TOTAL", total);
        } else {
          Vue.noty.error("Error while fetching games");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  resetSearch(context) {
    context.commit("SET_SEARCH_RESULTS", []);
    context.commit("SEARCH_READY", false);
  },
};
