<template>
  <div v-if="horizontalCategories && horizontalCategories.length" class="horizontal-menu" ref="horizontalMenu">
    <router-link class="link" :to="{ name: 'Lobby' }">
      <h4>Lobby</h4>
    </router-link>
    <router-link v-if="sweep" class="link" :to="{ name: 'Jackpots' }">
      <h4>Prize Drops</h4>
    </router-link>
    <router-link class="link" v-for="category in horizontalCategories" :key="category.id"
      :to="{ name: 'Lobby', query: { category: category.slug } }">
      <h4>{{ category.name }}</h4>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //
    };
  },
  computed: {
    horizontalCategories() {
      return this.$store.getters.horizontalCategories;
    },
    currentCategorySlug() {
      return this.$route.query.category;
    },
    sweep() {
      return this.$store.getters.sweep;
    },
  },
  methods: {
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
  mounted() {
    setTimeout(() => {
      this.findActiveAndScroll();
    }, 700);
  },
  watch: {
    currentCategorySlug() {
      this.$nextTick(() => {
        this.findActiveAndScroll();
      });
    },
  },
};
</script>
