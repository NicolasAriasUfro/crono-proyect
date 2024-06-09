<script setup lang="ts">
import {useSessionStore} from "../stores/SessionStore";
import {useAudioStore} from "../stores/AudioStore";
import router from "../router";
import ThemesSelector from "../components/ThemesSelector.vue";

const sessionStore = useSessionStore();
const userName = sessionStore.userName;
const audioStore = useAudioStore();

const logIn = () => {
  router.push({ name: "auth" });
}

const logOut = () => {
  audioStore.audio.pause();
  sessionStore.$reset();
  audioStore.$reset();
  router.push({ name: "frontpage" });
};

const frontPage = () => {
  router.push({ name: "frontpage" });
};
</script>

<template>
  <v-toolbar class="px-5 elevation-4" id="navbar" color="primary">
    <template v-slot:prepend>
      <div class="text-h5">
        <button @click="frontPage" text="CronoProyect" color="primary">CronoProyect</button>
      </div>
    </template>
    <v-divider class="ms-3" color="background" inset vertical></v-divider>
    <v-toolbar-title class="d-flex text-left align-center">
      {{ userName }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <ThemesSelector />

      <v-divider vertical></v-divider>

      <div class="d-flex">
        <v-btn v-if="sessionStore.token != null" @click="logOut" class="login-btn" variant="text">Logout</v-btn>
        <v-btn v-else @click="logIn" class="login-btn" variant="text">LogIn</v-btn>
      </div>
    </v-toolbar-items>
  </v-toolbar>
</template>

<style scoped>
.login-btn {
  min-width: 100px !important;
}
#navbar {
  position: sticky;
  top: 0;
}
</style>