<template>
  <div class="game-thumbnail" :class="{isFavorite}" :style="`width:${width}px`" v-if="path" @click="goToGame($event, gamePath)">
    <div class="game-thumbnail__img">
      <transition name="fade-thumbnail">
        <img v-show="loaded" :src="path" v-on:load="onLoaded">
      </transition>
      <div v-if="!loaded" class="thumbnail-square-loader">
        <content-placeholders>
          <content-placeholders-img />
        </content-placeholders>
      </div>
    </div>
    <div class="game-thumbnail__layer">
      <div>
        <Button type="primary" :width="121" tag="router-link" :to="gamePath" style="text-align: center">Play Now</Button>
      </div>
    </div>
    <Icon v-if="loggedIn" name="heart" :height="28"></icon>
    <div v-if="isNew" class="new-label">NEW</div>
  </div>
</template>

<script>
import Button from '@/components/atoms/Button.vue';
import Icon from './Icon.vue';

export default {
  data() {
    return {
      loaded: false,
    };
  },
  props: {
    image: {
      type: String,
      required: true,
    },
    slug: String,
    id: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    platformName: String,
    tableId: String,
    width: Number,
    name: String,
    date: String,
    categories: {
      type: Array,
      required: false,
    },
    category: {
      type: [String, Number],
      required: false,
    },
  },
  components: {
    Button,
    Icon,
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    path() {
      if (this.image.includes('http:') || this.image.includes('https:')) {
        return this.image;
      } if (this.image === '') {
        return require(`../../assets/img/image-placeholder.jpg`);
      }
      return require(`../../assets/img/${this.image}`);
    },
    gamePath() {
      const { slug } = this;
      const path = { name: 'Play', params: { slug } };
      return path;
    },
    favoriteGames() {
      return this.$store.getters.favoriteGames;
    },
    isFavorite() {
      if (!this.favoriteGames || !this.favoriteGames.length) {
        return false;
      }
      if (this.favoriteGames.find((game) => game.gameId === this.id)) {
        return true;
      }
      return false;
    },
    isNew() {
      if (this.categories && this.categories.length && this.categories.includes(2)) {
        return true;
      }
      if (this.category && (this.category === 2 || this.category === '2')) {
        return true;
      }
      if (!this.date) {
        return false;
      }
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 5);

      const date = new Date(this.date);
      return date >= weekAgo && date <= today;
    },
  },
  methods: {
    goToGame(event, gamePath) {
      if (event.target.classList.contains('icon-heart')) {
        if (!this.isFavorite) {
          this.addToFavourites();
        } else {
          this.removeFavourite();
        }
        return;
      }
      this.$router.push(gamePath);
    },
    onLoaded() {
      this.loaded = true;
    },
    async addToFavourites() {
      this.$store.dispatch('enableLoader');
      await this.$apiToken.get('addFavoriteGame', {
        params: {
          platformCode: this.platform,
          gameId: this.id,
        },
      }).then((result) => {
        if (result.data.status === 'SUCCESS') {
          this.$noty.error(`Game added to your favorites!`);
          this.$store.dispatch('getFavoriteGames');
        } else {
          this.$store.dispatch('disableLoader');
        }
      }).catch(() => {
        this.$store.dispatch('disableLoader');
      });
    },
    async removeFavourite() {
      this.$store.dispatch('enableLoader');
      await this.$apiToken.get('removeFavoriteGame', {
        params: {
          platformCode: this.platform,
          gameId: this.id,
        },
      }).then((result) => {
        if (result.data.status === 'SUCCESS') {
          this.$noty.error(`Game removed from your favorites!`);
          this.$store.dispatch('getFavoriteGames');
        } else {
          this.$store.dispatch('disableLoader');
        }
      }).catch(() => {
        this.$store.dispatch('disableLoader');
      });
    },
  },
};
</script>

<style lang="scss">
.game-thumbnail .icon-heart {
  position: absolute;
  top: 2px;
  right: 3px;
  filter: drop-shadow(0px 0px 3px black);
  z-index: 1;
}
.game-thumbnail .icon-heart>path {
  transition: 0.2s all ease-in-out;
}
.game-thumbnail.isFavorite .icon-heart>path {
  fill: red !important;
}
.game-thumbnail.isFavorite .icon-heart>path:nth-child(2) {
  fill-opacity: .5;
}
.game-thumbnail__img:after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: red;
  background: -moz-linear-gradient(225deg, rgba(0,0,0,0.7525603991596639) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 100%);
  background: -webkit-linear-gradient(225deg, rgba(0,0,0,0.7525603991596639) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 100%);
  background: linear-gradient(225deg, rgba(0,0,0,0.7525603991596639) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 100%);
}
.game-thumbnail .icon-heart>path {
  pointer-events: none;
}
.game-thumbnail .icon-heart>path:nth-child(1) {
  fill-opacity: .9;
}
.game-thumbnail .new-label {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  font-size: 10px;
  font-weight: 800;
  background: linear-gradient(180deg,#0054ff,#00c7ff);
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
  @media (max-width: 768px) {
    font-size: 8px;
    padding: 2px 7px;
    left: 4px;
    top: 4px;
  }
}

@media (min-width: 769px) {
  .game-thumbnail .icon-heart:hover>path {
    fill: red !important;
  }
}
</style>
