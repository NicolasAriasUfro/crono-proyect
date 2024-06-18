<script setup lang="ts">
import {useSessionStore} from "../stores/SessionStore";
import navBar from "../../../crono-proyect/src/components/NavBar.vue";
import footerComponent from "../../../crono-proyect/src/components/Footer.vue";
import {onMounted, ref} from "vue";
import router from '@/router';

const sessionStore = useSessionStore();
const userName = sessionStore.userName;
const login = ref(sessionStore.token != null);

const logIn = () => {
  router.push({ name: "auth" });
}

onMounted(() => {
  sessionStore.fetchGroups(1); //TODO! FIX THIS
})
</script>

<template>
  <v-app-bar app>
    <navBar />
  </v-app-bar>
  <v-main
    grid-list-xs
    class="content-container"
  >
    <div class="tabs-container">
      <v-tabs
        bg-color="primary_light_1"
        color="blue-grey-lighten-5"
        align-tabs="center"
        class="bg-blue-grey tabs"
        fixed-tabs
        show-arrows
        center-active
      >
        <v-tab to="cronograma">
          Cronograma
        </v-tab>
        <v-tab to="mis-temporizadores">
          Mis Temporizadores
        </v-tab>
        <v-tab to="mis-cronogramas">
          Mis Cronogramas
        </v-tab>
        <v-tab to="grupos">
          Grupos
        </v-tab>
        <v-tab to="configuracion">
          Configuración
        </v-tab>
      </v-tabs>
    </div>
    <v-container
      fluid
      class="elevation-1 content-wrapper"
    >
      <RouterView />
    </v-container>
    <footerComponent />
  </v-main>
</template>

<style>
.content-wrapper {
  height: 90%;
  overflow-y: auto;
}

.content-container {
  height: 90%;
  flex-direction: column;
}

.tabs-container {
  position: sticky;
  flex-shrink: 0;
}

.v-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

#github-icon {
  color: aliceblue;
}
</style>
