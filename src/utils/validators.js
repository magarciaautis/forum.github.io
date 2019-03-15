import firebase from 'firebase'
// helpers se importa para crear validadores customs
import {helpers as vuelidateHelpers} from 'vuelidate/lib/validators'

export const uniqueUsername = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    /* buscamos en la base da datos en la tabla users en el campo usernameLower si existe algun
    nombre igual al que hemos puesto en el campo username del formulario, en caso que exista
    mostrara un mensaje como que ese nombre ya esta cogido */
    firebase.database().ref('users').orderByChild('usernameLower').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

export const uniqueEmail = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    /* buscamos en la base da datos en la tabla users en el campo email si existe algun
    email igual al que hemos puesto en el campo email del formulario, en caso que exista
    mostrara un mensaje como que ese email ya esta cogido */
    firebase.database().ref('users').orderByChild('email').equalTo(value.toLowerCase())
      .once('value', snapshot => resolve(!snapshot.exists()))
  })
}

export const supportedImageFile = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  // declaramos que tipo de extension vamos a permitir para el avatar
  const supported = ['jpg', 'jpeg', 'gif', 'png', 'svg']
  /* dividimos el string de la URL que le pasamos por puntos y cogemos el ultimo trozo que
  es el que contiene la extension de la imagen */
  const suffix = value.split('.').pop()
  /* retornamos true o false si esa extension existe dentro de las extensiones permitidas que
  hemos declarado antes */
  return supported.includes(suffix)
}

export const responseOk = (value) => {
  if (!vuelidateHelpers.req(value)) {
    return true
  }
  return new Promise((resolve, reject) => {
    /* Dado que no usamos una libreria ajax, usaremos fetch, la cuestion con fetch es que no rechazara
    si la URL no es encontrada, asi que, dentro del then, resolveremos si la respuesta es ok */
    fetch(value)
      .then(response => resolve(response.ok))
      .catch(() => resolve(false))
  })
}
