import {defineStore} from "pinia";
interface IntervalStoreState {
    intervalId: null | number
}
export const useIntervalStore = defineStore("interval", {
  state: ():IntervalStoreState => ({
    intervalId: null,
  }),
  actions: {
    startInterval(callback:any, interval: number):void {
      // Si ya hay un intervalo en ejecución, lo detiene
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      // Inicia un nuevo intervalo
      this.intervalId = Number(setInterval(callback, interval));
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
