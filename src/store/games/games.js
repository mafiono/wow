/* eslint-disable no-shadow */
import Vue from "vue";

export const state = {
  // favorite games
  favoriteGames: [],
  favoriteGamesWithInfo: [],
  favoriteGamesCount: 0,

  // Popular games in Lobby
  mostPopularGames: [],
  mostPopularGamesWithInfo: [],
  mostPopularGamesCount: 0,

  // Recently played games in Lobby
  recentlyPlayedGames: [],
  recentlyPlayedGamesWithInfo: [],
  recentlyPlayedGamesCount: 0,

  // Games in Category Page
  categoryGames: [],
  categoryGamesTotal: null,
  noGames: false,
};

export const getters = {
  // Popular games in Lobby
  favoriteGames: (state) => state.favoriteGames,
  favoriteGamesWithInfo: (state) => state.favoriteGamesWithInfo,
  favoriteGamesCount: (state) => state.favoriteGamesCount,

  // Popular games in Lobby
  mostPopularGamesWithInfo: (state) => state.mostPopularGamesWithInfo,
  mostPopularGamesCount: (state) => state.mostPopularGamesCount,

  // Recently played games in Lobby
  recentlyPlayedGamesWithInfo: (state) => state.recentlyPlayedGamesWithInfo,
  recentlyPlayedGamesCount: (state) => state.recentlyPlayedGamesCount,

  // Selected Category Games
  currentCategoryGames: (state) => state.categoryGames,
  categoryGamesTotal: (state) => state.categoryGamesTotal,
  noGames: (state) => state.noGames,
};

export const mutations = {
  // favorite games
  SET_FAVORITE_GAMES(state, payload) {
    state.favoriteGames = payload;
  },
  SET_FAVORITE_GAMES_INFO(state, payload) {
    state.favoriteGamesWithInfo = payload;
  },
  SET_FAVORITE_GAMES_COUNT(state, payload) {
    state.favoriteGamesCount = payload;
  },
  // Popular games
  SET_MOST_POPULAR_GAMES(state, payload) {
    state.mostPopularGames = payload;
  },
  SET_MOST_POPULAR_GAMES_INFO(state, payload) {
    state.mostPopularGamesWithInfo = payload;
  },
  SET_MOST_POPULAR_GAMES_COUNT(state, payload) {
    state.mostPopularGamesCount = payload;
  },
  // Recently played games
  SET_RECENTLY_PLAYED_GAMES(state, payload) {
    state.recentlyPlayedGames = payload;
  },
  SET_RECENTLY_PLAYED_GAMES_INFO(state, payload) {
    state.recentlyPlayedGamesWithInfo = payload;
  },
  SET_RECENTLY_PLAYED_GAMES_COUNT(state, payload) {
    state.recentlyPlayedGamesCount = payload;
  },
  // Category page
  SET_CATEGORY_GAMES(state, payload) {
    state.categoryGames = payload;
  },
  RESET_CATEGORY_GAMES(state) {
    state.categoryGames = [];
  },
  SET_CATEGORY_GAMES_TOTAL(state, payload) {
    state.categoryGamesTotal = payload;
  },
  NO_GAMES(state, payload) {
    state.noGames = payload;
  },
};

