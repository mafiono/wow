import Vue from "vue";
// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faHeadset,
  faEnvelope,
  faStar,
  faUser,
  faBolt,
  faGamepad,
  faPlay,
  faUsers,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faFacebookMessenger,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Rollbar from "rollbar";
import axios from "axios";
import VueNoty from "vuejs-noty";
import EventBus from "@/helpers/EventBus";
import Vuelidate from "vuelidate";
import VueContentPlaceholders from "vue-content-placeholders";
import vueDebounce from "vue-debounce";
import VueCurrencyInput from "vue-currency-input";
import vueCountryRegionSelect from "vue-country-region-select";
import VueCookies from "@/helpers/cookies";

import App from "./App.vue";
import router from "./router";
import store from "./store";

// Import filters
import "@/helpers/filters";

Vue.config.productionTip = false;

// Font Awesome
library.add(
  faTimes,
  faHeadset,
  faFacebookF,
  faFacebookMessenger,
  faTwitter,
  faWhatsapp,
  faEnvelope,
  faStar,
  faUser,
  faBolt,
  faGamepad,
  faPlay,
  faUsers,
  faDice
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

// Vuelidate
Vue.use(Vuelidate);

// Vue Noty
Vue.use(VueNoty, {
  timeout: 3500,
  progressBar: true,
  killer: true,
  layout: "top",
});

// Vue ontent placeholder
Vue.use(VueContentPlaceholders);

// Vue Debounce
Vue.use(vueDebounce);

// Currency Input
const pluginOptions = { componentName: "MoneyInput" };
Vue.use(VueCurrencyInput, pluginOptions);

// Vue Region Country Select
Vue.use(vueCountryRegionSelect);

Vue.use(VueCookies);

// Use axios
const api = axios.create({
  baseURL: store.getters.endpointAPI,
});
const apiToken = axios.create({
  baseURL: store.getters.endpointAPI,
});
apiToken.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.params = { ...config.params, sessionKey: token };
  }
  return config;
});
const apiCms = axios.create({
  baseURL: store.getters.endpointAPICMS,
});
const apiCmsNew = axios.create({
  baseURL: store.getters.endpointAPICMSNEW,
});

Vue.prototype.$http = axios; // standard axios accessible via this.$http
Vue.prototype.$api = api; // axios with base URL accessible via this.$api
Vue.prototype.$apiToken = apiToken; // axios with base URL and TOKEN accessible this.$apiToken
Vue.prototype.$apiCms = apiCms;
Vue.prototype.$apiCmsNew = apiCmsNew;
store.$http = axios;
store.$api = api;
store.$apiToken = apiToken;
store.$apiCms = apiCms;
store.$apiCmsNew = apiCmsNew;
store.$router = router;

// Rollbar
const rollbarInstance = new Rollbar({
  accessToken: "2dbe869dcc2946d6bd3c6e95f59367d8",
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: window.location.hostname,
  },
});
if (window.location.hostname === "localhost") {
  rollbarInstance.configure({ enabled: false });
}
Vue.prototype.$rollbar = rollbarInstance;
// eslint-disable-next-line no-unused-vars
Vue.config.errorHandler = (err, vm, info) => {
  // eslint-disable-line no-unused-vars
  vm.$rollbar.error(err);
  throw err; // rethrow
};

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    EventBus.$on("auth-loggedout", () => {
      console.log("⛔️ LOGGED OUT");
      if (this.$route.name !== "LandingPage") {
        this.$router.push({ name: "LandingPage" }).catch(() => {});
      }
    });
  },
}).$mount("#app");
