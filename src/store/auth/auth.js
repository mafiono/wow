/* eslint-disable no-shadow */
import Vue from "vue";
import EventBus from "@/helpers/EventBus";

export const state = {
  isAuthenticated: false,
  token: "",
  loginData: null,
  verificationEmail: null,
  verificationSent: null,
  associateAccounts: null,
};

export const getters = {
  verificationSent: (state) => state.verificationSent,
  verificationEmail: (state) => state.verificationEmail,
  isLoggedIn: (state) => {
    if (state.isAuthenticated && state.token) {
      return true;
    }
    return false;
  },
  token: (state) => state.token,
  associateAccounts: (state) => state.associateAccounts,
};

export const mutations = {
  SET_LOGIN_DATA(state, user) {
    state.loginData = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_IS_AUTHENTICATED(state, bool) {
    state.isAuthenticated = bool;
  },
  SET_VERIFICATION_EMAIL(state, string) {
    state.verificationEmail = string;
  },
  SET_VERIFICATION_SENT(state, bool) {
    state.verificationSent = bool;
  },
  SET_ASSOCIATE_ACCOUNTS(state, associateAccounts) {
    state.associateAccounts = associateAccounts;
  },
};

/* Auth calls: Login, register, logout and check session */
export const actions = {
  async login(context, payload) {
    const { user, password, router, redirect } = payload;
    const userData = new FormData();
    userData.append("username", user);
    userData.append("password", password);
    await this.$api
      .post("/login", userData)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          // Login successful
          window.dataLayer2.push({
            event: "login",
            loginMethod: "email",
          });
          context.commit("SET_LOGIN_DATA", response.data);
          context.commit("SET_TOKEN", response.data.sessionKey);
          context.commit("SET_IS_AUTHENTICATED", true);
          localStorage.setItem("access_token", response.data.sessionKey);
          context.dispatch("getBalance");
          context.dispatch("getPlayerInfo");
          context.dispatch("getUserConsents");
          if (redirect) {
            router.push(redirect);
          } else {
            router.push({ name: "Lobby" });
          }
        } else if (response.data.status === "FAIL_QUICK_OPEN_STATUS") {
          router.push({ name: "Account Unverified", params: { user } });
        } else if (response.data.status === "FAIL_TEMP_LOCK") {
          Vue.noty.error(
            `Your account has been temporarily locked. Please contact support for more information.`
          );
        } else if (response.data.status === "FAIL_PERM_LOCK") {
          Vue.noty.error(
            `Your account has been locked. Please contact support for more information.`
          );
        } else {
          Vue.noty.error(response.data.message);
        }
      })
      .catch((error) => {
        // Request failed
        Vue.noty.error(error.message);
      });
  },
  async register(context, payload) {
    const { user, router } = payload;
    const userData = new FormData();
    Object.keys(user).forEach((key) => {
      if (
        typeof user[key] === "object" &&
        user[key] !== null &&
        !Array.isArray(user[key])
      ) {
        userData.append(key, JSON.stringify(user[key]));
      } else {
        userData.append(key, user[key]);
      }
    });
    await this.$api
      .post("/quickSignup", userData)
      .then((response) => {
        let message = "Error while trying to create account";
        if (response.data.status === "SUCCESS") {
          // Sign up successful
          window.dataLayer2.push({
            event: "sign_up",
            signupMethod: "email",
          });
          context.commit("SET_VERIFICATION_EMAIL", user.email);
          context.commit("SET_VERIFICATION_SENT", true);
          router.push({
            name: "Confirmation",
            params: { username: user.username },
          });
          Vue.$cookies.set("swraf", true, "2d");
        } else if (response.data.status === "VALIDATION_FAIL") {
          // Validation fail
          const { errors } = response.data;
          if (errors.length > 0) {
            const err = errors[0];
            if (err.error === "DUPLICATE" && err.field === "username") {
              message =
                "Duplicated username. An account already exists with this username.";
            } else if (
              err.error === "INVALID_VALUE" &&
              err.field === "username"
            ) {
              message = "Invalid username.";
            } else if (err.error === "DUPLICATE" && err.field === "email") {
              message =
                "Duplicated email. An account already exists with this email.";
            } else if (err.field === "ipaddress") {
              message = "Invalid geographic location.";
            } else if (err.error === "PASSWORD_CONTAINS_USERNAME") {
              message = "Password can not contain username.";
            } else {
              message = "There was a problem creating a new account.";
            }
            Vue.noty.error(message);
          }
        } else {
          Vue.noty.error(message);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async logout(context) {
    context.dispatch("enableLoader");
    await this.$apiToken
      .get("/logout")
      .then(() => {
        context.commit("SET_LOGIN_DATA", null);
        context.commit("SET_TOKEN", null);
        if (localStorage.access_token) {
          localStorage.removeItem("access_token");
        }
        const pid = localStorage.getItem("pid");
        if (pid) {
          localStorage.removeItem("pid");
        }
        EventBus.$emit("auth-loggedout");
      })
      .catch((error) => {
        this.$noty.error(error.message);
      })
      .finally(() => {
        context.dispatch("disableLoader");
      });
  },
  async checkSessionAlive(context) {
    if (localStorage.access_token) {
      context.dispatch("enableLoader");
      context.commit("SET_TOKEN", localStorage.access_token);
      await this.$apiToken
        .get("/checkSessionAlive")
        .then((response) => {
          context.dispatch("disableLoader");
          if (response.data.alive === "true") {
            context.commit("SET_IS_AUTHENTICATED", true);
            context.dispatch("getBalance");
            context.dispatch("getPlayerInfo");
            context.dispatch("getUserConsents");
            if (localStorage.currency_mode) {
              context.commit("SET_CURRENCY_MODE", localStorage.currency_mode);
            }
          } else {
            context.dispatch("logout");
          }
        })
        .catch((error) => {
          context.dispatch("disableLoader");
          context.dispatch("logout");
          console.error(error.message || error); // TODO: Error handling
        });
    } else {
      context.dispatch("logout");
    }
  },
  async sendVerification(context, user) {
    const { username } = user;
    await this.$api
      .get("/resendVerificationCode", {
        params: {
          username,
          verificationTarget: "email",
          verificationType: "link",
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_VERIFICATION_SENT", true);
        }
      })
      .catch((error) => {
        this.$noty.error(error.message);
      });
  },
  async getAssociateAccounts(context) {
    await this.$apiToken
      .get("/getAssociateAccounts")
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit(
            "SET_ASSOCIATE_ACCOUNTS",
            response.data.associateAccounts
          );
        }
      })
      .catch((error) => {
        this.$noty.error(error.message);
      });
  },
};
