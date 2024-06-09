<script lang="ts">
import {useSerialPortStore} from "@/stores/SerialPortStore";

export default {
  name: "ConfigView",
  methods: {
    useSerialPortStore,
    async selectReciverData() {
      await useSerialPortStore().connectSerialPort();
    },
    async changePort() {
      await useSerialPortStore().disconnectSerialPort();
      await useSerialPortStore().connectSerialPort();
    },
    async disconnectPort() {
      await useSerialPortStore().disconnectSerialPort();
    },
  },
};
</script>

<template>
  <h1>Configuración</h1>
  <h2>Conexión a un puerto COM</h2>
  <v-btn
    v-if="!useSerialPortStore().isPortOpen"
    color="success"
    @click="selectReciverData"
  >
    Elegir Puerto
  </v-btn>
  <v-container v-if="useSerialPortStore().isPortOpen">
    <v-btn @click="changePort">
      Cambiar
    </v-btn>
    <v-btn @click="disconnectPort">
      Desconectar
    </v-btn>
  </v-container>
  <v-divider class="ma-4" />
</template>

<style scoped></style>
