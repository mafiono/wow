/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
import Vue from "vue";
import { iso2ToIso3 } from "@/helpers/countryCodeConverter";
// import isAfter from 'date-fns/isAfter';
// import parseISO from 'date-fns/parseISO';
import { utcToZonedTime } from "date-fns-tz";
import { getDay, getDate, getMonth, getYear } from "date-fns";

export const state = {
  playerData: null,
  playerDataLoading: false,
  balance: null,
  isLoadingBalance: false,
  passwordChecked: null,
  currencyMode: "FUN", // Make fun default
  playerInfoUpdated: false,
  passwordUpdated: false,
  banners: [],
  lobbyBanners: [],
  balanceDropBanner: false,
  termsUpdate: {},
  reopenBonusCode: "",
};

const storeIfSweepAcc = localStorage.getItem("scType");
const acceptedUnlockLocal = localStorage.getItem("acceptedUnlock");

export const getters = {
  playerData: (state) => state.playerData,
  balance: (state) => state.balance,
  isLoadingBalance: (state) => state.isLoadingBalance,
  passwordChecked: (state) => state.passwordChecked,
  currencyMode: (state) => state.currencyMode,
  playerInfoUpdated: (state) => state.playerInfoUpdated,
  passwordUpdated: (state) => state.passwordUpdated,
  termsUpdate: (state) => state.termsUpdate,
  reopenBonusCode: (state) => state.reopenBonusCode,
  ageCheckerApiKey: () =>
    window.location.hostname === "localhost"
      ? "pcafkvQa0zpaqlMBc2wswQmfpnn7gOP0"
      : process.env.VUE_APP_AGECHECKER_API_KEY,
  lastClaimedDaily: (state) => {
    const lastClaimedDaily = state.playerData?.extraInfo.find(
      (element) => element.key === "lastClaimedDaily"
    );
    if (
      lastClaimedDaily &&
      lastClaimedDaily.value &&
      lastClaimedDaily.value !== "false"
    ) {
      return lastClaimedDaily.value;
    }
    return false;
  },
  lastClaimedAmoe: (state) => {
    const lastClaimedAmoe = state.playerData?.extraInfo.find(
      (element) => element.key === "lastClaimedAmoe"
    );
    if (
      lastClaimedAmoe &&
      lastClaimedAmoe.value &&
      lastClaimedAmoe.value !== "false"
    ) {
      return lastClaimedAmoe.value;
    }
    return false;
  },
  registeredAsSweep: (state) => {
    const partyID = state.playerData?.partyId;
    const whitelistIds = [
      "1000892", // test+2060 dev
      "1009483",
      "1008773",
      "1010365",
      "1008917",
      "1009301",
      "1009231",
      "1009225",
      "1010391",
      "1009041",
      "1011305",
      "1009771",
      "1006513",
      "1010119",
      "1010535",
      "1009419",
      "1011600",
      "1009395",
      "1009227",
      "1011119",
      "1009361",
      "1012240",
      "1012300",
      "1012574",
      "1008559",
      "1012510",
      "1007726",
      "1010641",
      "1011988",
      "1011383",
      "1012736",
      "1008621",
      "1009437",
      "1011754",
      "1012682",
      "1013644",
      "1011353",
      "1014508",
      "1010567",
      "1014750",
      "1011528",
      "1014946",
      "1014588",
      "1008617",
      "1013936",
      "1008989",
      "1000391",
      "1015210",
      "1015204",
      "1015330",
      "1015410",
      "1015910",
      "1011716",
      "1013990",
      "1015248",
      "1016474",
      "1016656",
      "1017234",
      "1016664",
      "1017422",
      "1009233",
      "1012108",
      "1018678",
      "1017150",
      "1012096",
      "1011031",
      "1001267",
      "1010869",
      "1021774",
      "1023007",
      "1023291",
      "1023615",
      "1023851",
      "1022360",
      "1024529",
      "1024832",
      "1024087",
      "1026476",
      "1025596",
      "1001117",
      "1028072",
      "1026482",
      "1026412",
      "1028754",
      "1028774",
      "1017516",
      "1031314",
      "1030124",
      "1032440",
      "1027324",
      "1024844",
      "1001231",
      "1031214",
      "1033960",
      "1000841",
      "1019592",
      "1019750",
      "1027966",
      "1033892",
      "1036340",
      "1036536",
      "1035366",
      "1037718",
      "1038196",
      "1030322",
      "1031100",
      "1039908",
      "1040242",
      "1040352",
      "1040810",
      "1000343",
      "1041326",
      "1040392",
      "1032388",
      "1028682",
      "1041812",
      "1030674",
      "1042166",
      "1042432",
      "1000725",
      "1044020",
      "1008593",
      "1045296",
      "1001095",
      "1038912",
      "1045961",
      "1019628",
      "1044090",
      "1040150",
      "1011662",
      "1044960",
      "1044300",
      "1045702",
      "1026224",
      "1038886",
      "1001121",
      "1049091",
      "1050773",
      "1050529",
      "1000527",
      "1038144",
      "1051603",
      "1021822",
      "1051055",
      "1032592",
      "1001715",
      "1021940",
      "1001083",
    ];
    if (partyID && whitelistIds.includes(partyID)) {
      return true;
    }

    const registeredAsSweep = state.playerData?.extraInfo.find(
      (element) => element.key === "registeredAsSweep"
    );
    if (
      registeredAsSweep &&
      registeredAsSweep.value &&
      registeredAsSweep.value !== "false"
    ) {
      return true;
    }
    return false;
  },
  sweepRulesNeedAccepting: (state, getters) => {
    if (
      getters.registeredAsSweep &&
      !getters.mobileNeedsVerification &&
      getters.mobileVerified &&
      !getters.acceptedSweepRules
    ) {
      return true;
    }
    return false;
  },
  acceptedSweepRules: (state) => {
    const acceptedSweepRules = state.playerData?.extraInfo.find(
      (element) => element.key === "acceptedSweepRules"
    );
    if (
      acceptedSweepRules &&
      acceptedSweepRules.value &&
      acceptedSweepRules.value !== "false"
    ) {
      return true;
    }
    return false;
  },
  acceptedUnlock: (state) => {
    const acceptedUnlock = state.playerData?.extraInfo.find(
      (element) => element.key === "acceptedUnlock"
    );
    if (
      acceptedUnlock &&
      acceptedUnlock.value &&
      acceptedUnlock.value !== "false"
    ) {
      return true;
    }
    return false;
  },
  nyFloridaSweepRulesReminderNeedAccepting: (state, getters) => {
    const nyFloridaReminderAccepted = state.playerData?.extraInfo.find(
      (element) => element.key === "nyFloridaReminderAccepted"
    );
    if (
      nyFloridaReminderAccepted &&
      nyFloridaReminderAccepted.value &&
      nyFloridaReminderAccepted.value === "true"
    ) {
      return false;
    }
    if (
      getters.acceptedSweepRules &&
      getters.registeredAsSweep &&
      getters.playerData.country === "US" &&
      (getters.playerData.province === "NY" ||
        getters.playerData.province === "FL")
    ) {
      return true;
    }
    return false;
  },
  mobileNeedsVerification: (state, getters) => {
    if (
      getters.registeredAsSweep &&
      !getters.mobileVerified &&
      !getters.sweep
    ) {
      return true;
    }
    return false;
  },
  mobileVerified: (state) => {
    const mobileVerified = state.playerData?.extraInfo.find(
      (element) => element.key === "mobileVerified"
    );
    if (
      mobileVerified &&
      mobileVerified.value &&
      mobileVerified.value !== "false"
    ) {
      return true;
    }
    return false;
  },
  ageNeedsVerification: (state) => {
    const ageNeedsVerification = state.playerData?.extraInfo.find(
      (element) => element.key === "ageNeedsVerification"
    );
    if (!ageNeedsVerification) {
      return "start";
    }
    if (
      ageNeedsVerification &&
      ageNeedsVerification.value &&
      ageNeedsVerification.value === "accepted"
    ) {
      return false;
    }
    if (ageNeedsVerification && ageNeedsVerification.value) {
      return ageNeedsVerification.value;
    }
    return true;
  },
  ageCheckerUuid: (state) => {
    const ageCheckerUuid = state.playerData?.extraInfo.find(
      (element) => element.key === "ageCheckerUuid"
    );
    if (
      ageCheckerUuid &&
      ageCheckerUuid.value &&
      ageCheckerUuid.value !== "false"
    ) {
      return ageCheckerUuid.value;
    }
    return false;
  },
  sweep: (state, getters) => {
    const allowCountries = ["US", "CA"];
    if (
      state.playerData?.registrationStatus === "PLAYER" &&
      !allowCountries.includes(state.playerData?.country)
    ) {
      return false;
    }
    if (
      getters.registeredAsSweep &&
      getters.acceptedSweepRules &&
      getters.mobileVerified
    ) {
      if (!storeIfSweepAcc) {
        localStorage.setItem("scType", 1);
      }
      return true;
    }
    return false;
  },
  showBanner: (state, getters) => {
    const sawBanner = state.playerData?.extraInfo.find(
      (element) => element.key === "sawBanner"
    );
    if (getters.sweep && state.banners && state.banners.length) {
      const banner =
        sawBanner && sawBanner.value
          ? state.banners[sawBanner.value]
          : state.banners[0];
      const bannerNo = sawBanner && sawBanner.value ? sawBanner.value : 0;
      if (banner) return { url: banner.banner_img, no: bannerNo };
    }
    if (
      getters.sweep &&
      !getters.playerData.madeDeposit &&
      state.balanceDropBanner &&
      !Vue.$cookies.get("bdrop")
    ) {
      if (
        getters.balance &&
        typeof getters.balance.totalBalance !== "undefined" &&
        parseFloat(getters.balance.totalBalance) === 0.0
      ) {
        return { url: state.balanceDropBanner, bdrop: true };
      }
    }

    // 10k FRIYEY BANNER
    const timeZone = "America/New_York"; // 'Europe/London'
    const currentETDate = utcToZonedTime(new Date(), timeZone);

    // Check if the current Eastern Time date meets the criteria
    if (
      getters.sweep &&
      !Vue.$cookies.get("anniversary") &&
      getDay(currentETDate) === 5 && // Friday
      getDate(currentETDate) === 25 && // 25th of the month
      getMonth(currentETDate) === 7 && // August (0-indexed, so 7 = August)
      getYear(currentETDate) === 2023 // Year 2023
    ) {
      return {
        url: "https://cdn2.wowvegas.com/assets/wow-vegas-10k-friyay-new-popup-1.jpg",
        anniversary: true,
      };
    }
    // last chance anniversary
    if (
      getters.sweep &&
      !Vue.$cookies.get("anniversary2") &&
      getDay(currentETDate) === 4 && // Thursday
      getDate(currentETDate) === 24 && // 24th of the month
      getMonth(currentETDate) === 7 && // August (0-indexed, so 7 = August)
      getYear(currentETDate) === 2023 // Year 2023
    ) {
      return {
        url: "https://cdn2.wowvegas.com/assets/popup-viva-wow-vegas-day-07-last-chance-1.png",
        anniversary2: true,
      };
    }
    // weekend banner
    // https://cdn2.wowvegas.com/assets/wow-weekender-new-popup.jpg banner should show up 1, 2 and 3 Septempber 2023 with cookie name banner-weekend
    if (
      getters.sweep &&
      !Vue.$cookies.get("banner-weekend") &&
      (getDate(currentETDate) === 1 ||
        getDate(currentETDate) === 2 ||
        getDate(currentETDate) === 3) && // 1st, 2nd and 3rd of the month
      getMonth(currentETDate) === 8 && // September (0-indexed, so 8 = September)
      getYear(currentETDate) === 2023 // Year 2023
    ) {
      return {
        url: "https://cdn2.wowvegas.com/assets/wow-weekender-new-popup.jpg",
        weekend: true,
      };
    }
    return false;
  },
  lobbyBanner: (state, getters) => {
    const banners = [];
    // const allSweepBanners = state.lobbyBanners?.filter((banner) => banner.condition === 'allSweep');
    if (!getters.playerData) {
      return banners;
    }
    if (state.lobbyBanners && state.lobbyBanners.length) {
      state.lobbyBanners.forEach((banner) => {
        if (banner.conditions.length) {
          let addBannerToArray = false;
          for (const condition of banner.conditions) {
            if (
              (condition === "madeDepositNo" &&
                getters.playerData.madeDeposit) ||
              (condition === "madeDepositYes" &&
                !getters.playerData.madeDeposit) ||
              (condition === "sweep" && !getters.sweep) ||
              (condition === "social" && getters.sweep) ||
              (condition === "statusQuickReg" &&
                getters.playerData.registrationStatus !== "QUICK_REG") ||
              (condition === "statusPlayer" &&
                getters.playerData.registrationStatus !== "PLAYER")
            ) {
              // console.log('condition', condition, false);
              addBannerToArray = false;
              break;
            }
            addBannerToArray = true;
          }
          if (addBannerToArray) {
            banners.push(banner);
          }
        }
      });
    }
    if (banners && banners.length) {
      return banners;
    }
    return false;
  },
  jackpotsLobbyBanner: (state, getters) => {
    const banners = [];
    if (!getters.playerData) {
      return banners;
    }
    if (state.lobbyBanners && state.lobbyBanners.length) {
      state.lobbyBanners.forEach((banner) => {
        if (banner.show_in_jackpots_lobby) {
          banners.push(banner);
        }
      });
    }
    if (banners && banners.length) {
      return banners;
    }
    return false;
  },
  ftpNotLobbyBanner: (state, getters) => {
    const banners = [];
    if (!getters.playerData) {
      return banners;
    }
    if (state.lobbyBanners && state.lobbyBanners.length) {
      state.lobbyBanners.forEach((banner) => {
        if (
          banner.conditions.includes("madeDepositNo") &&
          !getters.playerData.madeDeposit &&
          banner.conditions.includes("sweep") &&
          getters.sweep &&
          banner.conditions.includes("statusPlayer") &&
          getters.playerData.registrationStatus === "PLAYER"
        ) {
          banners.push(banner);
        }
      });
    }
    if (banners && banners.length) {
      return banners;
    }
    return false;
  },
  showRafModal: (state, getters) => {
    if (Vue.$cookies.get("swraf")) {
      return false;
    }
    const raf = state.playerData?.extraInfo.find(
      (element) => element.key === "raf"
    );
    if (raf && raf.value && raf.value === "false") {
      return false;
    }
    if (getters.sweep) {
      return true;
    }
    return false;
  },
  sumsubStatus: (state) => {
    // init - not started
    // applicant - created
    const sumsubStatus = state.playerData?.extraInfo.find(
      (element) => element.key === "sumsubStatus"
    );
    if (sumsubStatus && sumsubStatus.value && sumsubStatus.value !== "false") {
      return sumsubStatus.value;
    }
    return false;
  },
  sumSubEndpointCreateApplicant: () =>
    process.env.VUE_APP_API_CMSNEW.replace(
      "wp-json/wp/v2/",
      "wp-json/sumsub/v1/create-applicant"
    ),
};

