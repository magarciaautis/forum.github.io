// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router'
import store from '@/store/index'
import AppDate from '@/components/AppDate'
import vuelidate from 'vuelidate'

Vue.use(vuelidate)
Vue.component('AppDate', AppDate)
Vue.config.productionTip = false

// Initialize Firebase, variables de configuracion de la base de datos
// El valor de las variables estan en la carpeta config del proyecto en el prod.env.js
const config = {
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  databaseURL: process.env.FIREBASE_databaseURL,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId
}
firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
