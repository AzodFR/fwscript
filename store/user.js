import * as waxjs from "@waxio/waxjs/dist";

export const state = () => ({
  name: "",
  energy: 0,
  max_energy: 0,
  stake: 0,
  cpu: 0,
  lock: false,
  actions: [],
  r_actions: [],
  retry: [],
  autoclaim: {
    "Wood": {
      "global": false,
    },
    "Food": {
      "global": false
    },
    "Gold": {
      "global": false
    },
    "animals": {
      "global": false
    },
    "Crops": {
      "global": false
    },
    "Members": {
      "global": false
    },
  },
  autorepair: {
    "Wood": {
      "global": false,
    },
    "Food": {
      "global": false
    },
    "Gold": {
      "global": false
    },
    "Members": {
      "global": false
    },
    "Crops": {
      "global": false
    },
  },
  tokens: {
    "WAX": 0,
    "FWG": 0,
    "FWF": 0,
    "FWW": 0
  },
  production: {
    "GOLD": 0,
    "FOOD": 0,
    "WOOD": 0
  },
  cost: {
    "GOLD": 0,
    "FOOD": 0,
    "WOOD": 0
  },
  logged_asset: [],
  ressources: {
    "GOLD": 0,
    "FOOD": 0,
    "WOOD": 0
  },
  wax: null,
  members: {
    "Wood": 0,
    "Food": 0,
    "Gold": 0,
  },
  items: {
    "Wood": [],
    "Food": [],
    "Gold": [],
    "animals": [],
    "Crops": [],
    "Members": []
  },
  templates: {
    "tools": [],
    "animals": [],
    "Crops": [],
    "members": []
  }
})

export const mutations = {
  async login(state, rpc) {
    state.wax = new waxjs.WaxJS({
      rpcEndpoint: rpc,
      tryAutoLogin: true
    })
    await state.wax.login()
  },
  setUser(state) {
    state.name = state.wax.userAccount
    // state.name = "uvhvw.wam"
  },
  setToken(state, token) {
    state.tokens[token.type] = token.value
  },
  setRessource(state, token) {
    state.ressources[token.type] = token.value
  },
  setEnergy(state, value) {
    state.energy = value
  },
  setItem(state, item) {
    state.items[item.type] = item.value;
  },
  setTemplates(state, value) {
    state.templates[value.type] = value.rows
  },
  setAutoClaim(state, param) {
    state.autoclaim[param.type][param.id] = param.value;
  },
  setAutoRepair(state, param) {
    state.autorepair[param.type][param.id] = param.value;
  },
  addProduction(state, param) {
    state.production[param.type] += param.value;
  },
  addCost(state, param) {
    state.cost[param.type] += param.value;
  },
  addAsset(state, id) {
    state.logged_asset.push(id);
  },
  setLock(state, value) {
    state.lock = value;
  },
  setStake(state, value) {
    state.stake = value;
  },
  setCPU(state, value) {
    state.cpu = value;
  },
  addAction(state, action) {
    state.actions.push(action)
  },
  addRAction(state, r_action) {
    state.r_actions.push(r_action);
  },
  addRetryAction(state, action) {
    state.retry.push(action);
  },
  rmAction(state, action) {
    let idx = state.actions.indexOf(action);
    if (idx !== -1) {
      state.actions.splice(idx, 1);
    }
    state.lock = false
  },
  rmRAction(state, r_action) {
    let idx = state.r_actions.indexOf(r_action);
    if (idx !== -1) {
      state.r_actions.splice(idx, 1);
    }
    state.lock = false
  },
  rmRetryAction(state, action) {
    let idx = state.retry.indexOf(action);
    if (idx !== -1) {
      state.retry.splice(idx, 1);
    }
    state.lock = false
  },
  addMbs(state, entry) {
    state.members[entry.type] += entry.value
  },
  setMaxEnergy(state, entry) {
    state.max_energy = entry
  },

}


export const getters = {
  getState(state) {
    return state
  },
  getItems(state) {
    return state.items
  },
  getMembers(state) {
    return state.members
  }
}
