<template>
  <div class="edit-profile profile-raf">
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <section class="profile-raf-inner">
      <h3>Refer a Friend</h3>
      <template v-if="playerData">
        <p class="lead">Receive <strong>5,000 WOW Coins</strong> and <strong>20 SC</strong> free for each referral, up to 30 qualifying friends*</p>
        <div class="raf-results">
          <div>
            <p class="raf-results-label">Friends invited</p>
            <p class="raf-results-value">{{ myRafData.reg }}</p>
          </div>
          <div>
            <p class="raf-results-label">Friends qualified*</p>
            <p class="raf-results-value">{{ myRafData.cpa }}</p>
          </div>
          <div>
            <p class="raf-results-label">Total rewards earned</p>
            <p class="raf-results-value">{{ myRafData.credited }} SC</p>
          </div>
        </div>
        <div class="input-group input-group--copy-input">
          <div>
            <label class="label">Get your WOW Vegas URL:</label>
            <div class="flexx">
              <input v-on:focus="$event.target.select()" ref="clone" type="text" name="First name" readonly="readonly" disabled="disabled" class="input" :value="rafUrl" />
              <Button type="primary" @click="copy">Copy</Button>
            </div>
          </div>
          <label class="label">Or easily share with:</label>
          <div class="sharing-options">
            <Button type="primary" class="button-cfacebook" @click="shareLink('facebook')">
              <font-awesome-icon :icon="['fab', 'facebook-f']"></font-awesome-icon>
            </Button>
            <Button type="primary" class="button-ctwitter" @click="shareLink('twitter')">
              <font-awesome-icon :icon="['fab', 'twitter']"></font-awesome-icon>
            </Button>
            <Button type="primary" class="button-cwhatsapp" @click="shareLink('whatsapp')">
              <font-awesome-icon :icon="['fab', 'whatsapp']"></font-awesome-icon>
            </Button>
            <!-- <Button type="primary" class="button-cmessanger" @click="shareLink('messenger')">
              <font-awesome-icon :icon="['fab', 'facebook-messenger']"></font-awesome-icon>
            </Button> -->
            <Button type="primary" class="button-cmail" @click="shareLink('email')">
              <font-awesome-icon :icon="['fa', 'envelope']"></font-awesome-icon>
            </Button>
          </div>
        </div>
        <hr /><br />
        <template v-if="leaderboardData">
          <h3>{{ leaderboardData.title }}</h3>
          <p class="lead" v-html="leaderboardData.content"></p>
          <div class="raf-leaderboard-prizes">
            <h5>Prizes**</h5>
            <p>1st place: <strong>2000 SC</strong></p>
            <p>2nd place: <strong>1200 SC</strong></p>
            <p>3rd place: <strong>800 SC</strong></p>
            <p>4th place: <strong>600 SC</strong></p>
            <p>5th place: <strong>400 SC</strong></p>
          </div>
          <div v-if="myLeaderboardData.pos" class="raf-results">
            <div>
              <p class="raf-results-label">Your current position</p>
              <p class="raf-results-value">#{{ myLeaderboardData.pos }}</p>
            </div>
            <div>
              <p class="raf-results-label">Friends invited</p>
              <p class="raf-results-value">{{ myLeaderboardData.cpa }}</p>
            </div>
            <div>
              <p class="raf-results-label">Friends qualified</p>
              <p class="raf-results-value">{{ myLeaderboardData.cpa }}</p>
            </div>
          </div>
          <table v-if="typeof leaderboardData.leaderboard !== 'undefined' && leaderboardData.leaderboard.length" class="timetable raf-leaderboard">
            <tr>
              <th class="position-th">Position</th>
              <th class="username-th">Player</th>
              <th class="invites-th"><template v-if="currentMonth">{{ currentMonth }} </template>Referrals*</th>
            </tr>
            <tr v-for="(row, index) in leaderboardData.leaderboard" :key="`lb-${index}`">
              <td>{{ row.pos }}</td>
              <td>{{ row.userId }}</td>
              <td class="invites-td">{{ row.cpa }}</td>
            </tr>
          </table>
          <hr /><br />
        </template>
        <p class="raf-disc">
          * Friends qualify by signing up with your referral link, purchasing WOW Coin packages worth $15 in total and not with an existing account with WOW Vegas.
          <template v-if="leaderboardData">If you surpass the limit of 30 referrals, you will no longer receive the referral bonus, but you can still compete for the top prize by climbing the leaderboard. </template>
          <router-link :to="{ name: 'Sweepstakes Rules' }">Terms and Conditions apply</router-link>.
        </p>
        <p class="raf-disc" v-if="leaderboardData">
          ** In the event of a tie for any of the top 5 positions in the monthly refer-a-friend leaderboard, the corresponding prize will be divided equally among the tied participants. For example, if two players tie for first place, each player will receive 1000 SC.
          See full leaderboard terms on our <router-link :to="{ name: 'Promotion', params: { slug: 'raf-leaderboard' } }">Promotion page</router-link>.
        </p>
      </template>
      <transition name="fade">
        <loader v-if="!playerData" />
      </transition>
    </section>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    Loader,
    Button,
  },
  computed: {
    ...mapGetters(['playerData', 'sweep']),
    rafUrl() {
      return `https://www.wowvegas.com/?raf=${this.playerData.partyId}`;
    },
    getRafEntryUrl() {
      return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'wp-json/raf/v1/entry');
    },
    getRafLeaderboardUrl() {
      return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'wp-json/raf/v1/leaderboards');
    },
    myRafData() {
      if (!this.playerData || !this.rafData) {
        return {
          cpa: 0,
          reg: 0,
          credited: 0,
        };
      }
      return this.rafData;
    },
    myLeaderboardData() {
      if (!this.leaderboardData || typeof this.leaderboardData.userData === 'undefined') {
        return {
          cpa: 0,
          reg: 0,
          pos: 0,
        };
      }
      return this.leaderboardData.userData;
    },
    currentMonth() {
      if (!this.leaderboardData) return null;
      const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const d = new Date(this.leaderboardData.startDate);
      return month[d.getMonth()];
    },
  },
  data() {
    return {
      rafData: false,
      leaderboardData: false,
    };
  },
  methods: {
    copy() {
      this.$noty.error('Your WOW Vegas URL has been copied to the clipboard!');
      this.$refs.clone.select();
      this.$refs.clone.setSelectionRange(0, 99999); // For mobile devices
      navigator.clipboard.writeText(this.$refs.clone.value);
    },
    async getRafEntry() {
      if (!this.playerData) {
        return;
      }
      await this.$http(`${this.getRafEntryUrl}`, {
        params: {
          party_id: this.playerData.partyId,
        },
      })
        .then((response) => {
          this.rafData = response.data.result;
        });
      await this.$http(`${this.getRafLeaderboardUrl}`, {
        params: {
          party_id: this.playerData.partyId,
        },
      })
        .then((response) => {
          if (response.data.length) {
            const [leaderboardData] = response.data;
            this.leaderboardData = leaderboardData;
          }
        });
    },
    shareLink(platform) {
      let shareUrl;
      const message = `Start winning with me at WOW Vegas, the best social casino in the US! \n\n${this.rafUrl}`;
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.rafUrl)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
          break;
        case 'messenger':
          shareUrl = `https://www.facebook.com/dialog/send?app_id=495488996114803&link=${encodeURIComponent(this.rafUrl)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=Start winning with me at WOW Vegas&body=${encodeURIComponent(message)}`;
          window.location = shareUrl;
          break;
          // https://www.facebook.com/dialog/send?app_id=495488996114803&amp%3Blink=http%3A%2F%2Fwww.nytimes.com%2Finteractive%2F2015%2F04%2F15%2Ftravel%2Feurope-favorite-streets.html&amp%3Bredirect_uri=https%3A%2F%2Fwww.domain.com%2F
          // https://developers.facebook.com/docs/sharing/reference/send-dialog/
        default:
          break;
      }
      window.open(shareUrl, '_blank');
    },
  },
  created() {
    this.getRafEntry();
  },
  watch: {
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.getRafEntry();
      }
    },
  },
};
</script>

