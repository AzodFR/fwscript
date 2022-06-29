import Fees from '.';
<template>
  <div class="fees">
    <div class="fee">
      <label class="energy-title">Fees:</label
      ><label
        :class="
          fees < 6
            ? 'energy-value cpu-low'
            : fees < 8
            ? 'energy-value cpu-mid'
            : 'energy-value cpu-high'
        "
        >{{ fees }}%</label
      >
    </div>

    <div class="token-fees">
      <div class="token">
        <b-button
          size="sm"
          v-b-tooltip.hover
          title="Activate this to widthraw automaticaly your FWW when 5% and send it to selected account (2FA on withdraw must be disable)."
          :variant="w ? 'success' : 'danger'"
          @click="switching(0)"
          >FWW: {{ w ? "ON" : "OFF" }}</b-button
        >
        <b-input
          @change="editAm(0)"
          type="number"
          class="keep"
          placeholder="Amount to keep"
          v-model="a_w"
          v-b-tooltip.hover
          title="Amount to keep"
        ></b-input>
      </div>
      <div class="token">
        <b-button
          size="sm"
          v-b-tooltip.hover
          title="Activate this to widthraw automaticaly your FWG when 5% and send it to selected account (2FA on withdraw must be disable)."
          :variant="g ? 'success' : 'danger'"
          @click="switching(1)"
          >FWG: {{ g ? "ON" : "OFF" }}</b-button
        >
        <b-input
          @change="editAm(1)"
          type="number"
          class="keep"
          placeholder="Amount to keep"
          v-model="a_g"
          v-b-tooltip.hover
          title="Amount to keep"
        ></b-input>
      </div>
      <div class="token">
        <b-button
          size="sm"
          v-b-tooltip.hover
          title="Activate this to widthraw automaticaly your FWF when 5% and send it to selected account (2FA on withdraw must be disable)."
          :variant="f ? 'success' : 'danger'"
          @click="switching(2)"
          >FWF: {{ f ? "ON" : "OFF" }}</b-button
        >
        <b-input
          @change="editAm(2)"
          type="number"
          class="keep"
          placeholder="Amount to keep"
          v-model="a_f"
          v-b-tooltip.hover
          title="Amount to keep"
        ></b-input>
      </div>
      <div class="goto">
        <b-button
          size="sm"
          v-b-tooltip.hover
          title="Leave blank if you just want to keep it in your wallet."
          :variant="wam != '' ? 'success' : 'danger'"
          disabled
          >Address to send:</b-button
        >
        <b-input
          type="text"
          class="to"
          placeholder="Wax address"
          v-b-tooltip.hover
          title="Leave blank if you just want to keep it in your wallet."
          v-model="wam"
          @change="editWam"
        ></b-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["user/getRs"]),
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      fees: 0,
      w: false,
      g: false,
      f: false,
      a_g: 0,
      a_w: 0,
      a_f: 0,
      wam: "",
      pushed: false,
    };
  },
  methods: {
    editWam() {
      localStorage.setItem("to", this.wam);
    },
    editAm(x) {
      if (!x) {
        localStorage.setItem("a_w", this.a_w);
      } else if (x == 1) {
        localStorage.setItem("a_g", this.a_g);
      } else if (x == 2) {
        localStorage.setItem("a_f", this.a_f);
      }
    },
    switching(x) {
      const list = ["w", "g", "f"];
      let choice;
      if (!x) {
        this.w = !this.w;
        choice = this.w;
      } else if (x == 1) {
        this.g = !this.g;
        choice = this.g;
      } else if (x == 2) {
        this.f = !this.f;
        choice = this.f;
      }
      localStorage.setItem(list[x], choice);
    },
    async fetchFees() {
      await fetch(
        `${this.$store.state.user.wax.rpc.endpoint}/v1/chain/get_table_rows`,
        {
          credentials: "omit",
          headers: {
            Accept: "*/*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "text/plain;charset=UTF-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
          },
          referrer: "https://thedefimining.io/",
          body: `{\"json\":true,\"code\":\"farmersworld\",\"scope\":\"farmersworld\",\"table\":\"config\",\"limit\":\"100\",\"reverse\":false,}`,
          method: "POST",
          mode: "cors",
        }
      )
        .then((x) => x.json())
        .then(async (rows) => {
          this.fees = rows.rows[0].fee;
        });
    },
    widthraw() {
      if (this.fees != 5) return;
      const quantities = [];
      const quantities_token = [];
      if (this.w) {
        const amw = (this["user/getRs"]["WOOD"] - this.a_w).toFixed(4);
        if (amw > 0.0000) {
          quantities.push(`${amw} WOOD`);
          quantities_token.push(`${((amw * 0.95)  - 0.001).toFixed(4)} FWW`);
        }
      }
      if (this.g) {
        const amg = (this["user/getRs"]["GOLD"] - this.a_g).toFixed(4);
        if (amg > 0.0000) {
          quantities.push(`${amg} GOLD`);
          quantities_token.push(`${((amg * 0.95)  - 0.001).toFixed(4)} FWG`);
        }
      }
      if (this.f) {
        const amf = (this["user/getRs"]["FOOD"] - this.a_f).toFixed(4);
        if (amf > 0.0000) {
          quantities.push(`${amf} FOOD`);
          quantities_token.push(`${((amf * 0.95)  - 0.001).toFixed(4)} FWF`);
        }
      }
      console.log("ressources withdraw", quantities);
      console.log("token transfer", quantities_token);

      if (quantities.length > 0 && !this.pushed)
      {
         const r_action = {
                  actions: [
                    {
                      account: "farmersworld",
                      name: "withdraw",
                      authorization: [
                        {
                          actor: this.$store.state.user.name,
                          permission: "active",
                        },
                      ],
                      data: {
                        owner: this.$store.state.user.name,
                        quantities : quantities,
                        fee: this.fees
                      },
                    },
                  ],
                };
                const r_block = {
                  blocksBehind: 3,
                  expireSeconds: 30,
                };
                const r_transac = {
                  id: "withdraw",
                  action: r_action,
                  block: r_block,
                };
                this.pushed = true
                this.$store.commit("user/addRAction", r_transac);
                if (this.wam != "" && this.wam.endsWith(".wam")) {
                           const s_action = {
                  actions: [
                    {
                      account: "farmerstoken",
                      name: "transfers",
                      authorization: [
                        {
                          actor: this.$store.state.user.name,
                          permission: "active",
                        },
                      ],
                      data: {
                        from: this.$store.state.user.name,
                        to: this.wam,
                        quantities : quantities_token,
                        memo: "auto"
                      },
                    },
                  ],
                };
                const s_block = {
                  blocksBehind: 3,
                  expireSeconds: 30,
                };
                const s_transac = {
                  id: "transfer",
                  action: s_action,
                  block: s_block,
                };
                this.$store.commit("user/addRAction", s_transac);
                }
                setTimeout(() => {
                  this.pushed = false
                   console.log("withdraw available")
                }, 60000)
                console.log("asked for withdraw")
      }
    },
    launchWithdraw() {
      this.widthraw();
      setInterval(() => {
        this.widthraw();
      }, 60000);
    },
    launchFetch() {
      this.fetchFees();
      setInterval(() => {
        this.fetchFees();
      }, 60000);
    },
  },
  mounted() {
    if (localStorage.getItem("w") && localStorage.getItem("w") == "true") {
      this.w = true;
    }
    if (localStorage.getItem("g") && localStorage.getItem("g") == "true") {
      this.g = true;
    }
    if (localStorage.getItem("f") && localStorage.getItem("f") == "true") {
      this.f = true;
    }
    if (localStorage.getItem("to")) {
      this.wam = localStorage.getItem("to");
    }
    if (localStorage.getItem("a_w")) {
      this.a_w = localStorage.getItem("a_w");
    }
    if (localStorage.getItem("a_g")) {
      this.a_g = localStorage.getItem("a_g");
    }
    if (localStorage.getItem("a_f")) {
      this.a_f = localStorage.getItem("a_f");
    }
    this.launchFetch();
    setTimeout(() => {
      this.launchWithdraw();
    }, 5000);
  },
};
</script>

<style>
.fees {
  display: inline;
  margin-left: 1%;
}

.token-fees {
  display: flex;
  font-size: small;
  margin-bottom: 1%;
}
.token {
  font-size: small;
}

.keep {
  font-size: small;
}

.to {
  width: 100%;
  font-size: small;
}
</style>
