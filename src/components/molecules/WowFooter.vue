<template>
  <div v-if="!isSearch" class="wow-footer">
    <div class="container">
      <div class="footer-new-layout">
        <div v-if="$route.name !== 'Contact Us'" class="customer-help-link">
          <Button type="primary" tag="router-link" :to="{ name: 'Contact Us' }" iconLeft="headset">24/7 Customer Help</Button>
        </div>
        <div v-if="loggedIn && sweep" class="footer-message-big">
          <p>NO PURCHASE NECESSARY. SWEEPSTAKES RULES APPLY. <router-link style="font-size: inherit;" :to="{ name: 'AMOE' }">CLICK HERE</router-link> FOR INSTRUCTIONS ON ALTERNATIVE METHOD OF ENTRY</p>
        </div>
        <div class="footer-links--social">
          <a href="https://www.facebook.com/wowvegascom/" target="blank">
            <icon name="facebook" :height="17"></icon>
          </a>
          <a href="https://www.instagram.com/wowvegascom/" target="blank">
            <icon name="instagram" :height="17"></icon>
          </a>
          <a href="https://twitter.com/wowvegascom/" target="blank">
            <icon name="twitter" :height="17"></icon>
          </a>
          <a v-if="false" href="https://www.youtube.com/channel/UCBE1VBKFfKKbjzJwTSYffAA" target="blank">
            <icon name="youtube" :height="17"></icon>
          </a>
          <a v-if="false" href="https://www.tiktok.com/@wowvegascom/" target="blank">
            <icon name="tiktok2" :height="17"></icon>
          </a>
        </div>
        <div class="footer-links--menus">
          <div class="footer-links--menu">
            <router-link v-if="sweep" :to="{ name: 'Sweepstakes Rules' }">Sweepstakes Rules</router-link>
            <router-link :to="{ name: 'Terms and Conditions' }">Terms and Conditions</router-link>
            <router-link :to="{ name: 'Privacy Policy' }">Privacy Policy</router-link>
            <router-link :to="{ name: 'Responsible Gaming' }">Responsible Social Gaming</router-link>
          </div>
          <div v-if="loggedIn" class="footer-links--menu">
            <router-link v-if="loggedIn" :to="{ name: 'About Us' }">About Us</router-link>
            <router-link v-if="loggedIn" :to="{ name: 'FAQ' }">General FAQ</router-link>
            <router-link v-if="loggedIn && sweep" :to="{ name: 'Payment FAQ' }">Payment FAQ</router-link>
            <router-link v-if="loggedIn && sweep" :to="{ name: 'Verification FAQ' }">Verification FAQ</router-link>
          </div>
        </div>
        <div class="footer-icons">
          <div><Icon name="18" :height="23"></Icon></div>
          <div v-if="loggedIn"><a href="https://www.gov.im/gambling" target="_blank"><Icon name="iom_crest" :height="40"></Icon></a></div>
          <div v-if="loggedIn"><a href="https://www.gamblingtherapy.org/en" target="_blank"><Icon name="gambling_therapy" :height="25"></Icon></a></div>
        </div>
        <div class="footer-message">
          <template v-if="loggedIn">
            <p>
              Wow Entertainment Limited (Company No 018038V) is licensed and regulated by the Isle of Man Gambling Supervision Commission under a license issued under the Online Gambling Regulation Act 2001 on 5th March 2021.
              Wow Entertainment Limited, PO Box 227, PEVERIL BUILDINGS, PEVERIL SQUARE, DOUGLAS, IM99 1RZ.
            </p>
            <p>
              Persons under the age of 18 are not permitted to create accounts and/or participate in the games.
              All debts are enforceable in Law in the Isle of Man
            </p>
          </template>
          <p v-else>
            Persons under the age of 18 are not permitted to create accounts and/or participate in the games.
          </p>
            <p>
              Copyright &copy; {{ currentYear }} WOW Entertainment Limited. All rights reserved. WowVegas.com is owned and operated
              by WOW Entertainment Limited, Peveril Buildings, Peveril Square, Douglas, IM99 1RZ. Company registration number 018038V.
            </p>
        </div>
      </div>
      <template v-if="false">
        <div class="footer-links">
          <div class="footer-links--social">
            <a href="https://www.facebook.com/wowvegascom/" target="blank">
              <icon name="facebook" :height="17"></icon>
            </a>
            <a href="https://www.instagram.com/wowvegascom/" target="blank">
              <icon name="instagram" :height="17"></icon>
            </a>
            <a href="https://twitter.com/wowvegascom/" target="blank">
              <icon name="twitter" :height="17"></icon>
            </a>
            <!-- <a href="https://www.youtube.com/channel/UCBE1VBKFfKKbjzJwTSYffAA" target="blank">
              <icon name="youtube" :height="17"></icon>
            </a>
            <a href="https://www.tiktok.com/@wowvegascom/" target="blank">
              <icon name="tiktok2" :height="17"></icon>
            </a> -->
          </div>
          <div class="footer-links--menu">
            <router-link v-if="sweep" :to="{ name: 'Sweepstakes Rules' }">Sweepstakes Rules</router-link>
            <router-link :to="{ name: 'Terms and Conditions' }">Terms and Conditions</router-link>
            <router-link :to="{ name: 'Privacy Policy' }">Privacy Policy</router-link>
            <router-link :to="{ name: 'Responsible Gaming' }">Responsible Social Gaming</router-link>
            <router-link v-if="loggedIn" :to="{ name: 'About Us' }">About Us</router-link>
            <router-link v-if="loggedIn" :to="{ name: 'FAQ' }">General FAQ</router-link>
            <router-link v-if="loggedIn && sweep" :to="{ name: 'Payment FAQ' }">Payment FAQ</router-link>
            <router-link v-if="loggedIn && sweep" :to="{ name: 'Verification FAQ' }">Verification FAQ</router-link>
          </div>
          <div class="footer-links--copyright">
            <p>Copyright &copy; {{ currentYear }} WOW Entertainment Limited. All rights reserved. WowVegas.com is owned and operated by WOW Entertainment Limited, Peveril Buildings, Peveril Square, Douglas, IM99 1RZ. Company registration number 018038V.</p>
          </div>
        </div>
        <div class="footer-icons">
          <div><Icon name="18" :height="23"></Icon></div>
          <div v-if="loggedIn"><a href="https://www.gov.im/gambling" target="_blank"><Icon name="iom_crest" :height="40"></Icon></a></div>
          <div v-if="loggedIn"><a href="https://www.gamblingtherapy.org/en" target="_blank"><Icon name="gambling_therapy" :height="25"></Icon></a></div>
        </div>
        <div class="footer-message">
          <template v-if="loggedIn && sweep">
            <p>NO PURCHASE NECESSARY. SWEEPSTAKES RULES APPLY. <router-link style="font-size: inherit;" :to="{ name: 'AMOE' }">CLICK HERE</router-link> FOR INSTRUCTIONS ON ALTERNATIVE METHOD OF ENTRY</p>
          </template>
          <template v-if="loggedIn">
            <p>
              Wow Entertainment Limited (Company No 018038V) is licensed and regulated by the Isle of Man Gambling Supervision Commission under a license issued under the Online Gambling Regulation Act 2001 on 5th March 2021.
              Wow Entertainment Limited, PO Box 227, PEVERIL BUILDINGS, PEVERIL SQUARE, DOUGLAS, IM99 1RZ.
            </p>
            <p>
              Persons under the age of 18 are not permitted to create accounts and/or participate in the games.
              All debts are enforceable in Law in the Isle of Man
            </p>
          </template>
          <p v-else>
            Persons under the age of 18 are not permitted to create accounts and/or participate in the games.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  components: {
    Icon,
    Button,
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    currentCountryCode() {
      return this.$store.getters.currentCountryCode;
    },
    currentYear() {
      return new Date().getFullYear();
    },
    sweep() {
      return this.$store.getters.sweep;
    },
    isSearch() {
      return typeof this.$route.query.search !== 'undefined';
    },
  },
  watch: {
    isSearch(value) {
      if (value) {
        this.showSearchPage = true;
      } else {
        this.showSearchPage = false;
      }
    },
  },
};
</script>
