<template>
  <modal :opened="(sweepRulesNeedAccepting && $route.meta.requiresAuth === 'yes')" name="sweep-modal" ref="modal" :closeButton="false">
    <div class="sweep-modal">
      <div class="sweep-modal-inner">
        <div class="content">
          <h3>Switch your play</h3>
          <h2 style="margin-top: -1rem;">between WOW coins and Sweepstakes coins</h2>
          <p>WOW coins can be used for fun play at any time, however you can switch your play to Sweepstakes coins and redeem your winnings for real cash prizes!</p>
          <p class="flex"><Icon name="gold_coin" :height="25"></Icon><strong>1 SWEEPSTAKES COIN (SC) = 1 USD</strong></p>
          <p class="form-help">Please read and accept the Sweepstakes rules here before playing Sweepstakes coin games</p>
        </div>
        <form @submit.prevent="submitForm">
          <div class="margin-block">
            <div class="checkbox-group">
              <FormInput :name="tctext" type="checkbox" v-model="temsAccepted" expanded></FormInput>
              <div v-if="submitted && $v.temsAccepted.$error" class="error error--checkbox">
                <span>You need to accept the terms above</span>
              </div>
            </div>
          </div>
          <Button type="primary" native-type="submit" :loading="loading">Let's go</Button>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
import Icon from '@/components/atoms/Icon.vue';
import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';
import { mapGetters } from 'vuex';
import { sameAs } from 'vuelidate/lib/validators';

export default {
  props: {
    //
  },
  data() {
    return {
      loading: false,
      submitted: false,
      tctext: 'I agree with the <a href="/sweepstakes-rules">Sweepstakes Rules</a>',
      temsAccepted: false,
    };
  },
  validations: {
    temsAccepted: {
      sameAs: sameAs(() => true),
    },
  },
  components: {
    Modal,
    FormInput,
    Button,
    Icon,
  },
  computed: {
    ...mapGetters(['playerData', 'sweepRulesNeedAccepting', 'sweepRulesConsentVersion']),
    sweepRulesConsentVersionId() {
      return this.sweepRulesConsentVersion?.consent.consentVersionId;
    },
  },
  methods: {
    async acceptSweepRules() {
      this.loading = true;
      await this.$store.dispatch('updateUserConsents', {
        consentedVersions: [this.sweepRulesConsentVersionId],
      });
      await this.$store.dispatch('updateExtraInfo', { acceptedSweepRules: true });
      this.loading = false;
    },
    submitForm() {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.acceptSweepRules();
      }
    },
    fillPlayerData(playerData) {
      if (playerData && playerData.mobilePhone) {
        this.mobilePhoneStr = playerData.mobilePhone;
      }
    },
  },
  watch: {
    // playerData is not ready when mounted (when user enters page directly from url)
    playerData(playerDataReady) {
      if (playerDataReady) {
        this.fillPlayerData(playerDataReady);
      }
    },
  },
  mounted() {
    if (this.playerData) {
      this.fillPlayerData(this.playerData);
    }
  },
};
</script>

<style lang="scss">
.sweep-modal {
  width: 850px;
  background: linear-gradient(180deg, #4B33DF 0%, #0A052A 100%);
  background-image: url('https://cdn2.wowvegas.com/assets/pop-bg.jpg');
  background-position: center;
  background-size: cover;
  max-height: 70vh;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 0 100px 5px rgb(0, 0, 0, 0.60);

  .vue-tel-input {
    width: 400px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  #app & input.vti__input {
    background: #fff;
    color: #000;
    letter-spacing: 1px;
  }

  #app & .vti__dropdown {
    border-right: 2px solid rgb(0 0 0 / 22%);
    background: #ffffff;
    color: #2c2c2c;
    font-size: 12px;
  }

  #app & .vti__dropdown-list {
    background-color: #ffffff;
  }

  #app & .vti__dropdown-item.highlighted {
    background-color: rgb(177 212 255);
  }

  img.wow-sweep-logo {
    width: 150px;
    margin-bottom: 2rem;
  }

  .content {
    font-size: 16px;
    letter-spacing: 1px;
    margin-bottom: 2rem;
    width: 700px;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }

  .input-group .label {
    font-size: 16px;
    letter-spacing: 1px;
  }

  ul.ticks {
    list-style-type: none;
    display: flex;
    font-size: 11px;
    justify-content: center;
    font-weight: 600;
    padding: 0;
    margin-left: -1rem;
    margin-right: -1rem;
    margin-bottom: 2rem;
    align-items: center;
  }

  ul.ticks .tick {
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }

  ul.ticks>li {
    padding-left: .5rem;
    padding-right: 0.5rem;
    display: flex;
    align-items: center;
    text-align: left;
  }

  input.input {
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    color: #000;
  }

  input.input {
    margin-left: auto;
    margin-right: auto;
    background: #fff;
    color: #000;
  }

  .checkbox-label .checkmark {
    position: relative;
    margin-right: 13px;
  }

  label.checkbox-label {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  p.flex {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }

  p.flex>.icon {
    margin-right: 10px;
  }
  .error.error--checkbox {
    text-align: center;
    padding: 0;
  }
  .form-help {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 1px;
    width: 600px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }
}
.sweep-modal-inner {
  width: 100%;
}

@media (max-width: 767px) {
  .sweep-modal{
    max-height: calc(100vh - 4rem);
    padding: 2rem 1rem;
    background-position: top right;

    .content {
      font-size: 13px;
    }
    .vue-tel-input {
      width: 100%;
    }
    #app & input.vti__input {
      min-width: unset;
    }
    p.form-help {
      font-size: 11px;
      line-height: 1.1;
      letter-spacing: .5px;
    }
    ul.ticks {
      flex-direction: column;
    }
    ul.ticks > li {
      margin-bottom: 8px;
    }
  }
}
</style>
