<template>
  <div class="test">
    <Buffer ref="buffer" />
    <div class="info-user">
      <DefiLogo class="logo-top" />

      <div class="login">
        <label class="login-value">{{ user.name }}</label>
        <div class="cpu">
          CPU
          <label
            :class="
              user.cpu >= 80
                ? 'cpu-value cpu-high'
                : user.cpu >= 60
                ? 'cpu-value cpu-mid'
                : 'cpu-value cpu-low'
            "
            >{{ user.cpu }}%</label
          >
        </div>
      </div>
      <div class="wax-info">
        <div class="wax-title">
          Balance
          <label class="wax-value"
            >{{ parseFloat(user.tokens["WAX"]).toFixed(2) }} ￦</label
          >
        </div>
        <div class="wax-title">
          Staking
          <label class="wax-value">{{ user.stake }} ￦</label>
        </div>
      </div>
      <div class="energy-profit">
        <div class="energy">
          <label class="energy-title">Energy:</label
          ><label
            :class="
              user.energy > user.max_energy / 2
                ? 'energy-value cpu-low'
                : user.energy > user.max_energy / 3
                ? 'energy-value cpu-mid'
                : 'energy-value cpu-high'
            "
            >{{ user.energy }}/{{user.max_energy}}</label
          >
        </div>
        <div class="profit">
          <label class="profit-title">Daily Profit:</label
          ><label class="energy-value cpu-low">?? ￦</label>
        </div>
      </div>
      <div class="token-div">
        <label class="token-title">Tokens:</label>
        <p class="game-info-t">{{ user.tokens["FWW"] }}</p>
        <p class="game-info-t">{{ user.tokens["FWG"] }}</p>
        <p class="game-info-t">{{ user.tokens["FWF"] }}</p>
      </div>
      <div class="ingame-div">
        <label class="ingame-title">InGame:</label>
        <p class="game-info">{{ user.ressources["WOOD"] }}</p>
        <p class="game-info">{{ user.ressources["GOLD"] }}</p>
        <p class="game-info">{{ user.ressources["FOOD"] }}</p>
      </div>
      <!-- <div class="token-logo-div">
        <p></p>
        <p>DMT <img src="../assets/DMT.png" class="game-img" /></p>
        <p>DMC <img src="../assets/DMC.png" class="game-img" /></p>
        <p>DME <img src="../assets/DME.png" class="game-img" /></p>
      </div> -->
      <div class="daily-div">
        <label class="daily-title">Daily Cost/Mine:</label>
        <p
          :class="
            (user.production['WOOD'] - user.cost['WOOD']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          <!-- {{
            (
              (user.production["WOOD"] - user.cost["WOOD"]).toFixed(4) * 24
            ).toFixed(4)
          }} -->
          ??
          Wood <img src="https://fw.f12key.xyz/img/F12/fw/FWW2.png" referrerpolicy="no-referrer" class="game-img" />
        </p>
        <p
          :class="
            (user.production['GOLD'] - user.cost['GOLD']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          <!-- {{
            (
              (user.production["GOLD"] - user.cost["GOLD"]).toFixed(4) * 24
            ).toFixed(4)
          }} -->
          ??
          Gold <img src="https://fw.f12key.xyz/img/F12/fw/FWG2.png" referrerpolicy="no-referrer" class="game-img" />
        </p>
        <p
          :class="
            (user.production['FOOD'] - user.cost['FOOD']).toFixed(4) * 24 > 0
              ? 'daily-info-pos'
              : 'daily-info-neg'
          "
        >
          <!-- {{ ((user.production["FOOD"] - user.cost["FOOD"]) * 24).toFixed(4) }} -->
          ??
          Food <img src="https://fw.f12key.xyz/img/F12/fw/FWF2.png" referrerpolicy="no-referrer" class="game-img" />
        </p>
      </div>
      <div style="display: flex">
        <div class="">
        <b-button size="sm" v-b-tooltip.hover title="Activate this to refresh the page every 30 min." :variant="autologin ? 'success': 'danger'" @click="switchLog">AutoLogin: {{autologin ? "ON" : "OFF"}}</b-button>
        <b-button size="sm" v-b-tooltip.hover title="Activate this for always using the same rpc." :variant="blockedRPC ? 'success': 'danger'" @click="blockRdm">Please don't randomise my RPC</b-button>
      </div>
      <Energy />
      <Fees />
      </div>
    </div>
    <div class="items" v-if="this['user/getItems']['Wood'].length">
      <ItemClaim
        ref="Wood"
        title="Wood"
        logo="/_nuxt/img/DMT.79c3a9f.png"
        :toTrim="0"
        :list="this['user/getItems']['Wood']"
        :member="this['user/getMembers']['Wood']"
        type="Wood"
        :hideDura="false"
        :show="{
          claimAll: true,
          repairAll: true,
          localClaim: true,
          localRepair: true,
        }"
        :claimInfo="{
          type: 'Wood',
          action: 'claim',
          r_action: 'repair',
        }"
      />
    </div>
    <div class="items" v-if="this['user/getItems']['Gold'].length">
      <ItemClaim
        ref="Gold"
        title="Gold"
        logo="/_nuxt/img/DMT.79c3a9f.png"
        :toTrim="0"
        :list="this['user/getItems']['Gold']"
        type="Gold"
        :member="this['user/getMembers']['Gold']"
        :hideDura="false"
        :show="{
          claimAll: true,
          repairAll: true,
          localClaim: true,
          localRepair: true,
        }"
        :claimInfo="{
          type: 'Gold',
          action: 'claim',
          r_action: 'repair',
        }"
      />
    </div>
    <div class="items" v-if="this['user/getItems']['Food'].length">
      <ItemClaim
        ref="Food"
        title="Food"
        logo="/_nuxt/img/DMT.79c3a9f.png"
        :toTrim="0"
        :list="this['user/getItems']['Food']"
        :member="this['user/getMembers']['Food']"
        type="Food"
        :hideDura="false"
        :show="{
          claimAll: true,
          repairAll: true,
          localClaim: true,
          localRepair: true,
        }"
        :claimInfo="{
          type: 'Food',
          action: 'claim',
          r_action: 'repair',
        }"
      />
    </div>
    <div class="items" v-if="this['user/getItems']['Members'].length">
      <ItemClaim
        ref="Members"
        title="Members"
        logo="/_nuxt/img/DMT.79c3a9f.png"
        :toTrim="0"
        :list="this['user/getItems']['Members']"
        :member="0"
        type="Members"
        :hideDura="true"
        :show="{
          claimAll: true,
          repairAll: false,
          localClaim: true,
          localRepair: false,
        }"
        :claimInfo="{
          type: 'Members',
          action: 'mbsclaim',
          r_action: 'repair',
        }"
      />
    </div>
    <div class="items" v-if="this['user/getItems']['Crops'].length">
      <ItemClaim
        ref="Crops"
        title="Crops"
        logo="/_nuxt/img/DMT.79c3a9f.png"
        :toTrim="0"
        :list="this['user/getItems']['Crops']"
        :member="0"
        type="Crops"
        :hideDura="true"
        :show="{
          claimAll: true,
          repairAll: false,
          localClaim: true,
          localRepair: false,
        }"
        :claimInfo="{
          type: 'Crops',
          action: 'cropclaim',
          r_action: 'repair',
        }"
      />
    </div>



  </div>
