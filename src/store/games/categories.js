/* eslint-disable no-shadow */
// Categories and Featured Games
import Vue from "vue";

export const state = {
  categories: [],
  lobbyCategories: [],
  jackpotLobbyCategories: [],
  menuCategories: [],
  horizontalCategories: [],
  allFeaturedGames: [],
};

export const getters = {
  // Categories
  categories: (state) => state.categories,
  getCategoryBySlug: (state) => (catSlug) =>
    state.categories.find((cat) => cat.slug === catSlug),
  lobbyCategories: (state) => state.lobbyCategories,
  jackpotLobbyCategories: (state) => state.jackpotLobbyCategories,
  menuCategories: (state) => state.menuCategories,
  horizontalCategories: (state) => state.horizontalCategories,

  // Featured gamses
  allFeaturedGames: (state) => state.allFeaturedGames,
  featuredGamesByCategory: (state) => (catId) => {
    const catFeaturesGames = [];
    if (state && state.lobbyCategories) {
      // Find category
      const selectedCat = state.lobbyCategories.find((cat) => cat.id === catId);
      const featuredGames = selectedCat.featured_games;
      if (featuredGames) {
        featuredGames.forEach((gameCat) => {
          const game = state.allFeaturedGames.find(
            (game) => game.id === gameCat.ID
          );
          if (game) {
            catFeaturesGames.push(game);
          }
        });
      }
    }
    return catFeaturesGames;
  },
  jackpotsFeaturedGamesByCategory: (state) => (catId) => {
    const catFeaturesGames = [];
    if (state && state.jackpotLobbyCategories) {
      // Find category
      const selectedCat = state.jackpotLobbyCategories.find(
        (cat) => cat.id === catId
      );
      const featuredGames = selectedCat.featured_games;
      if (featuredGames) {
        featuredGames.forEach((gameCat) => {
          const game = state.allFeaturedGames.find(
            (game) => game.id === gameCat.ID
          );
          if (game) {
            catFeaturesGames.push(game);
          }
        });
      }
    }
    return catFeaturesGames;
  },
};

export const mutations = {
  SET_CATEGORIES(state, payload) {
    state.categories = payload;
  },
  SET_LOBBY_CATEGORIES(state, payload) {
    state.lobbyCategories = payload;
  },
  SET_JACKPOT_LOBBY_CATEGORIES(state, payload) {
    state.jackpotLobbyCategories = payload;
  },
  SET_MENU_CATEGORIES(state, payload) {
    state.menuCategories = payload;
  },
  SET_HORIZONTAL_CATEGORIES(state, payload) {
    state.horizontalCategories = payload;
  },
  SET_FEATURED_GAMES(state, payload) {
    state.allFeaturedGames = payload;
  },
};

export const actions = {
  getCategories(context) {
    return this.$apiCmsNew
      .get("/game_category", {
        params: {
          per_page: 100,
          _fields:
            "id,name,slug,content,show_in_menu,show_in_lobby,show_in_jackpots_lobby,show_in_horizontal_scroll_menu,featured_games,view_all_btn_text_overwrite,subtitle,count",
        },
      })
      .then((response) => {
        if (response.data) {
          const lobbyCategories = [];
          const jackpotsLobbyCategories = [];
          const menuCategories = [];
          const horizontalCategories = [];
          const featuredGamesIds = [];
          const categories = response.data;
          // Set Categories
          context.commit("SET_CATEGORIES", categories);
          // Set Used Categories and get Featured Games ids
          categories.forEach((cat) => {
            if (cat.show_in_lobby) {
              lobbyCategories.push(cat);
              if (cat.featured_games) {
                cat.featured_games.forEach((game) => {
                  featuredGamesIds.push(game.ID);
                });
              }
            }
            if (cat.show_in_jackpots_lobby) {
              jackpotsLobbyCategories.push(cat);
              if (cat.featured_games) {
                cat.featured_games.forEach((game) => {
                  featuredGamesIds.push(game.ID);
                });
              }
            }
            if (cat.show_in_menu) {
              menuCategories.push(cat);
            }
            if (cat.show_in_horizontal_scroll_menu) {
              horizontalCategories.push(cat);
            }
          });
          context.commit("SET_LOBBY_CATEGORIES", lobbyCategories);
          context.commit(
            "SET_JACKPOT_LOBBY_CATEGORIES",
            jackpotsLobbyCategories
          );
          context.commit("SET_MENU_CATEGORIES", menuCategories);
          context.commit("SET_HORIZONTAL_CATEGORIES", horizontalCategories);
          // Get Featured Games info
          const gameIds = `?include[]=${featuredGamesIds.join("&include[]=")}`;
          const total = featuredGamesIds.length;
          context.dispatch("getFeaturedGamesWithInfo", { gameIds, total });
        } else {
          Vue.noty.error("Error while fetching categories");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  getFeaturedGamesWithInfo(context, payload) {
    const { gameIds, total } = payload;
    return this.$apiCmsNew
      .get(`/game${gameIds}`, {
        params: {
          fields: "id,title,game_id,game_thumbnail_new",
          per_page: total,
        },
      })
      .then((response) => {
        const games = [];
        response.data.forEach((game) => {
          // Create new object for each game and change the name of the keys
          const { id, date } = game;
          let thumbnail = "";
          if (game.game_thumbnail_new?.sizes) {
            thumbnail = game.game_thumbnail_new?.sizes.medium;
          }
          const categories = [];
          if (game.game_category) {
            game.game_category.forEach((cate) => {
              categories.push(cate);
            });
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
          const modGame = {
            id,
            image: thumbnail,
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
        context.commit("SET_FEATURED_GAMES", games);
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
};
