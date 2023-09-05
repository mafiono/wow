<template>
  <section class="container lobby" :class="{ 'lobby-category' : currentCategorySlug }" :key="isSearch ? 's' : 'n'">
    <lobby-banner v-if="(!currentCategorySlug && lobbyBanner && lobbyBanner.length && !isSearch) || (sweep && ftpNotLobbyBanner && ftpNotLobbyBanner.length)" :key="`lbbanner-${lobbyBanner.length}-${currentCategorySlug}`"></lobby-banner>
    <div v-if="!isSearch" class="horizontal-menu-c">
      <horizontal-menu></horizontal-menu>
    </div>
    <!-- Search page -->
    <lobby-search v-if="!currentCategorySlug" :class="{ notActiveIsSearch: !isSearch }" @toggleShowSearchPage="toggleShowSearchPage($event)"></lobby-search>
    <!-- Main page -->
    <lobby-main v-if="!currentCategorySlug && !showSearchPage"></lobby-main>
    <!-- Single category page -->
    <lobby-single-category v-if="currentCategorySlug && !showSearchPage"></lobby-single-category>
    <unlocked-coins-modal v-if="showUnlockedCoinsModal"></unlocked-coins-modal>
  </section>
</template>

<script>
import LobbyBanner from '@/components/organisms/LobbyBanner.vue';
import LobbySearch from '@/components/organisms/LobbySearch.vue';
import LobbySingleCategory from '@/components/organisms/LobbySingleCategory.vue';
import LobbyMain from '@/components/organisms/LobbyMain.vue';
import UnlockedCoinsModal from '@/components/molecules/UnlockedCoinsModal.vue';
import HorizontalMenu from '@/components/organisms/HorizontalMenu.vue';

