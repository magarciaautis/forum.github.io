<template>
<div>
  <div class="container">

      <div class="flex-grid justify-center">
          <div class="col-2">

              <form @submit.prevent="register" class="card card-form">
                  <h1 class="text-center">Register</h1>

                  <div class="form-group">
                      <label for="name">Full Name</label>
                      <input 
                        v-model="form.name" 
                        @blur="$v.form.name.$touch()"
                        id="name" 
                        type="text" 
                        class="form-input"
                      >
                      <template v-if="$v.form.name.$error">
                        <span v-if="!$v.form.name.required" class="form-error">This field is required</span>
                      </template>
                  </div>

                  <div class="form-group">
                      <label for="username">Username</label>
                      <input 
                        v-model.lazy="form.username"
                        @blur="$v.form.username.$touch()"
                        id="username" 
                        type="text" 
                        class="form-input"
                      >
                      <template v-if="$v.form.username.$error">
                        <span v-if="!$v.form.username.required" class="form-error">This field is required</span>
                        <span v-if="!$v.form.username.unique" class="form-error">Sorry! this username is taken</span>
                      </template>
                  </div>

                  <div class="form-group">
                      <label for="email">Email</label>
                      <input 
                        v-model.lazy="form.email" 
                        @blur="$v.form.email.$touch()"
                        id="email" 
                        type="email" 
                        class="form-input"
                        >
                        <template v-if="$v.form.email.$error">
                          <span v-if="!$v.form.email.required" class="form-error">This field is required</span>
                          <span v-else-if="!$v.form.email.email" class="form-error">This is not a valid email address</span>
                          <span v-if="!$v.form.email.unique" class="form-error">Sorry! this email is taken</span>
                        </template>
                  </div>

                  <div class="form-group">
                      <label for="password">Password</label>
                      <input 
                        v-model="form.password"
                        @blur="$v.form.password.$touch()" 
                        id="password" 
                        type="password" 
                        class="form-input"
                        >
                        <template v-if="$v.form.password.$error">
                          <span v-if="!$v.form.password.required" class="form-error">This field is required</span>
                          <span v-if="!$v.form.password.minLength" class="form-error">The password must be at least 6 characters lomg</span>
                        </template>
                  </div>

                  <div class="form-group">
                      <label for="avatar">Avatar</label>
                      <input 
                        v-model.lazy="form.avatar" 
                        @blur="$v.form.avatar.$touch()"
                        id="avatar" 
                        type="text" 
                        class="form-input"
                        >
                        <template v-if="$v.form.avatar.$error">
                          <span v-if="!$v.form.avatar.url" class="form-error">The supplied URL is invalid</span>
                          <span v-if="!$v.form.avatar.supportedImageFile" class="form-error">This file type is not supported by our system<br>Supported file types: .jpg .png .gif .jpeg .svg</span>
                          <span v-if="!$v.form.avatar.responseOk" class="form-error">The supplied image cannot be found</span>
                        </template>
                  </div>

                  <div class="form-actions">
                      <button type="submit" class="btn-blue btn-block">Register</button>
                  </div>

              </form>
              <div class="text-center push-top">
                  <button @click="registerWithGoogle" class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign up with Google</button>
              </div>
          </div>
      </div>
  </div>

  <div class="forum-stats desktop-only push-top">
      <hr>
      <ul>
        <li><i class="fa fa-user-circle-o"></i>47 users online</li>
        <li><i class="fa fa-user-o"></i>497 users registered</li>
        <li><i class="fa fa-comments-o"></i>49 threads</li>
        <li><i class="fa fa-comment-o"></i>763 posts</li>
      </ul>
  </div>
</div>
  
</template>

<script>
import {required, email, minLength, url} from 'vuelidate/lib/validators'
import {uniqueEmail, uniqueUsername, responseOk, supportedImageFile} from '@/utils/validators'
export default {
  data () {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      username: {
        required,
        // las validaciones customs estan en el fichero @/utils/validators
        unique: uniqueUsername
      },
      email: {
        required,
        email,
        // las validaciones customs estan en el fichero @/utils/validators
        unique: uniqueEmail
      },
      password: {
        required,
        minLength: minLength(6)
      },
      avatar: {
        url,
        // las validaciones customs estan en el fichero @/utils/validators
        supportedImageFile,
        responseOk
      }
    }
  },
  methods: {
    register () {
      /* ejecutamos la funcion this.$v.form.$touch() para forzar como que hemos tocado todos los campos
      y de esta manera si alguno es required y no esta completado, saltara el error y no dejara que se envie
      el formulario para crear el nuevo usuario */
      this.$v.form.$touch()
      /* comprobamos si el formulario se ha enviado sin ningun error en los campos, de lo contrario hara
      un return y se saldra de la funcion register */
      if (this.$v.form.$invalid) {
        return
      }
      /* el formulario que contiene todo los campos que necesita el dispatch createUser
      para añadirlo a la base de datos */
      this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
        .then(() => this.$router.push('/'))
    },
    registerWithGoogle () {
      this.$store.dispatch('auth/signInWithGoogle')
        .then(() => this.$router.push('/'))
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>

</style>
