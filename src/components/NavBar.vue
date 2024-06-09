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
  <v-toolbar
    id="navbar"
    class="px-5 elevation-4"
    color="primary"
  >
    <template #prepend>
      <div class="text-h5">
        <button
          text="CronoProyect"
          color="primary"
          @click="frontPage"
        >
          CronoProyect
        </button>
      </div>
    </template>
    <v-divider
      class="ms-3"
      color="background"
      inset
      vertical
    />
    <v-toolbar-title class="d-flex text-left align-center">
      {{ userName }}
    </v-toolbar-title>

    <v-spacer />

    <v-toolbar-items>
      <ThemesSelector />

      <v-divider vertical />

      <div class="d-flex">
        <v-btn
          v-if="sessionStore.token != null"
          class="login-btn"
          variant="text"
          @click="logOut"
        >
          Logout
        </v-btn>
        <v-btn
          v-else
          class="login-btn"
          variant="text"
          @click="logIn"
        >
          LogIn
        </v-btn>
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