export default {
  data() {
    return {
      showSearchPage: false,
      showUnlockedCoinsModal: false,
      dailyLoginClaimed: false,
      didRunUriBonus: false,
    };
  },
  components: {
    LobbyBanner,
    LobbySearch,
    LobbySingleCategory,
    LobbyMain,
    UnlockedCoinsModal,
    HorizontalMenu,
  },
  computed: {
    currentCategorySlug() {
      return this.$route.query.category;
    },
    lobbyBanner() {
      return this.$store.getters.lobbyBanner;
    },
    ftpNotLobbyBanner() {
      return this.$store.getters.ftpNotLobbyBanner;
    },
    horizontalCategories() {
      return this.$store.getters.horizontalCategories;
    },
    playerData() {
      return this.$store.getters.playerData;
    },
    lastClaimedDaily() {
      return this.$store.getters.lastClaimedDaily;
    },
    sweep() {
      return this.$store.getters.sweep;
    },
    showDailyLoginBanner() {
      if (this.playerData && this.sweep && !this.dailyLoginClaimed && !this.isRegisteredToday(this.playerData.regDate) && (!this.lastClaimedDaily || !this.isInToday(this.lastClaimedDaily))) {
        return true;
      }
      return false;
    },
    uriBonus() {
      return this.$route.query.claimBonus;
    },
    isSearch() {
      return typeof this.$route.query.search !== 'undefined';
    },
  },
  methods: {
    toggleShowSearchPage(event) {
      this.showSearchPage = event;
    },
    isInToday(input) {
      const today = new Date();
      const inputDate = new Date(Number(input));
      if (today.setHours(0, 0, 0, 0) === inputDate.setHours(0, 0, 0, 0)) { return true; }
      return false;
    },
    isRegisteredToday(str) {
      const [date, time] = str.split(' ');
      const [day, month, year] = date.split('-');
      const regDateTime = new Date(`${year}-${month}-${day} ${time} GMT-0500`);
      if (this.isInToday(regDateTime.getMilliseconds())) {
        return true;
      }
      return false;
    },
    async closeDailyLoginBanner() {
      this.$store.dispatch('enableLoader');
      await this.$store.dispatch('updateExtraInfo', { lastClaimedDaily: Date.now() });
      this.$store.dispatch('disableLoader');
      this.dailyLoginClaimed = true;
    },
    async claimBonus(bonusCode) {
      // eslint-disable-next-line max-len
      const validBonuses = ['DLI2WOC', 'DLI3WOC', 'WOWBDAY22', 'DAY2', 'DAY3', 'WELCOMEBACK', 'COMPACK5', 'COMPACK10', '14032FREESC', '5COMP1304', '2COMP1304', '2COMP1704', '5COMP1704', '10COMP1804', '15COMP1804', '20COMP1904', '25COMP1904', 'LAPSED5', 'LAPSED2', 'REWARD15', 'REWARD50', 'REWARD100', 'REWARD200', '50SCREAC', '25SCREAC', '10SCREAC', '5SCREAC', '2SCREAC', '1SCREAC', 'RISINGMAY', 'BLUEMAY', 'BRONZEMAY', 'SILVERMAY', 'GOLDMAY', '1REAC06', '5REAC06', '10REAC06', '20REAC06', '30REAC06', '3SOCIAL10', 'RISINGJUNE', 'BLUEJUNE', 'BRONZEJUNE', 'SILVERJUNE', 'GOLDJUNE', 'HOSTEDJUNE50', 'HOSTEDJUNE100', 'HOSTEDJUNE150', 'HOSTEDJUNE200', '1REAC5J', '2REAC5J', '5REAC5J', '10REAC5J', '25REAC5J', '50REAC5J', '1COMP14J', '2COMP14J', '5COMP14J', '10COMP14J', '25COMP14J', '50COMP14J', '1COMP20J', '2COMP20J', '3COMP20J', '5COMP20J', '10COMP20J', '2COMP27J', '5COMP27J', '10COMP27J', '15COMP27J', '25COMP27J', '50COMP27J', '1COMP31J', '5COMP31J', '10COMP31J', '15COMP31J', '25COMP31J', '1REAC3A', '2REAC3A', '5REAC3A', '10REAC3A', '20REAC3A', '50REAC3A', '3SOCIAL02',
        '1COMP17A', '2COMP17A', '5COMP17A', '10COMP17A', '20COMP17A', '50COMP17A',
        '1REAC23A', '2REAC23A', '5REAC23A', '10REAC23A', '20REAC23A', '50REAC23A', '100REAC23A',
        '1COMP24A', '2COMP24A', '5COMP24A', '10COMP24A', '20COMP24A', '50COMP24A',
        '1COMP30A', '5COMP30A', '10COMP30A', '15COMP30A', '20COMP30A',
        '1SCCOMP3108', '5SCCOMP3108', '10SCCOMP3108',
      ];
      if (!validBonuses.includes(bonusCode)) {
        return;
      }
      this.$store.dispatch('enableLoader');
      this.$apiToken
        .get('/redeemBonus', {
          params: {
            bonusCode,
          },
        })
        .then((response) => {
          if (response.data.status === 'SUCCESS') {
            this.$store.dispatch('getBalance');
            if (bonusCode === 'DLI2WOC') {
              this.$noty.error('Success! We just added SC 2 and 2500 WOW Coins to your account.');
            } else if (bonusCode === 'DLI3WOC') {
              this.$noty.error('Success! We just added SC 3 and 1000 WOW Coins to your account.');
            } else if (bonusCode === 'DAY2') {
              this.$noty.error('Success! We just added SC 1.5 and 2500 WOW Coins to your account.');
            } else if (bonusCode === 'DAY3') {
              this.$noty.error('Success! We just added SC 2 and 1000 WOW Coins to your account.');
            } else if (bonusCode === 'DAILY') {
              this.$noty.error('Success! We just added SC 0.3 and 5000 WOW Coins to your account.');
            } else if (bonusCode === 'WOWBDAY22') {
              this.$noty.error('Happy Birthday! We just added SC 5 to your account.');
            } else if (bonusCode === 'WELCOMEBACK') {
              this.$noty.error('Welcome back! We just added SC 5 to your account.');
            } else if (bonusCode === 'COMPACK5') {
              this.$noty.error('Success! We just added a $4.99 complementary coin pack to your account');
            } else if (bonusCode === 'COMPACK10') {
              this.$noty.error('Success! We just added a $9.99 complementary coin pack to your account');
            } else if (bonusCode === '14032FREESC') {
              this.$noty.error('Success! We just added SC 2 to your account.');
            } else if (bonusCode === '5COMP1304') {
              this.$noty.error('Success! We just added SC 5 to your account.');
            } else if (bonusCode === '2COMP1304') {
              this.$noty.error('Success! We just added SC 2 to your account.');
            } else if (bonusCode === '5COMP1704') {
              this.$noty.error('Success! We just added SC 5 to your account.');
            } else if (bonusCode === '2COMP1704') {
              this.$noty.error('Success! We just added SC 2 to your account.');
            } else if (bonusCode === '10COMP1804') {
              this.$noty.error('Success! We just added SC 10 to your account.');
            } else if (bonusCode === '15COMP1804') {
              this.$noty.error('Success! We just added SC 15 to your account.');
            } else if (bonusCode === '20COMP1904') {
              this.$noty.error('Success! We just added SC 20 to your account.');
            } else if (bonusCode === '25COMP1904') {
              this.$noty.error('Success! We just added SC 25 to your account.');
            } else if (bonusCode === 'LAPSED5') {
              this.$noty.error('Success! We just added SC 5 to your account.');
            } else if (bonusCode === 'LAPSED2') {
              this.$noty.error('Success! We just added SC 2 to your account.');
            } else if (bonusCode === 'REWARD15') {
              this.$noty.error('Success! We just added SC 3.00 and 15,000.00 WOW Coins to your account.');
            } else if (bonusCode === 'REWARD35') {
              this.$noty.error('Success! We just added SC 3.50 and 35,000.00 WOW Coins to your account.');
            } else if (bonusCode === 'REWARD70') {
              this.$noty.error('Success! We just added SC 7.00 and 70,000.00 WOW Coins to your account.');
            } else if (bonusCode === 'REWARD140') {
              this.$noty.error('Success! We just added SC 17.50 and 140,000 WOW Coins to your account.');
            } else if (bonusCode === 'REWARD50') {
              this.$noty.error('Success! We just added SC 5 and 50,000 WOW Coins to your account.');
            } else if (bonusCode === 'REWARD100') {
              this.$noty.error('Success! We just added SC 10 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === 'REWARD200') {
              this.$noty.error('Success! We just added SC 25 and 200,000 WOW Coins to your account.');
            } else if (bonusCode === '50SCREAC') {
              this.$noty.error('Success! We just added SC 50 and 3,000,000 WOW Coins to your account.');
            } else if (bonusCode === '25SCREAC') {
              this.$noty.error('Success! We just added SC 25 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '10SCREAC') {
              this.$noty.error('Success! We just added SC 10 and 500,000 WOW Coins to your account.');
            } else if (bonusCode === '5SCREAC') {
              this.$noty.error('Success! We just added SC 5 and 250,000 WOW Coins to your account.');
            } else if (bonusCode === '2SCREAC') {
              this.$noty.error('Success! We just added SC 2 and 50,000 WOW Coins to your account.');
            } else if (bonusCode === '1SCREAC') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === 'RISINGMAY') {
              this.$noty.error('Success! We just added SC 1 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === 'BLUEMAY') {
              this.$noty.error('Success! We just added SC 5 and 312,000 WOW Coins to your account.');
            } else if (bonusCode === 'BRONZEMAY') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === 'SILVERMAY') {
              this.$noty.error('Success! We just added SC 15 and 1,000,000 WOW Coins to your account.');
            } else if (bonusCode === 'GOLDMAY') {
              this.$noty.error('Success! We just added SC 25 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '1REAC06') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '5REAC06') {
              this.$noty.error('Success! We just added SC 5 and 250,000 WOW Coins to your account.');
            } else if (bonusCode === '10REAC06') {
              this.$noty.error('Success! We just added SC 10 and 500,000 WOW Coins to your account.');
            } else if (bonusCode === '20REAC06') {
              this.$noty.error('Success! We just added SC 20 and 1,000,000 WOW Coins to your account.');
            } else if (bonusCode === '30REAC06') {
              this.$noty.error('Success! We just added SC 30 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '3SOCIAL10') {
              this.$noty.error('Success! We just added SC 3 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === 'RISINGJUNE') {
              this.$noty.error('Success! We just added SC 1 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === 'BLUEJUNE') {
              this.$noty.error('Success! We just added SC 5 and 312,000 WOW Coins to your account.');
            } else if (bonusCode === 'BRONZEJUNE') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === 'SILVERJUNE') {
              this.$noty.error('Success! We just added SC 15 and 1,000,000 WOW Coins to your account.');
            } else if (bonusCode === 'GOLDJUNE') {
              this.$noty.error('Success! We just added SC 25 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === 'HOSTEDJUNE50') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === 'HOSTEDJUNE100') {
              this.$noty.error('Success! We just added SC 100 and 6,250,000 WOW Coins to your account.');
            } else if (bonusCode === 'HOSTEDJUNE150') {
              this.$noty.error('Success! We just added SC 150 and 9,250,000 WOW Coins to your account.');
            } else if (bonusCode === 'HOSTEDJUNE200') {
              this.$noty.error('Success! We just added SC 200 and 12,500,000 WOW Coins to your account.');
            } else if (bonusCode === '1REAC5J') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2REAC5J') {
              this.$noty.error('Success! We just added SC 2 and 50,000 WOW Coins to your account.');
            } else if (bonusCode === '5REAC5J') {
              this.$noty.error('Success! We just added SC 5 and 312,000 WOW Coins to your account.');
            } else if (bonusCode === '10REAC5J') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '25REAC5J') {
              this.$noty.error('Success! We just added SC 25 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '50REAC5J') {
              this.$noty.error('Success! We just added SC 50 and 3,700,000 WOW Coins to your account.');
            } else if (bonusCode === '1COMP14J') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2COMP14J') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '5COMP14J') {
              this.$noty.error('Success! We just added SC 5 and 312,000 WOW Coins to your account.');
            } else if (bonusCode === '10COMP14J') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '25COMP14J') {
              this.$noty.error('Success! We just added SC 25 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '50COMP14J') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '1COMP20J') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2COMP20J') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '3COMP20J') {
              this.$noty.error('Success! We just added SC 3 and 250,000 WOW Coins to your account.');
            } else if (bonusCode === '5COMP20J') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10COMP20J') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '2COMP27J') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '5COMP27J') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10COMP27J') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '15COMP27J') {
              this.$noty.error('Success! We just added SC 15 and 1,100,000 WOW Coins to your account.');
            } else if (bonusCode === '25COMP27J') {
              this.$noty.error('Success! We just added SC 25 and 1,750,000 WOW Coins to your account.');
            } else if (bonusCode === '50COMP27J') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '1COMP31J') {
              this.$noty.error('Success! We just added SC 1 and 7,500 WOW Coins to your account.');
            } else if (bonusCode === '5COMP31J') {
              this.$noty.error('Success! We just added SC 5 and 262,500 WOW Coins to your account.');
            } else if (bonusCode === '10COMP31J') {
              this.$noty.error('Success! We just added SC 10 and 550,000 WOW Coins to your account.');
            } else if (bonusCode === '15COMP31J') {
              this.$noty.error('Success! We just added SC 15 and 1,000,000 WOW Coins to your account.');
            } else if (bonusCode === '25COMP31J') {
              this.$noty.error('Success! We just added SC 25 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '1REAC3A') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2REAC3A') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '5REAC3A') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10REAC3A') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '20REAC3A') {
              this.$noty.error('Success! We just added SC 20 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '50REAC3A') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '3SOCIAL02') {
              this.$noty.error('Success! We just added SC 3 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '1COMP17A') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2COMP17A') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '5COMP17A') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10COMP17A') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '20COMP17A') {
              this.$noty.error('Success! We just added SC 20 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '50COMP17A') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '1REAC23A') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2REAC23A') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '5REAC23A') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10REAC23A') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '20REAC23A') {
              this.$noty.error('Success! We just added SC 20 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '50REAC23A') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '100REAC23A') {
              this.$noty.error('Success! We just added SC 100 and 6,250,000 WOW Coins to your account.');
            } else if (bonusCode === '1COMP24A') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '2COMP24A') {
              this.$noty.error('Success! We just added SC 2 and 100,000 WOW Coins to your account.');
            } else if (bonusCode === '5COMP24A') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10COMP24A') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            } else if (bonusCode === '20COMP24A') {
              this.$noty.error('Success! We just added SC 20 and 1,500,000 WOW Coins to your account.');
            } else if (bonusCode === '50COMP24A') {
              this.$noty.error('Success! We just added SC 50 and 3,750,000 WOW Coins to your account.');
            } else if (bonusCode === '1COMP30A') {
              this.$noty.error('Success! We just added SC 1 and 7,500 WOW Coins to your account.');
            } else if (bonusCode === '5COMP30A') {
              this.$noty.error('Success! We just added SC 5 and 262,500 WOW Coins to your account.');
            } else if (bonusCode === '10COMP30A') {
              this.$noty.error('Success! We just added SC 10 and 550,000 WOW Coins to your account.');
            } else if (bonusCode === '15COMP30A') {
              this.$noty.error('Success! We just added SC 15 and 1,000,000 WOW Coins to your account.');
            } else if (bonusCode === '20COMP30A') {
              this.$noty.error('Success! We just added SC 20 and 1,200,000 WOW Coins to your account.');
            } else if (bonusCode === '1SCCOMP3108') {
              this.$noty.error('Success! We just added SC 1 and 10,000 WOW Coins to your account.');
            } else if (bonusCode === '5SCCOMP3108') {
              this.$noty.error('Success! We just added SC 5 and 312,500 WOW Coins to your account.');
            } else if (bonusCode === '10SCCOMP3108') {
              this.$noty.error('Success! We just added SC 10 and 625,000 WOW Coins to your account.');
            }
          } else if (bonusCode === 'DAILY') {
            this.$noty.error('Sorry. You can only claim this bonus once a day. Please allow 24 hours between claims.');
          } else if (bonusCode === 'WELCOMEBACK') {
            this.$noty.error('Invalid bonus code. Please contact support.');
          } else {
            this.$noty.error('Sorry. You can claim this bonus once / invalid bonus code.');
          }
        })
        .catch((error) => {
          this.$noty.error(error.message);
        })
        .finally(async () => {
          this.$store.dispatch('disableLoader');
          this.$router.replace({ query: null });
        });
    },
    checkUriBonus() {
      if (this.uriBonus && this.playerData && !this.didRunUriBonus) {
        this.claimBonus(this.uriBonus);
        this.didRunUriBonus = true;
      }
    },
    ga4purchase(orderId, currentBundle) {
      let bundleDescription = `${currentBundle.free_coins_amount} WOW Coins`;
      if (currentBundle.sweep_coins_amount && currentBundle.sweep_coins_amount !== '0') {
        bundleDescription += ` + ${currentBundle.sweep_coins_amount} SC`;
      }
      const wasFtdPurchase = sessionStorage.getItem('wasFtdPurchase');
      if (wasFtdPurchase) {
        window.dataLayer2.push({
          event: 'ftp',
        });
      }
      if (wasFtdPurchase && currentBundle.price > 9) {
        window.dataLayer2.push({
          event: 'ftp10',
        });
      }
      sessionStorage.removeItem('wasFtdPurchase');
      window.dataLayer2.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer2.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: orderId,
          value: currentBundle.price,
          currency: 'USD',
          items: [
            {
              item_id: currentBundle.bonus_id,
              item_name: bundleDescription,
              currency: 'USD',
              price: currentBundle.price,
            },
          ],
        },
      });
    },
  },
  async created() {
    this.showUnlockedCoinsModal = this.$route.params.unlock;
    this.checkUriBonus();
    if (this.$route.query.orderId) {
      if (!this.$route.query.gahandled) {
        const currentBundle = sessionStorage.getItem('currentBundle');
        this.ga4purchase(this.$route.query.orderId, JSON.parse(currentBundle));
        sessionStorage.removeItem('currentBundle');
      }
      this.$noty.error('Your purchase was successful.');
      this.$router.replace({
        query: {},
      });
    }
  },
  watch: {
    // playerData is not ready when mounted (when user enters page directly from url)
    playerData(playerDataReady, oldPlayerData) {
      if (playerDataReady && !oldPlayerData) {
        this.checkUriBonus();
      }
    },
    isSearch(value) {
      if (value) {
        // this.showSearchPage = true;
      } else {
        this.showSearchPage = false;
      }
    },
  },
};
</script>

<style>
  .daily-login-banner-c {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 80%);
    z-index: 101;
    padding: 1rem;
  }
  .daily-login-banner {
    width: 400px;
    max-width: 100%;
    cursor: pointer;
  }

  .daily-login-banner-c .btn {
    position: absolute;
    border: none;
    top: 30px;
    right: 30px;
  }
  @media (max-width: 767px) {
    .daily-login-banner-c .btn {
      top: 20px;
      right: 20px;
    }
  }
</style>