</template>

<script>
import ItemClaim from "./ItemClaim.vue";
import Buffer from "./Buffer.vue";
import DefiLogo from "./DefiLogo.vue";
import Fees from "./Fees.vue"
import { mapGetters } from "vuex";
import Energy from "~/components/Energy.vue";
export default {
  name: "Test",
  data() {
    return {
      autologin: false,
      blockedRPC: true,
      refresh: null
    }
  },
  computed: {
    ...mapGetters(["user/getItems", "user/getMembers"]),
    user() {
      return this.$store.state.user;
    },
  },
  components: { ItemClaim, Buffer, DefiLogo,
    Energy, Fees },
  methods: {
    blockRdm() {
      this.blockedRPC = !this.blockedRPC;
      localStorage.setItem("blockedRPC", this.blockedRPC);
    },
    switchLog: function(){
      this.autologin = !this.autologin
      localStorage.setItem("autoLogin", this.autologin);
      if (this.autologin) {
        this.refresh = setTimeout(() => {
        window.location.href = "/"
      }, 1800000);
      }
      else {
        clearTimeout(this.refresh);
      }
    }
  },
  mounted() {
    if (localStorage.getItem("blockedRPC") && localStorage.getItem("blockedRPC") == "true")
    {
      this.blockedRPC = true;
    }
    else
    {
      this.blockedRPC = false;
    }
    if (localStorage.getItem("autoLogin") && localStorage.getItem("autoLogin") == "true")
    {
      this.autologin = true;
      this.refresh = setTimeout(() => {
        window.location.href = "/"
      }, 1800000);
    }
    this.$on(`test`, (id) => {
      console.log("main receive test from ", id);
      this.$emit("test", id);
    });
    this.$on(`claiming`, (id) => {
      console.log("itemclaim receive claiming from ", id);
      this.$emit(`${id}.claiming`);
    });
    this.$on(`success`, (id) => {
      console.log("itemclaim receive success from ", id);
      this.$emit(`${id}.success`);
    });

    this.$on(`retry`, (transac) => {
      console.log("itemclaim receive retry from ", transac.id);
      this.$emit(`${transac.id}.retry`, transac.retry);
    });
  },
};
</script>

