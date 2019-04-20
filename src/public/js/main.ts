import axios from "axios";
import * as M from "materialize-css";
import Vue from "vue";

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
      scheduledRegistrations: [],
      selectedReg: "",
      url: "",
    };
  },
  el: "#app",
  methods: {
    scheduleRegistration() {
      console.log("req to schedule reg for " + this.url);
      const lesson = {
        url: this.url
      };
      this.isLoading = true;
      axios
        .post( "/api/registration/add", lesson )
        .then( ( res: any ) => {
          this.url = "";
          this.loadScheduledRegistrations();
        })
        .catch((err: any) => {
          console.log( err );
          this.errorMessage = err;
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
      return this.loadScheduledRegistrations();
  }
});
