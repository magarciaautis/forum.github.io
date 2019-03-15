<template>
  <!-- con :title="timestamp | humanFriendlyDate" lo que se 
  consigue es que cuando pases el raton por encima de la fecha 
  te dice el dia mes y año -->
  <span :title="timestamp | humanFriendlyDate"> {{timestamp | diffForHumans}}</span>

</template>

<script>
import moment from 'moment'
export default {
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  filters: {
    humanFriendlyDate (date) {
      return moment.unix(date).locale('es').format('Do MMMM YYYY, h:mm:ss a')
    },
    diffForHumans (date) {
      return moment.unix(date).locale('es').fromNow()
    }
  }
}
</script>

<style scoped>

</style>