<style>

.test {
  margin-top: 2.5%;
}

.info-user {
  margin-left: 20%;
  margin-right: 20%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}

.logo-top {
  display: inline-block;
  width: 10%;
  vertical-align: top;
}

.wax-info {
  display: inline-block;
  text-align: left;
  width: 20%;
  vertical-align: top;
}

.login {
  display: inline-block;
  width: 15%;
  margin-left: 2%;
  vertical-align: top;
}
.login-value {
  background-color: rgb(133, 40, 128);
  padding: 0.5em;
  border-radius: 5%;
}

.wax-value {
  background-color: rgb(211, 140, 9);
  border-radius: 5%;
  margin-top: 1%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.wax-title {
  margin-top: 0.5%;
}

.cpu {
  margin-top: 0.5%;
}
.cpu-value {
  border-radius: 5%;
  margin-top: 1%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.cpu-high {
  background-color: rgb(110, 2, 2);
}
.cpu-mid {
  background-color: rgb(110, 85, 2);
}

.cpu-low {
  background-color: #28a745;
}

.token-div {
  display: inline-block;
  font-size: small;
}
.ingame-div {
  display: inline-block;
  font-size: small;
  margin-right: 1%;
}
.token-logo-div {
  display: inline-block;
  font-size: small;
}
.daily-div {
  display: inline-block;
  font-size: small;
}
/************************/

.info-game {
  display: flex;
  justify-content: space-around;
  width: 50%;
  margin-left: 25%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}

.token-info {
  font-size: small;
  margin-top: 1%;
}
.token-title {
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  margin-top: 2%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.game-info-t {
  text-align: right;
  width: 100%;
}

.ingame-info {
  font-size: small;
  margin-top: 1%;
}
.ingame-title {
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  margin-top: 2%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.game-info {
  text-align: right;
}
.ingame-logo {
  margin-top: 1%;
  font-size: small;
}

.game-img {
  height: 15px;
}

.daily-info {
  font-size: small;
  margin-top: 1%;
}

.daily-title {
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  margin-top: 2%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.daily-info-pos {
  text-align: center;
  background-color: #28a745;
}
.daily-info-neg {
  text-align: center;
  background-color: rgb(110, 2, 2);
}

.energy-profit {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}

.energy,
.profit {
  margin-top: 1%;
}

.energy-title,
.profit-title {
  margin-right: 0.5em;
  background-color: rgba(128, 128, 128, 0.534);
  border-radius: 5%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.energy-value {
  /* background-color: #28a745; */
  border-radius: 5%;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.items {
  display: inline-block;
  justify-content: space-around;
  width: 60%;
  margin-left: 20%;
  border: 1px solid rgba(128, 128, 128, 0.363);
}
</style>
