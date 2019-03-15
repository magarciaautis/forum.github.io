<template>

  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Welcome to the Forum</h1>

    <CategoryList :categories="categories"/>

  </div>

</template>

<script>
import CategoryList from '@/components/CategoryList'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  name: 'PageHome',

  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
  computed: {
    categories () {
      return Object.values(this.$store.state.categories.items)
    }
  },
  /* Esta llamada se hacer beforeCreate porque no necesitamos tener la reactividad del componentes lista
  para despachar nuestra accion, la razon para ello es que no necesitamos pasar argumentos a nuestra
  accion fetchAllCategories y tampoco necesitamos actualiar los datos del componente cuando la llamada
  se realice */
  beforeCreate () {
    this.$store.dispatch('categories/fetchAllCategories')
      .then(categories => {
        /* Esto se podria iterar con un categories.forEach pero en este caso como lo que queremos es saber
        cuando se han obtenido todos los resultados para poder renderizar los datos visualmente, utilizamos
        categories.map que tambien lo itera, pero nos devolvera un array cuando acabe y eso podemos envolverlo
        en una promesa para saber cuando ha terminado de obtener todos los datos y luego cambiaremos la variable
        ready que la tenemos en el fichero importado asyncDataStatus y utilizaremos la funcion
        asyncDataStatus_fetched() para cambiarla a "true" para que muestre todos los datos a la vez,
        la comprobacion de la variable se hace en la etiqueta template de cada vue que queramos utilizar este metodo */
        Promise.all(categories.map(category => this.$store.dispatch('forums/fetchForums', {ids: Object.keys(category.forums)})))
          .then(() => {
            this.asyncDataStatus_fetched()
          })
      })
  }
}
</script>