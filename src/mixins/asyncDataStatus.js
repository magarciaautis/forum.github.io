export default {
  data () {
    return {
      asyncDataStatus_ready: false
    }
  },
  methods: {
    asyncDataStatus_fetched () {
      this.asyncDataStatus_ready = true
      /* Aqui accionamos el evento ready del router-view que esta en App.vue, el evento es nativo de vue,
      es como si fuera el document.ready() */
      this.$emit('ready')
    }
  }
}
