<template>
  <div id="app">
    <TheNavBar/>
    <div class="container">
      <!-- utilizamos el :key="$route.path" para forzar que cada vez que cargue una ruta cree un componente
      y de esta forma si cargamos el perfil y luego queremos ir a editar perfil como es la misma ruta 
      pero con un parametro añadido no crea un nuevo componente y entonces no renderiza, de esta forma
      entonces si renderiza porque lo ve como una ruta nueva -->
      <router-view :key="$route.path" v-show="showPage" @ready="pageReady"/>
      <AppSpinner v-show="!showPage"/>
    </div>
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar'
/* AppSpinner es una componente que hemos creado para cuando estamos a la espera de que una web
cargue, aparezca como un gif de cargando */
import AppSpinner from '@/components/AppSpinner'
/* NProgress es una libreria de barra de carga para la pagina que hemos instalado con yarn add nprogress */
import NProgress from 'nprogress'
export default {
  components: {
    TheNavBar,
    AppSpinner
  },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    pageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    NProgress.start()
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      NProgress.start()
      next()
    })
  }
}
</script>

<style>
@import "assets/css/style.css";
@import "~nprogress/nprogress.css";

#nprogress .bar {
  background: #57AD8D;
}

</style>
