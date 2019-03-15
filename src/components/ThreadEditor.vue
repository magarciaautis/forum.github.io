<template>
  
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input 
        v-model="form.title"
        @blur="$v.form.title.$touch()" 
        type="text" id="thread_title" 
        class="form-input" 
        name="title"
      >
      <template v-if="$v.form.title.$error">
        <span v-if="!$v.form.title.required" class="form-error">This field is required</span>
        <span v-if="!$v.form.title.minLength" class="form-error">The title must be least 10 character long</span>
      </template>
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea 
        v-model="form.text" 
        @blur="$v.form.text.$touch()" 
        id="thread_content" 
        class="form-input" 
        name="content" 
        rows="8" 
        cols="140">
      </textarea>
      <template v-if="$v.form.text.$error">
        <span v-if="!$v.form.text.required" class="form-error">Thread must have some content</span>
        <span v-if="!$v.form.text.minLength" class="form-error">The text of the thread must be least 40 characters long. Type at least {{letrasRestantes}} more</span>
      </template>
    </div>

    <div class="btn-group">
      <button @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">{{isUpdate ? 'Update' : 'Publish'}} </button>
    </div>
  </form>

</template>

<script>
import {required, minLength} from 'vuelidate/lib/validators'
export default {
  props: {
    title: {
      type: String,
      defaul: ''
    },
    text: {
      type: String,
      defaul: ''
    }
  },
  data () {
    return {
      form: {
        title: this.title,
        text: this.text
      }
    }
  },
  validations: {
    form: {
      title: {
        required,
        minLength: minLength(10)
      },
      text: {
        required,
        minLength: minLength(40)
      }

    }
  },
  computed: {
    isUpdate () {
    /* Este computed comprueba si se esta pasando al componente
    una variable title (la doble exclamacion es para convertir
    el this.title en un booleano para saber si existe esa variable o no)
    en caso de que se este pasando la variable, quiere decir
    que estamos editando un hilo y cambiaremos el boton a pulsar para
    que ponga actualizar y no publicar */
      return !!this.title
    },
    letrasRestantes () {
      const textLength = this.form.text.length
      if (textLength < 40) {
        return 40 - textLength
      }
    }
  },
  methods: {
    /* Cuando pulsen cualquiera de los botones save o cancel
    se activaran sus respectivos metodos de aqui debajo que se
    encargaran de usar la funcion "emit" que ejecutara un save
    o un cancel pero de los metodos que se le han pasado a traves
    del vue PageThreadCreate <ThreadEditor @save="save" @cancel="cancel"/>
    y se ejecutaran los metodos definidos en el vue PageThreadCreate */
    save () {
      this.$v.form.$touch()
      if (!this.$v.form.$invalid) {
        this.$emit('save', {title: this.form.title, text: this.form.text})
      }
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