export const mutations = {
  SET_PLAYERDATA(state, payload) {
    state.playerData = payload;
  },
  SET_PLAYERDATA_LOADING(state, payload) {
    state.playerDataLoading = payload;
  },
  SET_BALANCE(state, payload) {
    state.balance = payload;
  },
  SET_BALANCE_ISLOADING(state, payload) {
    state.isLoadingBalance = payload;
  },
  SET_PASSWORD_CHECKED(state, payload) {
    state.passwordChecked = payload;
  },
  SET_CURRENCY_MODE(state, payload) {
    if (payload === "REAL" || payload === "FUN") {
      state.currencyMode = payload;
    }
  },
  SET_PLAYER_INFO_UPDATED(state, payload) {
    state.playerInfoUpdated = payload;
  },
  SET_PASSWORD_UPDATED(state, payload) {
    state.passwordUpdated = payload;
  },
  SET_BANNERS(state, payload) {
    state.banners = payload;
  },
  SET_LOBBY_BANNERS(state, payload) {
    state.lobbyBanners = payload;
  },
  SET_BALANCE_DROP_BANNER(state, payload) {
    state.balanceDropBanner = payload;
  },
  SET_TERMS_UPDATE(state, payload) {
    state.termsUpdate = payload;
  },
  SET_REOPEN_BONUS_CODE(state, payload) {
    state.reopenBonusCode = payload;
  },
};

