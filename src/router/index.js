import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import Home from '@/components/Pages/PageHome'
import ThreadShow from '@/components/Pages/PageThreadShow'
import ThreadCreate from '@/components/Pages/PageThreadCreate'
import ThreadEdit from '@/components/Pages/PageThreadEdit'
import Category from '@/components/Pages/PageCategory'
import Forum from '@/components/Pages/PageForum'
import Profile from '@/components/Pages/PageProfile'
import SignIn from '@/components/Pages/PageSignIn'
import Register from '@/components/Pages/PageRegister'
import NotFound from '@/components/Pages/PageNotFound'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/thread/create/:forumId',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    /* Los dos routes siguientes utilizan el mismo componente porque usan
    la misma pagina, con la diferencia que el primero solo muestra el
    perfil con la informacion y los posts, y el segundo se activa cuando
    le dan al boton "Edit profile" que envia un "true" a la variable edit
    que va a la misma url pero con un /edit para mostrar el formulario de
    editar la informacion del perfil */
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: true,
      meta: {requiresAuth: true}
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: {edit: true},
      meta: {requiresAuth: true}
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {requiresGuest: true}
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: {requiresGuest: true}
    },
    {
      path: '/logout',
      name: 'SignOut',
      meta: {requiresAuth: true},
      beforeEnter (to, from, next) {
        store.dispatch('signOut')
          .then(() => next({name: 'Home'}))
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})

/* router es una variable que nos hemos guardado a principio de este vue para guardarnos el new route
que generamos para saber en todo momento cuando se hace uno de las rutas, entonces con la funciona que
vamos a utilizar a continuacion "beforeEach" vamos a comprobar cada vez que se vaya a hacer uso de
alguna ruta de las que tenemos para comprobar si esa ruta requiere que haya un usuario logueado antes
de usarla (route.meta.requiresAuth), o si requiere que no este logueado para hacer uso de esa pagina
(route.meta.requiresGuest) que por ejemplo seria la de registrarse o loguearse que no tendria sentido
acceder a ella si ya estas logueado */
router.beforeEach((to, from, next) => {
  // protect route
  store.dispatch('auth/initAuthentication')
  .then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
      if (user) {
        next()
      } else {
        next({name: 'SignIn', query: {redirectTo: to.path}})
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      if (!user) {
        next()
      } else {
        next({name: 'Home'})
      }
    } else {
      next()
    }
  })
})

export default router
