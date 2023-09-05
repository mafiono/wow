<template>
  <div class="edit-profile profile-vip">
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <section class="profile-vip-inner">
      <h3>STAR SYSTEM <span class="break">VIP & LOYALTY PROGRAM</span></h3>
      <template v-if="playerData">
        <div v-if="loyaltyPointsData" class="vip-stats">
          <h5>CURRENT LEVEL: <span :class="`vip-color-${vipStatus}`">{{ vipStatus.toUpperCase() }}</span></h5>
          <div v-if="nextLevel" class="vip-progress-to">
            <p>PROGRESS TO <span :class="`vip-color-${nextLevel}`">{{ nextLevel.toUpperCase() }}</span></p>
            <div class="vip-progress-to-in">
              <p class="vip-smallp">COLLECT <strong>⭐️ {{ starsRequiredToNextLevel }}</strong> MORE STARS TO LEVEL UP!</p>
              <div class="progress-div">
                <progress class="progress" :class="`progress-${nextLevel}`" :value="loyaltyPointsData.totalPointsForNextLevel - loyaltyPointsData.remainingPointsForNextLevel" :max="loyaltyPointsData.totalPointsForNextLevel"></progress>
                <div>{{ percentageToNextLevel }}%</div>
              </div>
            </div>
          </div>
          <!-- <p class="vpmt2">STARS REQUIRED TO RETAIN CURRENT LEVEL:</p> -->
          <p class="vpmt2 vip-smallp">STARS EARNED IN THE LAST 30 DAYS: <strong>⭐️ {{ accumulatedLoyaltyPoint }}</strong></p>
          <p class="vip-smallp">STARS EARNED LIFETIME: <strong>⭐️ {{ currentLoyaltyPoint }}</strong></p>
        </div>
        <hr />
        <h3>HOW IT WORKS</h3>
        <p>Start at <span class="vip-color-rising">Rising Star</span> level and play your way through the WOW Vegas galaxy of stars, earning, maintaining and boosting your star status 24/7 🚀</p>
        <p>Collect 1 Star ⭐️ for every 50 SC played on any game, each star earned is valid for 30 days</p>
        <p>Check your status and progress in real time on mobile, desktop or tablet ✅</p>
        <hr />
        <h3>STAR SYSTEM LEVELS & FEATURES</h3>
        <p>Here's what great offers and upgrades await as you play your way through the galaxy of the WOW Vegas Star System</p>
        <div class="table-container">
          <table class="timetable vip-table" :class="`vipclass-${vipStatus}`">
            <thead>
              <tr>
                <th></th>
                <th>
                  <img src="@/assets/vip/rising.png" class="vip-class" />
                  <span class="vip-color-rising">Rising</span>
                </th>
                <th>
                  <img src="@/assets/vip/blue.png" class="vip-class" />
                  <span class="vip-color-blue">Blue</span>
                </th>
                <th>
                  <img src="@/assets/vip/bronze.png" class="vip-class" />
                  <span class="vip-color-bronze">Bronze</span>
                </th>
                <th>
                  <img src="@/assets/vip/silver.png" class="vip-class" />
                  <span class="vip-color-silver">Silver</span>
                </th>
                <th>
                  <img src="@/assets/vip/gold.png" class="vip-class" />
                  <span class="vip-color-gold">Gold</span>
                </th>
                <th>
                  <img src="@/assets/vip/hosted.png" class="vip-class" />
                  <span class="vip-color-hosted">Hosted</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Daily Prize Drops</th>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>24/7 Customer Support</th>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>Over 400 Games</th>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>Daily Free SC Email Draw</th>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr v-if="false">
                <th>Regular Discounted Coin Packs</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>Daily Login Reward</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td>SC 0.30</td>
                <td>SC 0.50</td>
                <td>SC 1.00</td>
                <td>SC 2.50</td>
                <td>SC 5.00</td>
              </tr>
              <tr>
                <th>Daily Login Reward</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><span class="wowsmall">WOW</span> 1.5k</td>
                <td><span class="wowsmall">WOW</span> 5k</td>
                <td><span class="wowsmall">WOW</span> 10k</td>
                <td><span class="wowsmall">WOW</span> 20k</td>
                <td><span class="wowsmall">WOW</span> 50k</td>
              </tr>
              <tr>
                <th>Extra WOW Coins on every purchase</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td>5%</td>
                <td>10%</td>
                <td>15%</td>
                <td>20%</td>
                <td>25%</td>
              </tr>
              <tr>
                <th>Monthly Bonus</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>Priority Customer Support</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr v-if="false">
                <th>Tailored Special Offers</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>24hrs Redemption Processing</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>Personal Account Hosts</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
              <tr>
                <th>VIP Support via Whatsapp</th>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/close_FILL.png" class="iconfill closefill" /></td>
                <td><img src="https://cdn2.wowvegas.com/assets/done_FILL.png" class="iconfill donefill" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <transition name="fade">
        <loader v-if="!playerData" />
      </transition>
    </section>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
