<template>
  <div class="bonus" :class="{ imageIn }" @click="$emit('click');">
    <div v-if="offerimage" :style="`background-image: url('${offerimage}')`" class="bonus--img">
      <img v-if="imageIn" :src="offerimage" class="offerimgle" />
    </div>
    <div class="bonus--right">
      <div class="bonus--top">
        <icon v-if="freecoins" name="blue_coin" :height="60"></icon>
        <h2><span v-if="freecoinsrising" class="strike-through">{{ computeRisingCoins }}</span><span v-else-if="exclabel" class="exclabel">{{ exclabel }}</span><div v-html="computedDescription"></div></h2>
        <Button type="secondary" class="is-fullwidth"><small>BUY NOW FOR</small><div><s v-if="priceold">{{ priceold | formatMoney('USD') }}</s>{{ price | formatMoney('USD') }}</div></Button>
      </div>
      <div v-if="sweep" class="bonus--bottom">
        <div v-if="computedDescription2" class="bonus-footer">
          <icon v-if="sweepcoins" name="gold_coin" :height="18"></icon>
          <p v-html="computedDescription2"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  props: ['price', 'priceold', 'freecoins', 'freecoinsrising', 'sweepcoins', 'description', 'description2', 'bonusid', 'offerimage', 'sweep', 'callout', 'exclabel'],
  components: {
    Icon,
    Button,
  },
  computed: {
    computeRisingCoins() {
      if (!this.freecoins || this.freecoins === '0' || !this.freecoinsrising) {
        return null;
      }
      return parseInt(this.freecoinsrising, 10).toLocaleString('en-US');
    },
    computedDescription() {
      if (!this.freecoins || this.freecoins === '0') {
        return null;
      }
      return `<span class="wowcoinsamt">${parseInt(this.freecoins, 10).toLocaleString('en-US')}</span><span>WOW Coins</span>`;
    },
    computedDescription2() {
      if (!this.sweepcoins || this.sweepcoins === '0') {
        return null;
      }
      return `<strong>+ GET ${this.sweepcoins} FREE SC</strong>`;
    },
    imageIn() {
      if (!this.offerimage) {
        return false;
      }
      return !this.offerimage?.includes('most-popular-1');
    },
  },
};
</script>
