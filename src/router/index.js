import Vue from "vue";
import VueRouter from "vue-router";
import LandingPage from "@/views/LandingPage.vue";
import EventBus from "../helpers/EventBus";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
    alias: ["/ppc", "/tw", "/go"],
    meta: {
      title: "WOW Vegas | The Best Free-Play Social Casino",
      hideNavbar: true,
      requiresAuth: "guest",
    },
  },
  {
    path: "/lobby",
    name: "Lobby",
    component: () =>
      import(/* webpackChunkName: "games" */ "../views/games/Lobby.vue"),
    meta: {
      title: "Lobby | WOW Vegas",
      buyCoins: true,
      requiresAuth: "yes",
    },
  },
  {
    path: "/prize-drops",
    name: "Jackpots",
    component: () =>
      import(/* webpackChunkName: "games" */ "../views/games/Jackpots.vue"),
    meta: {
      title: "Prize Drops | WOW Vegas",
      buyCoins: true,
      requiresAuth: "yes",
    },
  },
  {
    path: "/jackpots",
    redirect: { name: "Jackpots" },
  },
  {
    path: "/telegram",
    redirect: () => {
      window.location.href = "https://t.me/+VsrVuik8zPNiODJk";
      return "/redirecting"; // not important since redirecting
    }, // https://t.me/+VsrVuik8zPNiODJk
  },
  {
    path: "/activate-sc",
    name: "ActivateSweep",
    component: () =>
      import(/* webpackChunkName: "activate" */ "../views/ActivateSweep.vue"),
    meta: {
      title: "Activate Sweepstakes | WOW Vegas",
      requiresAuth: "yes",
      hideFooter: true,
    },
  },
  {
    path: "/play/:slug",
    name: "Play",
    component: () =>
      import(/* webpackChunkName: "games" */ "../views/games/Game.vue"),
    props: true,
    meta: {
      title: "Play | WOW Vegas",
      requiresAuth: "yes",
      hideFooter: true,
    },
  },
  {
    path: "/promotions",
    name: "Promotions",
    component: () =>
      import(
        /* webpackChunkName: "promo" */ "../views/promotions/Promotions.vue"
      ),
    meta: {
      title: "Promotions | WOW Vegas",
      requiresAuth: "yes",
      buyCoins: true,
    },
  },
  {
    path: "/promotions/:slug",
    name: "Promotion",
    component: () =>
      import(
        /* webpackChunkName: "promo" */ "../views/promotions/PromotionsSingle.vue"
      ),
    props: true,
    meta: {
      title: "Promotion Details | WOW Casino",
      requiresAuth: "yes",
      buyCoins: true,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/profile/Profile.vue"),
    meta: {
      title: "Profile | WOW Vegas",
      requiresAuth: "yes",
    },
    children: [
      {
        path: "/profile",
        name: "Profile",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "../views/profile/ProfileEdit.vue"
          ),
      },
      {
        path: "/profile/edit-profile",
        name: "Edit profile",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "../views/profile/ProfileEdit.vue"
          ),
        meta: {
          title: "Profile | Edit profile | WOW Vegas",
          requiresAuth: "yes",
          showWins: true,
        },
      },
      {
        path: "/profile/refer-a-friend",
        name: "RAF",
        component: () =>
          import(/* webpackChunkName: "profile" */ "../views/profile/RAF.vue"),
        meta: {
          title: "Refer a Friend | WOW Vegas",
          requiresAuth: "yes",
          showWins: true,
        },
      },
      {
        path: "/profile/vip",
        name: "VIP",
        component: () =>
          import(/* webpackChunkName: "profile" */ "../views/profile/VIP.vue"),
        meta: {
          title: "Star System VIP | WOW Vegas",
          requiresAuth: "yes",
          showWins: true,
        },
      },
      {
        path: "/profile/spending-controls",
        name: "Gambling Controls",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "../views/profile/ProfileGamblingControls.vue"
          ),
        meta: {
          title: "Profile | Spending Controls | WOW Vegas",
          requiresAuth: "yes",
          showWins: true,
        },
      },
      {
        path: "/profile/contact-preferences",
        name: "Contact Preferences",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "../views/profile/ProfileContactPreferences.vue"
          ),
        meta: {
          title: "Profile | Contact Preferences | WOW Vegas",
          requiresAuth: "yes",
          showWins: true,
        },
      },
      {
        path: "/profile/game-history",
        name: "GameHistory",
        component: () =>
          import(
            /* webpackChunkName: "history" */ "../views/profile/ProfileGameHistory.vue"
          ),
        meta: {
          title: "History | WOW Vegas",
          requiresAuth: "yes",
        },
      },
      {
        path: "/profile/transaction-history",
        name: "TransactionHistory",
        component: () =>
          import(
            /* webpackChunkName: "history" */ "../views/profile/ProfileTransactionHistory.vue"
          ),
        meta: {
          title: "History | WOW Vegas",
          requiresAuth: "yes",
        },
      },
      {
        path: "/profile/redemptions",
        name: "MyRedemptions",
        component: () =>
          import(
            /* webpackChunkName: "history" */ "../views/profile/ProfileRedemptionHistory.vue"
          ),
        meta: {
          title: "My Redemptions | WOW Vegas",
          requiresAuth: "yes",
        },
      },
    ],
  },
  {
    path: "/buy-coins",
    name: "BuyCoins",
    component: () =>
      import(
        /* webpackChunkName: "buyCoins" */ "../views/transactions/BuyCoins.vue"
      ),
    meta: {
      title: "Buy Coins | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/verify/identity",
    name: "Verify Identity",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/verify/Identity.vue"),
    meta: {
      title: "Verify Identity | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/withdrawal",
    redirect: { name: "Redeem" },
  },
  {
    path: "/redeem",
    name: "Redeem",
    component: () =>
      import(
        /* webpackChunkName: "buyCoins" */ "../views/transactions/Withdrawal.vue"
      ),
    meta: {
      title: "Redeem Coins | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/auth/Login.vue"),
    meta: {
      title: "Login | WOW Vegas",
      hideNavbar: true,
      hideFooter: true,
      requiresAuth: "guest",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/auth/Register.vue"),
    meta: {
      title: "Register | WOW Vegas",
      hideNavbar: true,
      hideFooter: true,
      requiresAuth: "guest",
    },
  },
  {
    path: "/confirmation",
    name: "Confirmation",
    component: () =>
      import(
        /* webpackChunkName: "auth" */ "../views/auth/SignUpConfirmation.vue"
      ),
    meta: {
      title: "Confirmation | WOW Vegas",
      hideNavbar: true,
      hideFooter: true,
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/auth/ForgotPassword.vue"),
    meta: {
      title: "Forgot password | WOW Vegas",
      requiresAuth: "guest",
      hideNavbar: true,
      hideFooter: true,
    },
  },
  {
    path: "/verify-account",
    name: "Verify Account",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/auth/VerifyAccount.vue"),
    meta: {
      title: "Verify account | WOW Vegas",
      requiresAuth: "guest",
      hideNavbar: true,
      hideFooter: true,
    },
  },
  {
    path: "/account-unverified",
    name: "Account Unverified",
    component: () =>
      import(
        /* webpackChunkName: "auth" */ "../views/auth/AccountUnverified.vue"
      ),
    meta: {
      title: "Account Unverified | WOW Vegas",
      requiresAuth: "guest",
      hideNavbar: true,
      hideFooter: true,
    },
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/PrivacyPolicy.vue"
      ),
    meta: {
      title: "Privacy Policy | WOW Vegas",
      requiresAuth: false,
    },
  },
  {
    path: "/terms-and-conditions",
    name: "Terms and Conditions",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/TermsAndConditions.vue"
      ),
    meta: {
      title: "Terms and Conditions | WOW Vegas",
      requiresAuth: false,
    },
  },
  {
    path: "/responsible-gaming",
    name: "Responsible Gaming",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/ResponsibleGaming.vue"
      ),
    meta: {
      title: "Responsible Social Gaming | WOW Vegas",
      requiresAuth: false,
    },
  },
  {
    path: "/about-us",
    name: "About Us",
    component: () =>
      import(/* webpackChunkName: "content" */ "../views/content/AboutUs.vue"),
    meta: {
      title: "About Us | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/contact-us",
    name: "Contact Us",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/ContactUs.vue"
      ),
    meta: {
      title: "Contact Us | WOW Vegas",
      requiresAuth: false,
    },
  },
  {
    path: "/sweep-rules",
    redirect: { name: "Sweepstakes Rules" },
  },
  {
    path: "/sweepstakes-rules",
    name: "Sweepstakes Rules",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/SweepRules.vue"
      ),
    meta: {
      title: "Sweepstakes Rules | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/partnersonly",
    name: "PartnersOnly",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/PartnersOnly.vue"
      ),
    meta: {
      title: "Partners | WOW Vegas",
      hideNavbar: true,
      requiresAuth: false,
    },
  },
  {
    path: "/faq",
    name: "FAQ",
    component: () =>
      import(/* webpackChunkName: "content" */ "../views/content/FAQ.vue"),
    meta: {
      title: "FAQ | WOW Vegas",
      requiresAuth: false,
    },
  },
  {
    path: "/payment-faq",
    name: "Payment FAQ",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/PaymentFAQ.vue"
      ),
    meta: {
      title: "Payment FAQ | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/verification-faq",
    name: "Verification FAQ",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/VerificationFAQ.vue"
      ),
    meta: {
      title: "Verification FAQ | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/star-system-faq",
    name: "Star System FAQ",
    component: () =>
      import(/* webpackChunkName: "content" */ "../views/content/VipFAQ.vue"),
    meta: {
      title: "Star System FAQ | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  {
    path: "/cali-privacy-policy",
    name: "Californian Privacy Laws",
    component: () =>
      import(
        /* webpackChunkName: "content" */ "../views/content/CalifornianPrivacyLaws.vue"
      ),
    meta: {
      title: "Californian Privacy Laws | WOW Vegas",
      requiresAuth: false,
    },
  },
  {
    path: "/amoe",
    name: "AMOE",
    component: () => import(/* webpackChunkName: "amoe" */ "../views/AMOE.vue"),
    meta: {
      title: "AMOE | WOW Vegas",
      requiresAuth: "yes",
    },
  },
  // email redirects
  {
    path: "/ps/pub/EmailLink.action",
    redirect: (to) => {
      // http://localhost:8080/ps/pub/EmailLink.action?type=reset&language=en&email=testingEUR%40wowcasino.com&confirmationCode=bd597324ad5ca4e09faba0cd78fe0a84
      // https://dev.wowcasino.com/ps/pub/EmailLink.action?type=confirm&language=en&email=cangaramo%2B02%40arenaentertainment.com&confirmationCode=48126e64419abd0c35bc264d5d8d4c05
      const { query } = to;
      if (query.type === "reset") {
        return {
          name: "Forgot Password",
        };
      }
      if (query.type === "confirm") {
        return {
          name: "Verify Account",
        };
      }
      if (query.type === "refer") {
        return {
          name: "Register",
          query: {
            referralId: query.referralId,
          },
        };
      }
      return {
        name: "404 Error",
      };
    },
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    component: () =>
      import(/* webpackChunkName: "error" */ "../views/error/Maintenance.vue"),
    meta: {
      title: "Maintenance | WOW Vegas",
      hideNavbar: true,
      hideFooter: true,
    },
  },
  {
    path: "*",
    name: "404 Error",
    component: () =>
      import(/* webpackChunkName: "error" */ "../views/error/ErrorPage.vue"),
    meta: {
      title: "404 Error",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  // Scroll top when navigating to a different url
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  store.dispatch("disableLoader");
  // affiliate cookies
  if (to.query.btag && !Vue.$cookies.get("affx")) {
    Vue.$cookies.set("affx", to.query.btag, "30d");
  }
  // gclid cookies
  // if (to.query.gclid && !Vue.$cookies.get('gclid')) {
  if (to.query.gclid) {
    let { gclid } = to.query;
    if (to.query.campaign) {
      gclid = `${to.query.campaign}-${gclid}`;
    }
    Vue.$cookies.set("gclid", gclid, "7d");
  }
  // /////// ** SEB TRACKER ** /////// //
  if ((to.path === "/ppc" || to.path === "/ppc/") && to.query.gclid) {
    const newBtagSeb = `a_26b_1c_${to.query.gclid}`;
    const pingAffLinkSeb = `https://wlwowvegas.adsrv.eacdn.com/C.ashx?btag=${newBtagSeb}&affid=13&siteid=26&adid=1&c=${to.query.gclid}`;
    Vue.$cookies.set("affx", newBtagSeb, "30d");
    const sebimg = document.createElement("img");
    sebimg.src = pingAffLinkSeb;
    sebimg.style.position = "absolute";
    sebimg.style.left = "-9999px";
    sebimg.style.opacity = "0";
    setTimeout(() => {
      const appElemSeb = document.getElementById("app");
      appElemSeb.appendChild(sebimg);
    }, 1000);
  }
  // utm_source=twitter&utm_medium=social&utm_campaign=XXXXXXXX
  // https://wlwowvegas.adsrv.eacdn.com/C.ashx?btag=a_115b_1c_&affid=24&siteid=115&adid=1&c=
  if (
    (to.query.utm_source === "twitter" &&
      (to.query.utm_medium === "social" || to.query.utm_medium === "cpc")) ||
    to.path === "/go" ||
    to.path === "/go/"
  ) {
    const newBtagSeb = `a_115b_1c_${to.query.utm_campaign}`;
    const pingAffLinkSeb = `https://wlwowvegas.adsrv.eacdn.com/C.ashx?btag=${newBtagSeb}&affid=24&siteid=115&adid=1&c=${to.query.utm_campaign}`;
    Vue.$cookies.set("affx", newBtagSeb, "30d");
    const sebimg = document.createElement("img");
    sebimg.src = pingAffLinkSeb;
    sebimg.style.position = "absolute";
    sebimg.style.left = "-9999px";
    sebimg.style.opacity = "0";
    setTimeout(() => {
      const appElemSeb = document.getElementById("app");
      appElemSeb.appendChild(sebimg);
    }, 1000);
  }
  if (to.query.raf) {
    const newBtag = `a_24b_1c_${to.query.raf}`;
    const pingAffLink = `https://wlwowvegas.adsrv.eacdn.com/C.ashx?btag=${newBtag}&affid=12&siteid=24&adid=1&c=${to.query.raf}`;
    Vue.$cookies.set("affx", newBtag, "30d");
    const affimg = document.createElement("img");
    affimg.src = pingAffLink;
    affimg.style.position = "absolute";
    affimg.style.left = "-9999px";
    affimg.style.opacity = "0";
    setTimeout(() => {
      const appElem = document.getElementById("app");
      appElem.appendChild(affimg);
    }, 1000);
  }

  // let browser remember that you have an account with us :)
  if (store.getters.isLoggedIn && !localStorage.signedInBefore) {
    localStorage.signedInBefore = "yes";
  }
  if (process.env.VUE_APP_ENABLE_CHAT === "false") {
    document.body.classList.add("hide-live-agent");
  }
  // close menu on route change
  EventBus.$emit("close-menu");
  EventBus.$emit("remove-no-scroll");
  if (store.getters.isLoggedIn) {
    // store.dispatch('getBalance');
  }
  if (localStorage.access_token && !store.getters.isLoggedIn) {
    await store.dispatch("checkSessionAlive");
    console.log(`loggedIn: ${store.getters.isLoggedIn}`);
  }
  if (to.meta.requiresAuth === "yes" && !store.getters.isLoggedIn) {
    return next({
      name: "Login",
      query: {
        redirect: to.fullPath,
      },
    });
  }
  if (
    from.meta.requiresAuth === "guest" &&
    from.name !== "Verify Account" &&
    to.name === "Login" &&
    to.query.redirect
  ) {
    return next({ name: "Login" });
  }
  if (to.meta.requiresAuth === "guest" && store.getters.isLoggedIn) {
    return next({ name: "Lobby" });
  }
  // Add title to document
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // styling helper classes (propably not gonna use them much, but good to have)
  document.body.className = "";
  document.documentElement.className = "";
  if (to.name) {
    document.body.classList.add(
      `page-${to.name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")}`
    );
    if (typeof to.meta.hideNavbar === "undefined") {
      document.body.classList.add("sticky-navbar");
    }
    document.documentElement.classList.add(
      `root-${to.name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")}`
    );
  }
  return next();
});

export default router;