// import Button from '@/components/atoms/Button.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    Loader,
    // Button,
  },
  computed: {
    ...mapGetters(['playerData', 'sweep']),
    vipStatus() {
      if (!this.playerData?.vipStatus) return 'rising';
      return this.playerData?.vipStatus.toLowerCase();
    },
    nextLevel() {
      if (this.vipStatus === 'hosted') {
        return false;
      }
      const index = this.levels.indexOf(this.vipStatus);
      return this.levels[index + 1];
    },
    percentageToNextLevel() {
      if (!this.loyaltyPointsData?.remainingPointsForNextLevel) return 0;
      return parseInt(((this.loyaltyPointsData.totalPointsForNextLevel - this.loyaltyPointsData.remainingPointsForNextLevel) / this.loyaltyPointsData.totalPointsForNextLevel) * 100, 10);
    },
    starsRequiredToNextLevel() {
      if (!this.loyaltyPointsData?.remainingPointsForNextLevel) return 0;
      return parseInt(this.loyaltyPointsData.remainingPointsForNextLevel / 50, 10);
    },
    accumulatedLoyaltyPoint() {
      if (!this.loyaltyPointsData?.accumulatedLoyaltyPoint) return 0;
      return parseInt(this.loyaltyPointsData.accumulatedLoyaltyPoint / 50, 10);
    },
    currentLoyaltyPoint() {
      if (!this.loyaltyPointsData?.currentLoyaltyPoint) return 0;
      return parseInt(this.loyaltyPointsData.currentLoyaltyPoint / 50, 10);
    },
  },
  data() {
    return {
      loyaltyPointsData: null,
      levels: [
        'rising', 'blue', 'bronze', 'silver', 'gold', 'hosted',
      ],
    };
  },
  methods: {
    async loyaltyPointsStatus() {
      this.$store.dispatch('enableLoader');
      await this.$apiToken.get('loyaltyPointsStatus').then((result) => {
        if (result.data.status === 'SUCCESS') {
          console.log(result.data);
          this.loyaltyPointsData = result.data;
        }
      }).finally(() => {
        this.$store.dispatch('disableLoader');
      });
    },
  },
  created() {
    this.loyaltyPointsStatus();
  },
  watch: {
    playerData(playerDataReady) {
      if (playerDataReady) {
        //
      }
    },
  },
};
</script>

<style lang="scss">
// .profile-vip-inner {
//   width: 677px;
//   max-width: 100%;
// }
table.timetable.vip-table {
  text-align: center;

  &.vipclass-rising {
    th:nth-child(2), td:nth-child(2) {
      background: #0cc1f82e;
    }
  }
  &.vipclass-blue {
    th:nth-child(3), td:nth-child(3) {
      background: #0cc1f82e;
    }
  }
  &.vipclass-bronze {
    th:nth-child(4), td:nth-child(4) {
      background: #0cc1f82e;
    }
  }
  &.vipclass-silver {
      th:nth-child(5), td:nth-child(5) {
      background: #0cc1f82e;
    }
  }
  &.vipclass-gold {
      th:nth-child(6), td:nth-child(6) {
      background: #0cc1f82e;
    }
  }
  &.vipclass-hosted {
      th:nth-child(7), td:nth-child(7) {
      background: #0cc1f82e;
    }
  }
  .vip-class {
    width: 44px;
    height: auto;
    display: block;
    margin: 0 auto 7px;
  }
  tbody th {
    text-align: right;
    font-size: 10px;
    padding: 8px 10px;
  }
  td {
    padding: 8px 16px;
    font-weight: 800;
    white-space: nowrap;
  }
}
table.timetable.vip-table thead th span {
  display: block;
  text-align: center;
  font-size: 9px;
}
table.timetable.vip-table tbody tr {
  background: #111118;
  th {
    border: 0;
  }
}
.iconfill {
  display: block;
  margin: 0 auto;
  width: 30px;
}
.table-container {
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  overflow-y: hidden;
  max-width: 100%;
}
.vip-stats {
  font-weight: 600;
  margin-bottom: 1.2rem;
  p {
    margin-bottom: .5rem;
  }
  p.vpmt2 {
      margin-top: 1rem;
  }
  span {
    font-weight: 800;
  }
}

