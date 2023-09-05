<template>
  <div v-if="sweep" class="container section section--promotions">
    <h2 class="promotions-title">Current Promotions</h2>
    <div v-if="horizontalCategoriesComputed && horizontalCategoriesComputed.length" class="horizontal-menu-c">
      <div class="horizontal-menu" ref="horizontalMenu">
        <div class="link" :class="{ 'router-link-exact-active': currentCatogory === 'all' }" @click="currentCatogory = 'all'">
          <h4>All</h4>
        </div>
        <div class="link" v-for="category in horizontalCategoriesComputed" :key="category.id"
          :class="{ 'router-link-exact-active': currentCatogory === category.value }"
          @click="currentCatogory = category.value">
          <h4>{{ category.label }}</h4>
        </div>
      </div>
    </div>
    <div v-if="!loading && computedPromos && computedPromos.length" class="promotions-list">
      <div v-for="promotion in computedPromos" class="promotion-card" :key="`promocard-${promotion.id}`">
        <img @click="$router.push({ name: 'Promotion', params: { slug: promotion.slug }})" :src="promotion.tile_image" class="promotion-card-image" alt="">
        <div class="content">
          <div class="info">
            <h3>{{ promotion.title }}</h3>
            <p class="promo-subtitle" v-html="promotion.subtitle"></p>
            <div class="promo-description" v-html="promotion.description"></div>
          </div>
        </div>
        <Button type="primary" tag="router-link" :to="{ name: 'Promotion', params: { slug: promotion.slug }}">{{ promotion.button_text ? promotion.button_text : 'Find out more' }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Button from '@/components/atoms/Button.vue';

export default {
  components: {
    Button,
  },
  data() {
    return {
      promotions: [],
      loading: false,
      horizontalCategories: [],
      currentCatogory: 'all',
    };
  },
  computed: {
    ...mapGetters(['playerData', 'sweep']),
    vipStatus() {
      if (!this.playerData?.vipStatus) return 'rising';
      return this.playerData?.vipStatus.toLowerCase();
    },
    computedPromos() {
      const promos = this.promotions;
      let promos2 = promos;
      if (this.vipStatus === 'rising') {
        promos2 = promos.filter((promo) => promo.acf.enable_button !== 'daily');
      }
      if (this.currentCatogory === 'all') {
        return promos2;
      }
      return promos2.filter((promo) => promo.acf.categories.includes(this.currentCatogory));
    },
    horizontalCategoriesComputed() {
      if (this.playerData?.madeDeposit) {
        return this.horizontalCategories.filter((cat) => cat.value !== 'ftp');
      }
      return this.horizontalCategories;
    },
  },
  created() {
    //
  },
  methods: {
    fetchPromos() {
      if (!this.loading) {
        this.loading = true;
        this.$store.dispatch('enableLoader');
        this.$apiCmsNew.get(`/promotions`, {
          params: {
            swp: this.sweep, // sweep or not
            orderby: 'menu_order',
            per_page: 100,
          },
        }).then((response) => {
          this.promotions = response.data;
          this.promotions.forEach((element) => {
            if (element.categories) {
              this.horizontalCategories = [...this.horizontalCategories, ...element.categories];
            }
          });
          this.horizontalCategories = [...new Map(this.horizontalCategories.map((item) => [item.value, item])).values()];
        }).catch((error) => {
          if (error.response?.status === 404) {
            this.$router.replace({ name: '404 Error' });
          }
        }).finally(() => {
          this.loading = false;
          this.$store.dispatch('disableLoader');
        });
      }
    },
    findActiveAndScroll() {
      if (typeof this.$refs.horizontalMenu !== 'undefined' && this.$refs.horizontalMenu.children.length) {
        this.$refs.horizontalMenu.children.forEach((element) => {
          if (element.classList.contains('router-link-exact-active')) {
            this.$refs.horizontalMenu.scrollTo({ left: element.offsetLeft, behavior: 'smooth' });
          }
        });
      }
    },
  },
  watch: {
    // playerData is not ready when mounted (when user enters page directly from url)
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.fetchPromos();
      }
    },
    currentCatogory(val) {
      if (val) {
        this.$store.dispatch('enableLoader');
        this.loading = true;
        setTimeout(() => {
          this.$store.dispatch('disableLoader');
          this.loading = false;
        }, 400);
        this.$nextTick(() => {
          this.findActiveAndScroll();
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch('enableLoader');
    if (this.playerData) {
      this.fetchPromos();
    }
  },
};
</script>

<style lang="scss">
.container.section.section--promotions {
  min-height: 40vh;
  .horizontal-menu-c {
    margin: 0 !important;
  }
  .horizontal-menu {
    margin-bottom: 0.5rem;
  }
  .horizontal-menu .link {
    letter-spacing: 3px;
    cursor: pointer;
  }
}
</style>
