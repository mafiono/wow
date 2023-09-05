<template>
  <div v-if="games" class="grid-thumbnails">
    <GameThumbnail v-for="(game, index) in games"
      :key="index"
      :image="game.image"
      :id="game.gameId"
      :slug="game.gameSlug"
      :platform="game.platform"
      :platformName="game.platformName"
      :tableId="game.tableId"
      :name="game.name"
      :date="game.date"
      :categories="game.categories"
      :category="game.category">
    </GameThumbnail>
  </div>
</template>

<script>
import GameThumbnail from '@/components/atoms/GameThumbnail.vue';

export default {
  props: {
    games: {
      type: Array,
      required: true,
    },
  },
  components: {
    GameThumbnail,
  },
};
</script>
