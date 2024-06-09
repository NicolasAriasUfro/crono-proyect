<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
#app {
  text-align: center;
}
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
<script setup>
import { useIntervalStore } from "@/stores/IntervalStore";
import { useScheduleStore } from "@/stores/SheduleStore";
import { useSessionStore } from "./stores/SessionStore";
import { onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useGroupStore } from "./stores/GroupStore";
import { intervalService } from "./services/IntervalService";

const theme = useTheme();
const sessionStore = useSessionStore();
useScheduleStore().loadFromLocalStorage();

const setTheme = () => {
  theme.global.name.value = sessionStore.theme;
}


onMounted(() => {
  useIntervalStore().startInterval(intervalService, 1000);
  setTheme();
});
onUnmounted(() => {
  useIntervalStore().stopInterval();
  useScheduleStore().saveToLocalStorage();
});
</script>
