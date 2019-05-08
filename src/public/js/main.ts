import axios from "axios";
import { RSA_PKCS1_PADDING } from "constants";
import { publicEncrypt } from "crypto";
import * as M from "materialize-css";
import Vue from "vue";

// TODO use the one in shared
export function encryptStringWithRsaPublicKey(toEncrypt: string, publicKey: string): string {
    const buffer = Buffer.from(toEncrypt);
    const encrypted = publicEncrypt({key: publicKey, padding: RSA_PKCS1_PADDING}, buffer);
    return encrypted.toString("base64");
}

// tslint:disable-next-line no-unused-expression
new Vue( {
  computed: {
      hasScheduled(): boolean {
          return this.isLoading === false && this.scheduledRegistrations.length > 0;
      }
  },
  data() {
    return {
      errorMessage: "",
      isLoading: true,
      password: "",
      publicKey: "",
      scheduledRegistrations: [],
      selectedReg: "",
      url: "",
      user: "",
    };
  },
  el: "#app",
  methods: {
    scheduleRegistration() {
      console.log("req to schedule reg for " + this.url);
      const passwordEnc = encryptStringWithRsaPublicKey(this.password, this.publicKey);
      const lesson = {
        passwordEnc,
        url: this.url,
        user: this.user,
      };
      this.isLoading = true;
      axios
        .post( "/api/registration/add", lesson )
        .then( ( res: any ) => {
          this.url = "";
          this.user = "";
          this.password = "";
          this.loadScheduledRegistrations();
        })
        .catch((err: any) => {
          this.isLoading = false;
          console.log(err);
          this.errorMessage = err.response.data.error || err;
        });
    },
    confirmCancelRegistration(name: string) {
      this.selectedReg = name;
      const dc = this.$refs.cancelConfirm;
      const modal = M.Modal.init( dc );
      modal.open();
    },
    cancelRegistration(name: string) {
      const reg = { name };
      axios
        .post(`/api/registration/cancel`, reg)
        .then(this.loadScheduledRegistrations)
        .catch((err: any) => {
          console.log(err);
          this.errorMessage = err;
        });
    },
    loadPublicKey() {
      this.isLoading = true;
      axios
        .get("/api/publickey")
        .then((res: any) => {
          this.isLoading = false;
          this.publicKey = res.data;
        } )
        .catch((err: any) => {
          console.log(err);
          this.errorMessage = err;
        } );
    },
    loadScheduledRegistrations() {
      this.isLoading = true;
      axios
        .get("/api/registration/all")
        .then((res: any) => {
          this.isLoading = false;
          this.scheduledRegistrations = res.data;
        } )
        .catch((err: any) => {
          console.log(err);
          this.errorMessage = err;
        } );
    }
  },
  mounted() {
    return axios.all([this.loadScheduledRegistrations(), this.loadPublicKey()]);
  }
});