<style lang="scss">
.profile-raf-inner {
  width: 677px;
  max-width: 100%;
  // .input-group--copy-input {
  //   width: 660px;
  // }
  .input {
    width: 100%;
  }
  .flexx {
    display: flex;
  }
  .raf-results {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100%;
    margin: 2rem 0;
  }
  .raf-results>div {
    background: #111118;
    text-align: center;
    padding: 1.5rem;
    border-radius: 4px;
  }
  p.raf-results-value {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 1.6rem;
  }
  p.raf-disc {
    font-size: 12px;
    color: #a1a1a1;
  }
  .sharing-options .button {
    width: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    min-width: unset;
    border-radius: 4px !important;
    padding-top: .7rem;
    padding-bottom: 0.7rem;
  }
  .sharing-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem;
  }
  .sharing-options .button .svg-inline--fa {
    margin: 0 !important;
    width: 1.3rem !important;
    height: 1.3rem !important;
  }
  .button-cfacebook {
    background: #3b5998;
    color: #fff;
  }
  .button-ctwitter {
    background: #1da1f2;
    color: #fff;
  }
  .button-cwhatsapp {
    background: #25D366;
    color: #fff;
  }
  .button-cmessanger {
    background: #0084ff;
    color: #fff;
  }
}

table.timetable.raf-leaderboard tr:not(:first-child) {
  background: #111118;
}
table.timetable.raf-leaderboard td,
table.timetable.raf-leaderboard th {
  padding-top: .5rem;
  padding-bottom: 0.5rem;
}
table.timetable.raf-leaderboard td:first-child {
  width: 100px;
  text-align: center;
}
.invites-th {
  width: 200px;
}
.raf-leaderboard-prizes {
  padding: 1rem 1rem;
  background: #111118;
  border: 2px solid #00c7ff;
  border-radius: 4px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}
