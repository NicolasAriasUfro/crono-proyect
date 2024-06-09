import { defineStore } from "pinia";

export const useIntervalStore = defineStore("interval", {
  state: () => ({
    intervalId: null,
  }),
  actions: {
    startInterval(callback, interval) {
      // Si ya hay un intervalo en ejecución, lo detiene
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      // Inicia un nuevo intervalo
      this.intervalId = setInterval(callback, interval);
    },
    stopInterval() {
      // Detiene el intervalo en ejecución
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },
});
