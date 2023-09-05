<template>
  <div class="cs-bridge">
    <h3>Welcome to <span style="white-space: nowrap;">24/7 Customer Help</span></h3>
    <p>Thanks for entering our 24/7 Customer Help Section, please follow the steps below before opening your support ticket.</p>
    <form @submit.prevent="acceptStep1">
      <div class="margin-block">
        <div class="checkbox-group">
          <FormInput :name="tctext1" type="checkbox" v-model="tems1Accepted" expanded></FormInput>
          <div v-if="submitted && $v.tems1Accepted.$error" class="error error--checkbox">
            <span>You need to accept the terms above</span>
          </div>
        </div>
        <div class="checkbox-group">
          <FormInput :name="tctext2" type="checkbox" v-model="tems2Accepted" expanded></FormInput>
          <div v-if="submitted && $v.tems2Accepted.$error" class="error error--checkbox">
            <span>You need to accept the terms above</span>
          </div>
        </div>
      </div>
      <Button type="primary" native-type="submit" style="width: auto;">Create Support Ticket</Button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { sameAs } from 'vuelidate/lib/validators';

import FormInput from '@/components/atoms/FormInput.vue';
import Button from '@/components/atoms/Button.vue';

export default {
  data() {
    return {
      submitted: false,
      tems1Accepted: false,
      tctext2: 'I acknowledge that it can take up to 24 hours to receive a response to my support ticket',
      tems2Accepted: false,
    };
  },
  validations: {
    tems1Accepted: {
      sameAs: sameAs(() => true),
    },
    tems2Accepted: {
      sameAs: sameAs(() => true),
    },
  },
  components: {
    FormInput,
    Button,
  },
  computed: {
    ...mapGetters(['playerData', 'sweep']),
    tctext1() {
      if (this.sweep) {
        return 'I have checked the <a href="/faq">FAQ</a>, <a href="/payment-faq">Payment Help</a>, and <a href="/verification-faq">Verification FAQ</a>, and cannot find an answer to my question';
      }
      return 'I have checked the <a href="/faq">FAQ</a> and cannot find an answer to my question';
    },
  },
  methods: {
    acceptStep1() {
      this.submitted = true;
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit('accepted');
      }
    },
  },
};
</script>

<style>
.cs-bridge {
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 5rem;
  min-height: 40vh;
}
.cs-bridge h3 {
  margin-bottom: 2rem;
}
.cs-bridge .margin-block {
  width: 730px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.cs-bridge .margin-block .checkbox-label {
  display: inline-block;
  text-align: center;
}
.cs-bridge .error.error--checkbox {
  padding-left: 0;
  text-align: center;
  margin-top: -10px !important;
  margin-bottom: 7px !important;
}
@media (max-width: 768px) {
  .cs-bridge span.checkmark {
    top: 50% !important;
    transform: translateY(-50%);
  }
}
</style>
