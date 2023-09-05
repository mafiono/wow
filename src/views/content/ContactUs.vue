<template>
    <div class="section container">
      <template v-if="step === 1">
        <CsBridge @accepted="step = 2"></CsBridge>
      </template>
      <template v-else>
        <div v-if="!formSent" class="form-columns">
          <h3 v-text="title"></h3>
          <div v-html="content"></div>
          <form @submit.prevent="handleSendEmail">
            <div class="form-field half">
              <div class="input-group">
                <form-input name="First name" v-model="firstName"></form-input>
                <div v-if="submitted && $v.firstName.$error" class="error">
                  <span v-if="!$v.firstName.required">First name is required</span>
                </div>
              </div>
            </div>
            <div class="form-field half">
              <div class="input-group">
                <form-input name="Last name" v-model="lastName"></form-input>
                <div v-if="submitted && $v.lastName.$error" class="error">
                  <span v-if="!$v.lastName.required">Last name is required</span>
                </div>
              </div>
            </div>
            <div class="form-field full">
              <div class="input-group">
                <form-input name="Email" v-model="email"></form-input>
                <div v-if="submitted && $v.email.$error" class="error">
                  <span v-if="!$v.email.required">Email is required</span>
                  <span v-if="!$v.email.email">Email is invalid</span>
                </div>
              </div>
            </div>
            <div class="form-field full">
              <div class="input-group">
                <label class="label">
                  Please choose your issue below
                </label>
                <div class="select-wrapper" :class="{ 'sel-disabled': disable }">
                  <select class="input" v-model="selectedTag">
                    <option v-for="option in tags" :value="option.tagid" :key="`tag-${option.tagid}`">
                      {{ option.name }}
                    </option>
                  </select>
                </div>
                <div v-if="submitted && $v.selectedTag.$error" class="error">
                  <span v-if="!$v.selectedTag.required">This field is required</span>
                </div>
              </div>
            </div>
            <div class="form-field full">
              <div class="input-group">
                <form-input name="Subject" v-model="subject"></form-input>
                <div v-if="submitted && $v.subject.$error" class="error">
                  <span v-if="!$v.subject.required">Subject is required</span>
                </div>
              </div>
            </div>
            <div class="form-field full">
              <div class="input-group">
                <label class="label"> Message </label>
                <textarea v-model="message"></textarea>
                <div v-if="submitted && $v.message.$error" class="error">
                  <span v-if="!$v.message.required">Message is required</span>
                </div>
              </div>
            </div>
            <div class="form-field full">
              <Button type="primary" native-type="submit" :loading="loading">Send</Button>
            </div>
          </form>
        </div>
        <div v-if="formSent" class="contact-success">
          <h3>THANKS FOR CONTACTING US.</h3>
          <h5>Ticket Id: {{ formSent }}</h5>
          <h5>WE WILL GET BACK TO YOU WITHIN 24 HOURS. THANK YOU.</h5>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import { required, email } from 'vuelidate/lib/validators';
  
  import FormInput from '@/components/atoms/FormInput.vue';
  import Button from '@/components/atoms/Button.vue';
  import CsBridge from '../../components/organisms/CsBridge.vue';
  
  export default {
    data() {
      return {
        pageId: process.env.VUE_APP_API_PAGEID_CONTACT,
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
        loading: false,
        title: null,
        content: null,
        formSent: false,
        success: false,
        error: false,
        submitted: false,
        step: 1,
        selectedTag: null,
        tags: [
          { tagid: 'k14j', name: 'Account Issues' },
          { tagid: 'y8qk', name: 'General Queries' },
          { tagid: 'p6gr', name: 'Payments' },
          { tagid: 'g19d', name: 'Promos and Bonuses' },
          { tagid: 'xet3', name: 'Technical Issues' },
          { tagid: '3dtp', name: 'Verification' },
        ],
      };
    },
    validations: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      message: { required },
      subject: { required },
      selectedTag: { required },
    },
    components: {
      FormInput,
      Button,
      CsBridge,
    },
    computed: {
      ...mapGetters(['playerData']),
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      },
      getContactCmsUrl() {
        return this.$store.getters.endpointAPICMSNEW.replace('wp-json/wp/v2/', 'wp-json/ticket/v1/create');
      },
      parsedMessage() {
        return this.message.replace(/\n/g, '<br>');
      },
    },
    created() {
      this.$store.dispatch('enableLoader');
      this.$apiCmsNew.get(`/pages/${this.pageId}`).then((response) => {
        this.$store.dispatch('disableLoader');
        this.content = response.data.content.rendered;
        this.title = response.data.title.rendered;
      }).catch((error) => {
        this.$store.dispatch('disableLoader');
        if (error.response.status === 404) {
          this.$router.replace({ name: '404 Error' });
        }
      });
    },
    mounted() {
      if (this.playerData) {
        this.email = this.playerData.email;
        this.firstName = this.playerData.firstName;
        this.lastName = this.playerData.lastName;
      }
    },
    methods: {
      handleSendEmail() {
        this.submitted = true;
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.sendEmail();
        }
      },
      async sendEmail() {
        this.loading = true;
        // Prepare data for call
        const contactForm = new FormData();
        contactForm.append('firstName', this.firstName);
        contactForm.append('lastName', this.lastName);
        contactForm.append('email', this.email);
        contactForm.append('subject', this.subject);
        contactForm.append('message', this.parsedMessage);
        contactForm.append('tags', this.selectedTag);
        if (this.isLoggedIn && this.playerData?.userId) {
          contactForm.append('inputEmail', this.email);
          contactForm.append('userId', `${this.playerData.userId} (${this.playerData.email})`);
          contactForm.append('partyId', this.playerData.partyId);
        }
        // API call
        await this.$http.post(`${this.getContactCmsUrl}`, contactForm)
          .then((respose) => {
            this.success = true;
            this.formSent = respose.data.ticket_id;
            this.loading = false;
          })
          .catch((error) => {
            this.$noty.error(error.message);
            this.loading = false;
          });
      },
    },
    watch: {
      // playerData is not ready when mounted (when user enters page directly from url)
      playerData(playerDataReady) {
        if (playerDataReady) {
          this.email = this.playerData.email;
          this.firstName = this.playerData.firstName;
          this.lastName = this.playerData.lastName;
        }
      },
    },
  };
  </script>
  
  <style>
  .contact-success {
    text-align: center;
  }
  </style>
  