<template>
  <div class="profile-history">
    <!-- Back arrow -->
    <div class="back-to-profile">
      <router-link to="/profile"><Icon name="back" :height="17"></Icon>Profile</router-link>
    </div>
    <template v-show="withdrawalHistory">
      <table-withdrawal-history></table-withdrawal-history>
    </template>
    <div class="profile-history--sectio" v-if="sweep">
      <h4>Redemption Timetable</h4>
      <p class="thp">FIRST REDEMPTION REQUEST</p>
      <table class="timetable">
        <tr>
          <th>DAY REQUESTED</th>
          <th>PROCESSING TIME</th>
          <th>DAY PROCESSED</th>
        </tr>
        <tr>
          <td>MONDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING MONDAY</td>
        </tr>
        <tr>
          <td>TUESDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING TUESDAY</td>
        </tr>
        <tr>
          <td>WEDNESDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING WEDNESDAY</td>
        </tr>
        <tr>
          <td>THURSDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING THURSDAY</td>
        </tr>
        <tr>
          <td>FRIDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING FRIDAY</td>
        </tr>
        <tr>
          <td>SATURDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING FRIDAY</td>
        </tr>
        <tr>
          <td>SUNDAY</td>
          <td>5 BUSINESS DAYS</td>
          <td>FOLLOWING FRIDAY</td>
        </tr>
      </table>
    </div>
    <div class="profile-history--sectio" v-if="sweep">
      <p class="thp">SUBSEQUENT REDEMPTION REQUESTS</p>
      <table class="timetable">
        <tr>
          <th>DAY REQUESTED</th>
          <th>PROCESSING TIME</th>
          <th>DAY PROCESSED</th>
        </tr>
        <tr>
          <td>MONDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>THURSDAY - MONDAY</td>
        </tr>
        <tr>
          <td>TUESDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>FRIDAY - TUESDAY</td>
        </tr>
        <tr>
          <td>WEDNESDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>MONDAY - WEDNESDAY</td>
        </tr>
        <tr>
          <td>THURSDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>TUESDAY - THURSDAY</td>
        </tr>
        <tr>
          <td>FRIDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>WEDNESDAY - FRIDAY</td>
        </tr>
        <tr>
          <td>SATURDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>WEDNESDAY - FRIDAY</td>
        </tr>
        <tr>
          <td>SUNDAY</td>
          <td>3-5 BUSINESS DAYS</td>
          <td>WEDNESDAY - FRIDAY</td>
        </tr>
      </table>
    </div>
    <transition name="fade">
      <loader v-if="!withdrawalHistory" />
    </transition>
  </div>
</template>

<script>
import TableWithdrawalHistory from '@/components/organisms/TableWithdrawalHistory.vue';
import Icon from '@/components/atoms/Icon.vue';
import Loader from '@/components/molecules/Loader.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    Icon,
    TableWithdrawalHistory,
    Loader,
  },
  computed: {
    ...mapGetters(['withdrawalHistory', 'sweep']),
  },
};
</script>

<style></style>