.raf-leaderboard-prizes p {
  margin-bottom: 5px;
  line-height: calc(1em + 6px);
  font-size: 18px;
}
.raf-leaderboard-prizes h5 {
  font-size: 1.2rem;
  margin-top: 4px;
  margin-bottom: 11px;
}
.raf-leaderboard-prizes p:nth-of-type(1) {
  font-size: 19px;
}
.raf-leaderboard-prizes p:nth-of-type(2) {
  font-size: 16px;
}
.raf-leaderboard-prizes p:nth-of-type(3) {
  font-size: 14px;
}
.raf-leaderboard-prizes p:nth-of-type(4) {
  font-size: 13px;
}
.raf-leaderboard-prizes p:nth-of-type(5) {
  font-size: 12px;
}

@media (max-width: 768px) {
  .profile-raf-inner {
    .raf-results > div {
      padding: 01rem 0.5rem;
      font-size: 11px;
    }
    p.raf-results-label {
      white-space: nowrap;
      margin-bottom: .6rem;
    }
    .flexx {
      flex-wrap: wrap;
    }
    .flexx button.button.button--primary {
      width: 100%;
      padding: 10px;
    }
    input.input {
      padding-left: .5rem;
      padding-right: 0.5rem;
    }
    p.raf-results-value {
      font-size: 1.3rem;
      line-height: 1;
    }
    .input:disabled {
      color: #fff;
    }
  }

  table.timetable.raf-leaderboard th {
    font-size: 10px;
    vertical-align: bottom;
  }
  table.timetable.raf-leaderboard {
    text-align: center !important;
    margin-top: -1rem;
  }
  table.timetable.raf-leaderboard td:first-child {
    width: 80px;
    text-align: center;
  }
  .invites-th {
    width: 100px;
  }
  .invites-td {
    padding-left: 1rem !important;
  }
}
// background: linear-gradient(306.36deg, #2BDE9E 1.86%, #0938AB 96.51%);
</style>
