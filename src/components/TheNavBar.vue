<template>
  <header class="header" id="header" v-click-outside="closeMobileNavbar" v-handle-scroll="closeMobileNavbar">

    <router-link
      :to="{name: 'Home'}"
      class="logo"
    >
      <img src="../assets/img/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger" @click="mobileNavOpen = !mobileNavOpen">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': mobileNavOpen}">
      <ul v-if="user">
        <li class="navbar-user" v-click-outside="closeUserDropdown">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen">
            <div v-if="user.avatar">
              <img class="avatar-small" :src="user.avatar" alt="" >
            </div>
            <div v-else>
              <img class="avatar-small" src="../assets/img/perfil_post.jpg" alt="">
            </div>
            <span>
                {{user.name}}
                <img class="icon-profile" src="../assets/img/arrow-profile.svg" alt="">
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{'active-drop': userDropdownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                 <router-link :to="{name: 'Profile'}">View Profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="signOut">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="navbar-mobile-item"><router-link :to="{name: 'Profile'}">View Profile</router-link></li>
        <li class="navbar-mobile-item"><a @click.prevent="signOut">Sign Out</a></li>
      </ul>
      <ul v-else>
        <li class="navbar-item">
          <router-link :to="{name: 'SignIn'}">Sign In</router-link>
        </li>
        <li class="navbar-item">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import handleScroll from '@/directives/handle-scroll'
import clickOutside from '@/directives/click-outside'
import {mapGetters} from 'vuex'
export default {
  directives: {
    clickOutside,
    handleScroll
  },
  data () {
    return {
      userDropdownOpen: false,
      mobileNavOpen: false
    }
  },
  computed: {
    ...mapGetters({
      'user': 'auth/authUser'
    })
  },
  methods: {
    signOut () {
      /* antes de cerrar sesion, ponemos a false la variable para que cuando volvamos a entrar este
      cerrado el desplegable de ver perfil o cerrar sesion */
      this.userDropdownOpen = false
      /* igual que userDropdownOpen pero para la vista de movil mobileNavOpen */
      this.mobileNavOpen = false
      this.$store.dispatch('auth/signOut')
      this.$router.push({name: 'Home'})
    },
    closeUserDropdown () {
      this.userDropdownOpen = false
    },
    closeMobileNavbar () {
      this.mobileNavOpen = false
    }
  },
  beforeCreate () {
    /* antes de que se cargue la pagina, indicamos que la variable userDropdownOpen este a false para
    que no este desplegado el div que te dice si quieres ver tu perfil o si quieres cerrar sesion */
    this.userDropdownOpen = false
    /* igual que userDropdownOpen pero para la vista de movil mobileNavOpen */
    this.mobileNavOpen = false
  }
}
</script>

<style scoped>

</style>
