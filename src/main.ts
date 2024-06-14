import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import {initializeApp} from "firebase/app";

// Vuetify
import "vuetify/styles";
import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import {chirimoyaAlegreTheme, coffeeTheme, frutosRojosTheme, mentaTheme, moraCremaTheme,} from "@/themes/themes.js";
/* import the fontawesome core */
import {library} from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
    faCircleCheck,
    faLock,
    faMoon,
    faPause,
    faPlay,
    faStar,
    faStop,
    faTrash,
    faVolumeHigh,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";

import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";

/* pinia */
import {createPinia} from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "moraCremaTheme",
        themes: {
            moraCremaTheme,
            frutosRojosTheme,
            chirimoyaAlegreTheme,
            coffeeTheme,
            mentaTheme,
        },
    },
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

/* Firebase */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "cronocoso.firebaseapp.com",
    projectId: "cronocoso",
    storageBucket: "cronocoso.appspot.com",
    messagingSenderId: "1019080736119",
    appId: "1:1019080736119:web:028a52f5d55c967fc5b572",
    measurementId: "G-JF5F63FBS4",
};
initializeApp(firebaseConfig);

/* add icons to the library */
library.add(faLock);
library.add(faTrash);
library.add(faStar);
library.add(faMoon);
library.add(faPlay);
library.add(faPause);
library.add(faStop);
library.add(faGoogle);
library.add(faCircleCheck);
library.add(faVolumeHigh);
library.add(faVolumeXmark);
library.add(faGithub);


createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .use(router)
    .use(vuetify)
    .use(pinia)
    .mount("#app");