.progress {
  -moz-appearance: none;
  -webkit-appearance: none;
  border: none;
  border-radius: 9999px;
  display: block;
  height: 1rem;
  overflow: hidden;
  padding: 0;
  width: 300px;
  max-width: 100%;
  margin: .6rem 0;
}
.progress::-webkit-progress-bar {
  background-color: #2c2c38;
}
.progress::-webkit-progress-value {
  background-color: #4a4a4a;
}
.progress::-moz-progress-bar {
  background-color: #4a4a4a;
}
.progress::-ms-fill {
  background-color: #4a4a4a;
  border: none;
}

.progress.progress-rising::-webkit-progress-value {
  background-color: #f372d5;
}
.progress.progress-rising::-moz-progress-bar {
  background-color: #f372d5;
}
.progress.progress-rising::-ms-fill {
  background-color: #f372d5;
}
.progress.progress-blue::-webkit-progress-value {
  background-color: #00b5f9;
}
.progress.progress-blue::-moz-progress-bar {
  background-color: #00b5f9;
}
.progress.progress-blue::-ms-fill {
  background-color: #00b5f9;
}
.progress.progress-bronze::-webkit-progress-value {
  background-color: #cc844f;
}
.progress.progress-bronze::-moz-progress-bar {
  background-color: #cc844f;
}
.progress.progress-bronze::-ms-fill {
  background-color: #cc844f;
}
.progress.progress-silver::-webkit-progress-value {
  background-color: #cfccc9;
}
.progress.progress-silver::-moz-progress-bar {
  background-color: #cfccc9;
}
.progress.progress-silver::-ms-fill {
  background-color: #cfccc9;
}
.progress.progress-gold::-webkit-progress-value {
  background-color: #e4cf7b;
}
.progress.progress-gold::-moz-progress-bar {
  background-color: #e4cf7b;
}
.progress.progress-gold::-ms-fill {
  background-color: #e4cf7b;
}
.progress.progress-hosted::-webkit-progress-value {
  background-color: #fd8e12;
}
.progress.progress-hosted::-moz-progress-bar {
  background-color: #fd8e12;
}
.progress.progress-hosted::-ms-fill {
  background-color: #fd8e12;
}

.vip-progress-to {
    background: #111118;
    margin-top: 1rem;
}
.vip-progress-to>p:first-child {
    padding: 0.6rem 1rem;
    margin-bottom: 0;
    background: #1e1e28;
}
.vip-progress-to-in {
    padding: 1rem 1rem 0.7rem;
}
.progress-div {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
}
.profile-vip-inner hr {
  border: 0;
  height: 1px;
  background: #CCC;
  background-image: linear-gradient(to right, #333, #CCC, #333);
}
@media (max-width: 768px) {
  // .profile-vip-inner {
  // }
  .profile-vip-inner>h3>span.break {
    display: block;
  }
  .table-container {
    margin-left: -6px;
    margin-right: -6px;
    max-width: calc(100% + 12px);
  }
  table.timetable.vip-table {
    border-spacing: 3px;
  }
  table.timetable.vip-table td {
    padding: 8px 6px;
    white-space: initial;
  }
  table.timetable.vip-table .vip-class {
    width: 26px;
  }
  .iconfill {
    width: 20px;
  }
  .wowsmall {
    font-size: 8px;
  }
  table.timetable.vip-table thead th span {
    font-size: 8px;
  }
  table.timetable.vip-table tbody th {
    font-size: 9px;
  }
  .profile-vip-inner {
    font-size: 0.85rem;
  }
}
</style>
