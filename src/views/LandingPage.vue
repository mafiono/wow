<template>
  <div class="lp-social">
    <div class="triple-section welcome">
      <div class="triple-section--top">
        <router-link to="/"><Icon name="logo" :height="65"></Icon></router-link>
      </div>
      <div class="triple-section--middle container">
        <h1>THE BEST FREE-PLAY <strong>SOCIAL CASINO</strong></h1>
        <p class="standout">
          Welcome to WOW Vegas, your #1 choice to play the best free social casino games.
        </p>
        <template v-if="!signedInBefore">
          <div>
            <Button type="secondary" tag="router-link" :to="{ name: 'Register' }">
              CLAIM 5,000 FREE COINS
            </Button>
          </div>
        </template>
        <template v-else>
          <div><Button type="secondary" tag="router-link" :to="{ name: 'Login' }">Log in</Button></div>
        </template>
        <div class="lp-help">
          <p class="standout standout--dwa">
            <span class="newlmob">JOIN NOW &</span> START WINNING TODAY!
          </p>
        </div>
      </div>
      <div class="triple-section--bottom">
        <router-link v-if="!loggedIn && !signedInBefore" to="/login">Already have an account? Log in &gt;</router-link>
        <router-link v-else-if="!loggedIn && signedInBefore" to="/Register">Don't have an account? Sign up!</router-link>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--games landing-page-section--blue">
      <div class="container">
        <h2>WIN WITH OVER 400 EXCITING <strong>SOCIAL CASINO-STYLE GAMES</strong></h2>
        <p class="subtitle">
          With our huge selection of games, the fun never stops
        </p>
        <div class="container-small">
          <template v-if="newGames">
            <div class="category-tag-c">
              <div class="category-tag" @click="$router.push({ name: 'Register' })">New Games</div>
              <div class="category-tag" @click="$router.push({ name: 'Register' })">All Games</div>
              <div class="category-tag" @click="$router.push({ name: 'Register' })">Classic Slots</div>
            </div>
            <thumbnails-grid :games="newGames"></thumbnails-grid>
          </template>
        </div>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--tiles">
      <div class="container">
        <div class="container-small">
          <h2>MORE REASONS TO <strong>JOIN TODAY</strong></h2>
          <div class="tiles">
            <div class="tile">
              <h3><div class="title-icon"><font-awesome-icon :icon="['fa', 'users']" /></div> Join Thousands of Players</h3>
              <p>Hundreds of thousands of players have joined our social casino community already, with more and more winners joining every day!</p>
            </div>
            <div class="tile">
              <h3><div class="title-icon"><font-awesome-icon :icon="['fa', 'headset']" /></div> <span class="desk-break">24/7</span> Customer Help</h3>
              <p>Get the assistance you need quickly and efficiently with our 24/7 customer help team</p>
            </div>
            <div class="tile">
              <h3><div class="title-icon"><font-awesome-icon :icon="['fa', 'play']" /></div> New Games Launched Weekly</h3>
              <p>Every week we launch exciting new Vegas casino-style games to keep you on the edge of your seat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="landing-page-section landing-page-section--start-playing">
      <div class="container">
        <div class="container-small">
          <h2>WOW COINS: FUN THAT NEVER STOPS</h2>
          <p>
            With WOW Coins, you don’t need to spend money to have fun.  Play the latest and greatest social casino-style games completely FREE.
          </p>
          <div><Button type="secondary" tag="router-link" :to="{ name: 'Register' }">Start winning now</Button></div>
        </div>
      </div>
    </div> -->
    <!-- <div class="landing-page-section landing-page-section--start-playing landing-page-section--blue">
      <div class="container">
        <div class="container-small">
          <h2>WIN MORE WITH <img src="https://cdn2.wowvegas.com/assets/WOWzer-Logo-WOW-small-1.png" class="wowzer-inline" alt="WOWzer Logo"></h2>
          <p class="subtitle">
            Enter our daily WOWZER game and win more WOW COINS
          </p>
          <template v-if="slotGames">
            <thumbnails-grid :games="slotGames"></thumbnails-grid>
          </template>
          <div><Button type="secondary" tag="router-link" :to="{ name: 'Register' }">Start winning now</Button></div>
        </div>
      </div>
    </div> -->
    <div class="landing-page-section landing-page-section--grab landing-page-section--blue">
      <div class="container">
        <div class="caracter caracter-10 caracter--right">
          <img src="https://cdn2.wowvegas.com/assets/wowvegas-char10-opt.png">
        </div>
        <div class="container-small">
          <h2>GRAB YOUR FREE COINS</h2>
          <p class="subtitle">
            Start winning today!
          </p>
          <div><Button type="secondary" tag="router-link" :to="{ name: 'Register' }">JOIN NOW</Button></div>
        </div>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--testimonials">
      <div class="container">
        <div class="container-small">
          <h2>What our <strong>player community</strong> is saying about us</h2>
          <p class="subtitle">
            Our happy players recommend WOW Vegas! Below are a few recent examples....
          </p>
          <div class="testimonies-slider__ellipse">
            <span class="first"></span>
            <span class="mid"></span>
            <span class="last"></span>
          </div>
          <div class="testimonies-slider">
            <figure class="testimonies-slider__item">
              <blockquote>
                <div class="lpreview-flex">
                  <div class="lpreview-left">
                    <div class="lpreview-avatar">
                      <font-awesome-icon :icon="['fa', 'user']" />
                    </div>
                    <h3>Natalie T</h3>
                    <h5><small>Utah, US</small></h5>
                    <div class="stars5">
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                    </div>
                  </div>
                  <div class="lpreview-right">
                    <div class="review-inner">
                      <p>
                        I recently had a great experience on Wow & the customer service is top notch! I also love the variety of games
                        they offer! Thank you Wow! Your name is how I feel, WOW!!! Definitely give them a shot! You won't be sorry!
                      </p>
                    </div>
                    <cite class="author">
                      <small>Date of Review: 01/24/2023</small>
                    </cite>
                  </div>
                </div>
              </blockquote>
            </figure>
            <figure class="testimonies-slider__item">
              <blockquote>
                <div class="lpreview-flex">
                  <div class="lpreview-left">
                    <div class="lpreview-avatar">
                      <font-awesome-icon :icon="['fa', 'user']" />
                    </div>
                    <h3>Emily W.</h3>
                    <h5><small>Oregon, US</small></h5>
                    <div class="stars5">
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                    </div>
                  </div>
                  <div class="lpreview-right">
                    <div class="review-inner">
                      <p>Wow Vegas is really good. Tons of fun games to choose from. Customer service is excellent.</p>
                    </div>
                    <cite class="author">
                      <small>Date of Review: 02/11/2023</small>
                    </cite>
                  </div>
                </div>
              </blockquote>
            </figure>
            <figure class="testimonies-slider__item">
              <blockquote>
                <div class="lpreview-flex">
                  <div class="lpreview-left">
                    <div class="lpreview-avatar">
                      <font-awesome-icon :icon="['fa', 'user']" />
                    </div>
                    <h3>Thomas F.</h3>
                    <h5><small>Texas, US</small></h5>
                    <div class="stars5">
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                      <font-awesome-icon :icon="['fa', 'star']" />
                    </div>
                  </div>
                  <div class="lpreview-right">
                    <div class="review-inner">
                      <p>I really enjoy playing at WOW Vegas, there's so many games to choose from and the site is so quick and easy to use. The customer help team is great too, everything is handled quickly and politely. Big recommendation from me!</p>
                    </div>
                    <cite class="author">
                      <small>Date of Review: 02/05/2023</small>
                    </cite>
                  </div>
                </div>
              </blockquote>
            </figure>
          </div>
          <div><Button type="secondary" tag="router-link" :to="{ name: 'Register' }">JOIN NOW</Button></div>
        </div>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--no-purchase2 landing-page-section--white">
      <div class="container">
        <div class="caracter caracter-13 caracter--left">
          <img src="https://cdn2.wowvegas.com/assets/wowvegas-char113-opt.png">
        </div>
        <div class="container-small">
          <h2 class="h1">NO PURCHASE NECESSARY</h2>
          <p class="subtitle">
            At WOW Vegas you can always play for free and focus on the fun
          </p>
          <div><Button type="secondary" tag="router-link" :to="{ name: 'Register' }">Play for free</Button></div>
        </div>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--enjoy landing-page-section--blue">
      <div class="container">
        <div class="caracter caracter-12 caracter--right">
          <img src="https://cdn2.wowvegas.com/assets/wowvegas-char12-3-opt.png">
        </div>
        <div class="container-small">
          <h2>ENJOY 24/7 FUN WITH <strong class="nowrap">WOW COINS</strong></h2>
          <p>
            Play the very best newly released Vegas-style social casino games with WOW Coins. Choose from amazing games including Sugar Rush, Wilds of Fortune, Big Bass Bonanza and many more.
          </p>
          <p>Keep the fun going by unlocking extra spins, bonus rounds and more.</p>
          <p>Feel the real thrills of Vegas at your fingertips.</p>
        </div>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--tiles landing-page-section--tiles--dwa">
      <div class="container">
        <div class="container-small">
          <h2>PREPARE TO BE <strong>WOWED!</strong></h2>
          <div class="tiles">
            <div class="tile">
              <h3><div class="title-icon"><font-awesome-icon :icon="['fa', 'play']" /></div> Play For Free</h3>
              <p>
                Enjoy the fun for free. Focus on having fun with our social casino community and don't worry about parting with your cash.
              </p>
            </div>
            <div class="tile">
              <h3><div class="title-icon"><font-awesome-icon :icon="['fa', 'gamepad']" /></div> 100's of Games</h3>
              <p>
                With such a huge games selection, there is something for everyone. We are constantly adding new games so you will be spoiled for choice!
              </p>
            </div>
            <div class="tile">
              <h3><div class="title-icon"><font-awesome-icon :icon="['fa', 'bolt']" /></div> Instant Play</h3>
              <p>
                No downloads are required to play at WOW Vegas.<br/>
                Simply click on any game to begin playing from your PC, Mac, Smartphone or Tablet instantly.
              </p>
            </div>
          </div>
        </div>
        <div class="caracter caracter-11 caracter--left">
          <img src="https://cdn2.wowvegas.com/assets/wowvegas-char11-6-opt.png">
        </div>
      </div>
    </div>
    <div class="landing-page-section landing-page-section--no-purchase">
      <div class="container">
        <div class="container-small">
          <Icon name="logo" :height="65"></Icon>
          <div class="tile-x">
            <h2>Welcome to WOW Vegas</h2>
            <p>
              Your number one destination for social casino-style games! It's time to explore our amazing
              selection and pick your favourites.
            </p>
            <p>
              Our thriving social casino community is focussed entirely on having fun, so why
              not join the WOW Vegas party and start winning today?
            </p><br />
            <div><Button type="secondary" tag="router-link" :to="{ name: 'Register' }">JOIN NOW</Button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/atoms/Icon.vue';
