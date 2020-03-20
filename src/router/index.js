import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Personas from '@/views/persona/Personas'
import AltaPersona from '@/views/persona/AltaPersona'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    linkActiveClass: 'open active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
        path: '/',
        redirect: '/personas',
        name: 'Home',
        component: Full,
        children: [{
                path: 'personas',
                name: 'Personas',
                component: Personas
            },
            {
                path: 'alta-persona',
                name: 'Alta Persona',
                props: (route) => ({ id: null }),
                component: AltaPersona
            },
            {
                path: 'editar-persona/:id',
                name: 'Editar Persona',
                props: (route) => ({ id: route.params.id }),
                component: AltaPersona
            }
        ]
    }]
})