export const actions = {
  /* Calls about player and their balance */
  async getPlayerInfo(context) {
    if (context.state.playerDataLoading) {
      return;
    }
    context.commit("SET_PLAYERDATA_LOADING", true);
    await this.$apiToken
      .get("/getPlayerInfo")
      .then(async (response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_PLAYERDATA", response.data);
          context.dispatch("getAssociateAccounts");
          if (
            typeof response.data.partyId !== "undefined" &&
            response.data.partyId
          ) {
            const pid = localStorage.getItem("pid");
            if (!pid) {
              localStorage.setItem("pid", response.data.partyId);
            }
            if (!(context.getters.acceptedUnlock || acceptedUnlockLocal)) {
              context.dispatch("enableLoader");
              await context.dispatch("getReopen");
              context.dispatch("disableLoader");
            }
          }
        } else {
          // handleError.handleAPIstatusError(response.data.status, response.data.message, context);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      })
      .finally(() => {
        context.commit("SET_PLAYERDATA_LOADING", false);
      });
  },
  getBalance(context) {
    context.commit("SET_BALANCE_ISLOADING", true);
    this.$apiToken
      .get("/getBalance")
      .then((response) => {
        context.commit("SET_BALANCE_ISLOADING", false);
        if (response.data.status === "SUCCESS") {
          context.commit("SET_BALANCE", response.data);
        } else {
          // handleError.handleAPIstatusError(response.data.status, response.data.message, context);
        }
      })
      .catch((error) => {
        context.commit("SET_BALANCE_ISLOADING", false);
        Vue.noty.error(error.message);
      });
  },
  async checkPassword(context, payload) {
    const { username, password } = payload;
    await this.$api
      .get("/login", {
        params: {
          username,
          password,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          // Login successful
          console.log("success");
          context.commit("SET_PASSWORD_CHECKED", true);
        } else {
          context.commit("SET_PASSWORD_CHECKED", false);
        }
      })
      .catch((error) => {
        // Request failed
        Vue.noty.error(error.message);
      });
  },
  changePlayMode(context, payload) {
    context.commit("SET_CURRENCY_MODE", payload.mode);
    localStorage.setItem("currency_mode", payload.mode);
    if (payload.remember) {
      localStorage.setItem("remember_currency", true);
    }
  },
  async startAgeChecker(context) {
    const user = context.getters.playerData;
    const shortDate = user.birthDate.split(" ")[0].split("-");
    const year = shortDate[0];
    const month = shortDate[1];
    const day = shortDate[2];

    const agechecker = {
      key: context.getters.ageCheckerApiKey,
      data: {
        first_name: user.firstName,
        last_name: user.lastName,
        address: user.address,
        city: user.city,
        state: user.province, // 2 character state (or province if outside U.S.)
        zip: user.postalCode,
        country: user.country, // 2 character country ISO code
        dob_day: day,
        dob_month: month,
        dob_year: year,
      },
    };
    let ageCheckerUuid = "";
    await this.$http
      .post("https://api.agechecker.net/v1/create", agechecker)
      .then(async (response) => {
        console.log(response);
        // await this.$apiToken
        //   .get('/getPlayerInfo')
        //   .then((response) => {
        //     if (response.data.status === 'SUCCESS') {
        //       context.commit('SET_PLAYERDATA', response.data);
        //       context.dispatch('getAssociateAccounts');
        //     }
        //   });
        if (typeof response.data.uuid !== "undefined" && response.data.uuid) {
          ageCheckerUuid = response.data.uuid;
        }
        await context.dispatch("updateExtraInfo", {
          ageNeedsVerification: response.data.status,
          ageCheckerUuid,
          sumsubStatus: "init",
        });
      })
      .catch(async () => {
        await context.dispatch("updateExtraInfo", {
          ageNeedsVerification: "error",
        });
      });
  },
  async createSumsubApplicant(context, user) {
    if (context.getters.sumsubStatus !== "init") return;
    try {
      // On successful profile completion, create a Sumsub applicant
      const response = await this.$http.post(
        context.getters.sumSubEndpointCreateApplicant,
        {
          externalUserId: user.partyId,
          email: user.email,
          phone: user.mobilePhone,
          firstName: user.firstName,
          lastName: user.lastName,
          dob: user.birthDate,
          country: iso2ToIso3(user.country),
          gender: user.gender,
          addresses: [
            {
              country: iso2ToIso3(user.country),
              postCode: user.postalCode,
              town: user.city,
              street: user.address,
              state: user.province,
            },
          ],
        }
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Applicant created successfully");
        await context.dispatch("updateExtraInfo", {
          sumsubStatus: "applicant",
        });
      } else {
        await context.dispatch("updateExtraInfo", { sumsubStatus: "error" });
        console.error("Failed to create applicant");
      }
    } catch (error) {
      await context.dispatch("updateExtraInfo", { sumsubStatus: "error" });
      console.error("Error creating applicant:", error);
    }
  },
  async completeProfile(context, user) {
    await this.$apiToken
      .get("/quickSignupCompletion", {
        params: {
          firstName: user.firstName,
          lastName: user.lastName,
          birthDate: user.birthDate,
          address: user.address,
          city: user.city,
          postalCode: user.postalCode,
          country: user.country,
          province: user.province,
          mobile: user.mobilePhone,
          gender: user.gender,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.dispatch("getPlayerInfo");
          if (context.getters.registeredAsSweep) {
            context.dispatch("updateExtraInfo", {
              ageNeedsVerification: "start",
            });
          }
          context.commit("SET_PLAYER_INFO_UPDATED", true);
          return response.data.status;
        }
        if (response.data.status === "VALIDATION_FAIL") {
          let errorMessage; // eslint-disable-line no-unused-vars
          const message = "There was an error completing your profile. ";
          const firstError = response.data.errors[0];
          switch (firstError.error) {
            case "DUPLICATE":
              errorMessage = `Field ${firstError.field} is duplicated.`;
              break;
            case "INVALID_VALUE":
              errorMessage = `Field ${firstError.field} is invalid.`;
              break;
            case "INVALID_COUNTRY":
              errorMessage = `Invalid country.`;
              break;
            case "INVALID_LENGTH":
              errorMessage = `Length of field ${firstError.field} is invalid.`;
              break;
            default:
              errorMessage = `Field ${firstError.field} is invalid.`;
              break;
          }
          Vue.noty.error(message + errorMessage);
        } else {
          Vue.noty.error("There was an error completing your profile");
        }
        return false;
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
    return false;
  },
  async updateExtraInfo(context, extraInfo) {
    await this.$apiToken
      .get("/updateExtraInfo", {
        params: {
          extraInfo: JSON.stringify(extraInfo),
        },
      })
      .then(async (response) => {
        if (response.data.status === "SUCCESS") {
          await context.dispatch("getPlayerInfo");
        } else {
          Vue.noty.error(response.data.message);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async updatePlayerInfo(context, user) {
    await this.$apiToken
      .get("/updatePlayerInfo", {
        params: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthDate: user.birthDate,
          address: user.address,
          city: user.city,
          postalCode: user.postalCode,
          country: user.country,
          province: user.province,
          mobilePhone: user.mobilePhone,
          gender: user.gender,
        },
      })
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.dispatch("getPlayerInfo");
          context.commit("SET_PLAYER_INFO_UPDATED", true);
        } else {
          Vue.noty.error(response.data.message);
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async updatePassword(context, payload) {
    const userData = new FormData();
    userData.append("oldPassword", payload.oldPassword);
    userData.append("newPassword", payload.newPassword);
    await this.$apiToken
      .post("/updatePassword", userData)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          context.commit("SET_PASSWORD_UPDATED", true);
        } else {
          Vue.noty.error("Passoword cannot be updated");
        }
      })
      .catch((error) => {
        Vue.noty.error(error.message);
      });
  },
  async getBanners(context) {
    const result = await this.$apiCmsNew.get("/cashier");
    if (result.data.banners && result.data.banners.length) {
      context.commit("SET_BANNERS", result.data.banners);
      context.commit("SET_LOBBY_BANNERS", result.data.banners_lobby);
      context.commit(
        "SET_BALANCE_DROP_BANNER",
        result.data.balance_drop_banner
      );
    }
    if (result.data.terms_update) {
      context.commit("SET_TERMS_UPDATE", result.data.terms_update);
    }
  },
  async getReopen(context) {
    const reopenApiUrl = context.getters.endpointAPICMSNEW.replace(
      "wp-json/wp/v2/",
      `wp-json/custom-api/v1/reopen/${context.state.playerData?.partyId}`
    );
    const result = await this.$http(reopenApiUrl);
    if (result && result.data) {
      console.log(result.data);
      context.commit("SET_REOPEN_BONUS_CODE", result.data.bonusCode);
    }
  },
};