import Button from '@/components/atoms/Button.vue';
import ThumbnailsGrid from '../components/molecules/ThumbnailsGrid.vue';

export default {
  components: {
    Icon,
    Button,
    ThumbnailsGrid,
  },
  data() {
    return {
      newGames: null,
      slotGames: null,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    signedInBefore() {
      return localStorage.signedInBefore;
    },
    currentCountryCode() {
      return this.$store.getters.currentCountryCode;
    },
  },
  created() {
    const pageId = process.env.VUE_APP_API_PAGEID_LANDING_PAGE;
    this.$store.dispatch('enableLoader');
    this.$apiCmsNew.get(`/pages/${pageId}`)
      .then(async (responsePage) => {
        console.log('responsePage', responsePage);
        const { games } = responsePage.data;
        const gamesIds = `?include[]=${games.join('&include[]=')}`;
        const responseGames = this.$apiCmsNew.get(`game${gamesIds}&per_page=15`);
        const { slots } = responsePage.data;
        const slotsIds = `?include[]=${slots.join('&include[]=')}`;
        const slotResponseGames = this.$apiCmsNew.get(`game${slotsIds}&per_page=15`);
        try {
          const values = await Promise.all([
            responseGames,
            slotResponseGames,
          ]);
          const gamesLp = [];
          const slotsLp = [];
          values[0].data.forEach((game) => {
            gamesLp.push({
              gameId: game.id.toString(),
              image: game.game_thumbnail_new?.sizes.medium,
              name: game.title.rendered,
              gameSlug: game.slug,
              platform: game.game_provider.name,
              platformName: game.game_provider.slug,
              categories: game.game_category,
            });
          });
          values[1].data.forEach((game) => {
            slotsLp.push({
              gameId: game.id.toString(),
              image: game.game_thumbnail_new?.sizes.medium,
              name: game.title.rendered,
              gameSlug: game.slug,
              platform: game.game_provider.name,
              platformName: game.game_provider.slug,
            });
          });
          this.newGames = gamesLp;
          this.slotGames = slotsLp;
        } catch (e) {
          console.log('Caught error', e);
        } finally {
          this.$store.dispatch('disableLoader');
          console.log('finally');
        }
      }).catch((error) => {
        console.log(error);
        this.$store.dispatch('disableLoader');
      });
  },
  methods: {
    //
  },
};
</script>

<style>
@media (max-width: 767px) {
  .landing-page-section--games .game-thumbnail:last-child {
    display: none;
  }
}
</style>