export const actions = {
  // your favorites
  getFavoriteGames(context) {
    this.$apiToken
      .get("/getFavoriteGames")
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_FAVORITE_GAMES", response.data.games);
          const games = [];
          if (response.data.games && response.data.games.length) {
            response.data.games.forEach((game) => {
              games.push(game.gameId);
            });
            context.dispatch("getFavoriteGamesWithInfo", games.join());
          } else {
            context.commit("SET_FAVORITE_GAMES_INFO", []);
            context.commit("SET_FAVORITE_GAMES_COUNT", 0);
            context.dispatch("disableLoader");
          }
        } else {
          console.log(response.data.status);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  getFavoriteGamesWithInfo(context, payload) {
    context.dispatch("enableLoader");
    this.$apiCmsNew
      .get(
        `/game?filter[meta_value]=${payload}&filter[meta_key]=game_id&filter[meta_compare]=IN`,
        {
          params: {
            fields:
              "id,title,game_id,game_provider,game_thumbnail_new,game_category,acf,_links",
            _embed: true,
            cc: context.getters.currentCountryCode,
            per_page: payload.split(",").length,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          console.log(response.headers["x-wp-total"]);
          if (response.headers["x-wp-total"]) {
            context.commit(
              "SET_FAVORITE_GAMES_COUNT",
              response.headers["x-wp-total"]
            );
          }
          // Create new object for each game and change the name of the keys
          const games = [];
          response.data.forEach((game) => {
            const { id, date } = game;
            let thumbnail = "";
            if (game.game_thumbnail_new?.sizes) {
              thumbnail = game.game_thumbnail_new?.sizes.medium;
            }
            let cat = "";
            if (game.game_category.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              cat = game.game_category[0];
            }
            let platform = "";
            let platformName = "";
            if (game.game_provider && game.game_provider.name) {
              platform = game.game_provider.slug;
              platformName = game.game_provider.name;
            }
            const gameSlug = game.slug;
            const gameId = game.game_id;
            const tableId = game.table_id;
            const name = game.title.rendered;
            games.push({
              id,
              image: thumbnail,
              category: cat,
              platform,
              gameId,
              gameSlug,
              tableId,
              name,
              platformName,
              date,
            });
          });
          context.commit("SET_FAVORITE_GAMES_INFO", games);
        } else {
          Vue.noty.error("Error while fetching games");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.dispatch("disableLoader");
      });
  },
  // Popular games
  getMostPopularGames(context) {
    context.dispatch("enableHardcoreLoader");
    this.$apiToken
      .get("/getMostPopularGames", {
        params: {
          size: 12,
          version: 2,
        },
      })
      .then(async (response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_MOST_POPULAR_GAMES", response.data.games);
          const games = [];
          response.data.games.forEach((game) => {
            games.push(game.gameId);
          });
          await context.dispatch("getMostPopularGamesWithInfo", games.join());
          context.dispatch("disableHardcoreLoader");
        } else {
          console.log(response.data.status);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.dispatch("disableHardcoreLoader");
      });
  },
  async getMostPopularGamesWithInfo(context, payload) {
    context.dispatch("enableLoader");
    await this.$apiCmsNew
      .get(
        `/game?filter[meta_value]=${payload}&filter[meta_key]=game_id&filter[meta_compare]=IN`,
        {
          params: {
            fields:
              "id,title,game_id,game_provider,game_thumbnail_new,game_category,acf,_links",
            _embed: true,
            cc: context.getters.currentCountryCode,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          console.log(response.headers["x-wp-total"]);
          if (response.headers["x-wp-total"]) {
            context.commit(
              "SET_MOST_POPULAR_GAMES_COUNT",
              response.headers["x-wp-total"]
            );
          }
          // Create new object for each game and change the name of the keys
          const games = [];
          response.data.forEach((game) => {
            const { id, date } = game;
            let thumbnail = "";
            if (game.game_thumbnail_new?.sizes) {
              thumbnail = game.game_thumbnail_new?.sizes.medium;
            }
            let cat = "";
            if (game.game_category.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              cat = game.game_category[0];
            }
            let platform = "";
            let platformName = "";
            if (game.game_provider && game.game_provider.name) {
              platform = game.game_provider.slug;
              platformName = game.game_provider.name;
            }
            const gameSlug = game.slug;
            const gameId = game.game_id;
            const tableId = game.table_id;
            const name = game.title.rendered;
            games.push({
              id,
              image: thumbnail,
              category: cat,
              platform,
              gameId,
              gameSlug,
              tableId,
              name,
              platformName,
              date,
            });
          });
          context.commit("SET_MOST_POPULAR_GAMES_INFO", games);
        } else {
          Vue.noty.error("Error while fetching games");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.dispatch("disableLoader");
      });
  },
  // Recently played
  getRecentlyPlayedGames(context) {
    this.$apiToken
      .get("/getRecentlyPlayed", {
        params: {
          size: 12,
          currency: "ALL",
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit(
            "SET_RECENTLY_PLAYED_GAMES",
            response.data.recentlyPlayed
          );
          const games = [];
          if (
            response.data.recentlyPlayed &&
            response.data.recentlyPlayed.length
          ) {
            response.data.recentlyPlayed.forEach((game) => {
              games.push(game.gameId);
            });
            context.dispatch("getRecentlyPlayedGamesWithInfo", games.join());
          }
        } else {
          console.log(response.data.status);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  getRecentlyPlayedGamesWithInfo(context, payload) {
    context.dispatch("enableLoader");
    this.$apiCmsNew
      .get(
        `/game?filter[meta_value]=${payload}&filter[meta_key]=game_id&filter[meta_compare]=IN`,
        {
          params: {
            fields:
              "id,title,game_id,game_provider,game_thumbnail_new,game_category,acf,_links",
            _embed: true,
            cc: context.getters.currentCountryCode,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          console.log(response.headers["x-wp-total"]);
          if (response.headers["x-wp-total"]) {
            context.commit(
              "SET_RECENTLY_PLAYED_GAMES_COUNT",
              response.headers["x-wp-total"]
            );
          }
          // Create new object for each game and change the name of the keys
          const games = [];
          response.data.forEach((game) => {
            const { id, date } = game;
            let thumbnail = "";
            if (game.game_thumbnail_new?.sizes) {
              thumbnail = game.game_thumbnail_new?.sizes.medium;
            }
            let cat = "";
            if (game.game_category.length > 0) {
              // eslint-disable-next-line prefer-destructuring
              cat = game.game_category[0];
            }
            let platform = "";
            let platformName = "";
            if (game.game_provider && game.game_provider.name) {
              platform = game.game_provider.slug;
              platformName = game.game_provider.name;
            }
            const gameSlug = game.slug;
            const gameId = game.game_id;
            const tableId = game.table_id;
            const name = game.title.rendered;
            games.push({
              id,
              image: thumbnail,
              category: cat,
              platform,
              gameId,
              gameSlug,
              tableId,
              name,
              platformName,
              date,
            });
          });
          context.commit("SET_RECENTLY_PLAYED_GAMES_INFO", games);
        } else {
          Vue.noty.error("Error while fetching games");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.dispatch("disableLoader");
      });
  },
  // Category games
  resetCategoryGames(context) {
    context.commit("RESET_CATEGORY_GAMES");
  },
  async getCategoryGames(context, payload) {
    const { category, page, perPage, bigloader = true } = payload;
    if (bigloader) {
      context.dispatch("enableLoader");
    }
    context.commit("NO_GAMES", false);
    // reset games if new page
    if (page === 1) {
      context.dispatch("resetCategoryGames");
    }

    // Get only games with active providers
    await context.dispatch("getActiveProviders");
    const providers = context.getters.activeProviders.join(",");

    await this.$apiCmsNew
      .get(
        `/game` +
          `?filter[game_category]=${category}` +
          `&filter[game_provider]=${providers}` +
          `&filter[orderby]=meta_value_num&filter[meta_key]=date_released&order=desc`,
        {
          params: {
            per_page: perPage,
            fields:
              "id,title,game_id,game_provider,game_thumbnail_new,game_category,acf,_links",
            _embed: true,
            page,
            cc: context.getters.currentCountryCode,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          if (response.data.length > 0) {
            // Create new object for each game and change the name of the keys
            if (page === 1) {
              context.dispatch("resetCategoryGames");
            }
            const games = [...state.categoryGames];
            response.data.forEach((game) => {
              const { id, date } = game;
              let thumbnail = "";
              if (game.game_thumbnail_new?.sizes) {
                thumbnail = game.game_thumbnail_new?.sizes.medium;
              }
              const cat = game.game_category[0];
              const categories = [];
              if (game.game_category) {
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
              games.push({
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
              });
            });
            // Set games and total
            context.commit("SET_CATEGORY_GAMES", games);
            const total = parseInt(response.headers["x-wp-total"], 10);
            context.commit("SET_CATEGORY_GAMES_TOTAL", total);
          } else {
            context.commit("NO_GAMES", true);
          }
        } else {
          Vue.noty.error("Error while fetching games");
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
