<template>
  <modal :opened="((haveToAcceptNewSweepRules || haveToAcceptNewTermsAndConditions) && $route.meta.requiresAuth === 'yes' && $route.path !== '/sweepstakes-rules')" name="sweep-modal" ref="modal" :closeButton="false">
    <div class="sweep-modal">
      <div class="sweep-modal-inner">
        <div class="content">
          <h3>{{ modalTitle }}</h3>
          <p>Please confirm you accept the terms and conditions below</p>
        </div>
        <form @submit.prevent="submitForm">
          <div class="margin-block">
            <div v-if="haveToAcceptNewSweepRules" class="checkbox-group">
              <FormInput :name="checkboxSweep" type="checkbox" v-model="temsAccepted" expanded></FormInput>
              <div v-if="submitted && $v.temsAccepted.$error" class="error error--checkbox">
                <span>You need to accept the terms above</span>
              </div>
            </div>
            <div v-if="haveToAcceptNewTermsAndConditions" class="checkbox-group">
              <FormInput :name="checkboxTc" type="checkbox" v-model="temsAccepted2" expanded></FormInput>
              <div v-if="submitted && $v.temsAccepted2.$error" class="error error--checkbox">
                <span>You need to accept the terms above</span>
              </div>
            </div>
          </div>
          <Button type="primary" native-type="submit" :loading="loading">Continue</Button>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/templates/Modal.vue';
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
      tctext: 'I agree with the <a href="/sweepstakes-rules">Sweepstakes Rules Version 4.0</a>',
      tctext2: 'I agree with the <a href="/terms-and-conditions">Terms and Conditions</a>',
      temsAccepted: false,
      temsAccepted2: false,
      defaultTitle: 'Terms update',
      defaultDescription: 'Please confirm you accept the terms and conditions below',
    };
  },
  validations() {
    const validations = {};
    if (this.haveToAcceptNewSweepRules) {
      validations.temsAccepted = {
        sameAs: sameAs(() => true),
      };
    }
    if (this.haveToAcceptNewTermsAndConditions) {
      validations.temsAccepted2 = {
        sameAs: sameAs(() => true),
      };
    }
    return validations;
  },
  components: {
    Modal,
    FormInput,
    Button,
  },
  computed: {
    ...mapGetters(['playerData', 'haveToAcceptNewSweepRules', 'haveToAcceptNewTermsAndConditions', 'sweepRulesConsentVersion', 'termsAndConditionsConsentVersion', 'termsUpdate']),
    sweepRulesConsentVersionNumber() {
      return this.sweepRulesConsentVersion?.consent.version;
    },
    sweepRulesConsentVersionId() {
      return this.sweepRulesConsentVersion?.consent.consentVersionId;
    },
    termsAndConditionsConsentVersionNumber() {
      return this.termsAndConditionsConsentVersion?.consent.version;
    },
    termsAndConditionsConsentVersionId() {
      return this.termsAndConditionsConsentVersion?.consent.consentVersionId;
    },
    checkboxSweep() {
      if (this.sweepRulesConsentVersionNumber) {
        return `I agree with the <a href="/sweepstakes-rules">Sweepstakes Rules version ${parseFloat(this.sweepRulesConsentVersionNumber).toFixed(1)}</a>`;
      }
      return 'I agree with the <a href="/sweepstakes-rules">Sweepstakes Rules</a>';
    },
    checkboxTc() {
      if (this.termsAndConditionsConsentVersionNumber) {
        return `I agree with the <a href="/terms-and-conditions">Terms and Conditions version ${parseFloat(this.termsAndConditionsConsentVersionNumber).toFixed(1)}</a></a>`;
      }
      return 'I agree with the <a href="/terms-and-conditions">Terms and Conditions</a>';
    },
    modalTitle() {
      return this.termsUpdate?.title ? this.termsUpdate.title : this.defaultTitle;
    },
    modalDescription() {
      return this.termsUpdate?.description ? this.termsUpdate.description : this.defaultDescription;
    },
  },
  methods: {
    async acceptNewTerms() {
      this.loading = true;
      const acceptConsents = [];
      if (this.temsAccepted) {
        acceptConsents.push(this.sweepRulesConsentVersionId);
      }
      if (this.temsAccepted2) {
        acceptConsents.push(this.termsAndConditionsConsentVersionId);
      }
      await this.$store.dispatch('updateUserConsents', {
        consentedVersions: acceptConsents,
      });
      this.loading = false;
    },
    submitForm() {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.acceptNewTerms();
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
  .sweep-modal {
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
