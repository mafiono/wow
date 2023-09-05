import Vue from "vue";
import Vuex from "vuex";
import * as Auth from "./auth/auth";
import * as ForgotPassword from "./auth/forgotten-password";
import * as VerifyAccount from "./auth/verify-account";
import * as Player from "./profile/player";
import * as Games from "./games/games";
import * as Search from "./games/search";
import * as Providers from "./games/providers";
import * as Categories from "./games/categories";
import * as History from "./profile/history";
import * as Loader from "./loader/loader";
import * as Countries from "./countries/countries";
import * as ContactPreferences from "./profile/contact-preferences";
import * as GamblingControls from "./profile/gambling-controls";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // app settings
    endpoints: {
      api: process.env.VUE_APP_API_HOST,
      cms: process.env.VUE_APP_API_CMS,
      cmsNew: process.env.VUE_APP_API_CMSNEW,
    },
    enableWelcomePromo: process.env.VUE_APP_ENABLE_WELCOME_PROMO === "true",
  },
  getters: {
    endpointAPI: (state) => state.endpoints.api,
    endpointAPICMS: (state) => state.endpoints.cms,
    endpointAPICMSNEW: (state) => state.endpoints.cmsNew,
  },
  mutations: {},
  actions: {},
  modules: {
    Auth,
    Player,
    ForgotPassword,
    VerifyAccount,
    Games,
    Search,
    Providers,
    History,
    Categories,
    Loader,
    Countries,
    ContactPreferences,
    GamblingControls,
  },
});
