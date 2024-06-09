import { createRouter, createWebHashHistory } from "vue-router";
import CronogramaView from "../views/CronogramaView.vue";
import ModifyScheduleView from "../views/ModifyScheduleView.vue";
import ConfigView from "../views/ConfigView.vue";
import ModifyTimerView from "../views/ModifyTimerView.vue";
import AuthView from "../views/AuthView.vue";
import { useSessionStore } from '../stores/SessionStore';
import HomeView from "../views/HomeView.vue";
import FrontPage from "../views/FrontPage.vue";
import GroupsView from "../views/GroupsView.vue";

const routes = [
    {
        path: "/",
        name: "frontpage",
        component: FrontPage,
        meta: {
            requireAuth: false,
        },
    },
    {
        path: "/auth",
        name: "auth",
        component: AuthView,
        meta: {
            requireAuth: false,
        },
        // workaround para double guarding, si el usuario ya esta autentificado redirects a /cronograma
        beforeEnter: (to, from) => {
            const auth = useSessionStore().token != null;
            if (auth) {
                return "/cronograma";
            }
        },
    },
    {
        path: "/home",
        component: HomeView,
        redirect: "/cronograma",
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: "/cronograma",
                name: "cronograma",
                component: CronogramaView,
                meta: {
                    requireAuth: true,
                },
            },
            {
                path: "/mis-temporizadores",
                name: "mis-temporizadores",
                component: ModifyTimerView,
                meta: {
                    requireAuth: true,
                },
            },
            {
                path: "/mis-cronogramas",
                name: "mis-cronogramas",
                component: ModifyScheduleView,
                meta: {
                    requireAuth: true,
                },
            },
            {
                path: "/grupos",
                name: "grupos",
                component: GroupsView,
                meta: {
                    requireAuth: true,
                },
            },
            {
                path: "/configuracion",
                name: "config",
                component: ConfigView,
                meta: {
                    requireAuth: true,
                },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from) => {
    const auth = useSessionStore().token != null;
    const needAuth = to.meta.requireAuth;
    if (needAuth && !auth) {
        return { name: "auth" };
    } else {
        return true;
    }
});

export default router;
