import { useSerialPortStore } from "@/stores/SerialPortStore";
import { defineStore } from "pinia";
import { ref } from 'vue';
export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    /**@Type int*/
    selectedSchedule: 0,
    /**@Type int */
    selectedTimer: 0,
    lastScheduleId: 0,
    schedules: [
      {
        id: 0,
        name: "Cronograma",
        lastTimerId: 0,
        timers: [
          { id: 0, name: "bienvenida", initialSeconds: 5, actualSeconds: 5 },
        ],
      },
    ],
    /** @Type boolean*/
    paused: true,
    /*
    schedules: [
      id: Number,
      name: String,
        timers: [{
          id: Number,
          name: String,
          initialSeconds: Number,
          actualSeconds: Number,

        }],
      },
    ],
     */
  }),
  getters: {
    lengthSchedules() {
      return this.schedules.length;
    },
    getSelectedTimer() {
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer];
    },
    timeOfSelectedTimer() {
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer]
        .actualSeconds;
    },
  },
  actions: {
    getTimeOfSelectedTimer() {
      return this.schedules[this.selectedSchedule].timers[this.selectedTimer]
        .actualSeconds;
    },
    everySecond() {
      if (!this.paused) {
        if (
          this.schedules[this.selectedSchedule].timers[this.selectedTimer]
            .actualSeconds <= 0
        ) {
          this.selectNextTimer();
        } else {
          this.schedules[this.selectedSchedule].timers[this.selectedTimer]
            .actualSeconds--;
        }
      }
      if (useSerialPortStore().isPortOpen) {
        useSerialPortStore().sendSerialPort();
      }
    },
    selectNextTimer() {
      //revisar si ya terminó
      if (
        this.selectedTimer >=
        this.schedules[this.selectedSchedule].timers.length - 1
      ) {
        this.paused = true;
        console.log("terminó");
        this.selectedTimer = 0;
      } else {
        this.selectedTimer++;
      }
    },
    addSchedule(name) {
      this.lastScheduleId++;
      const newSchedule = {
        id: this.lastScheduleId,
        lastTimerId: 0,
        name,
        timers: [],
      };
      this.schedules.push(newSchedule);
      this.saveToLocalStorage();
      return newSchedule;
    },
    removeSchedule(idSchedule) {
      const index = this.schedules.findIndex(
        (schedule) => schedule.id === idSchedule
      );
      if (index !== -1) {
        this.schedules.splice(index, 1);
      }
    },
    addTimer(nameTimer, initialSeconds) {
      this.schedules[this.selectedSchedule].lastTimerId++;
      //create the timer
      const newTimer = {
        id: this.schedules[this.selectedSchedule].lastTimerId,
        name: nameTimer,
        initialSeconds,
        actualSeconds: initialSeconds,
      };
      //add the timer
      this.schedules[this.selectedSchedule].timers.push(newTimer);
      this.saveToLocalStorage();
      return newTimer;
    },
    removeTimer(idSchedule, idTimer) {
      const schedule = this.schedules.find((s) => s.id === idSchedule);
      if (schedule) {
        const index = schedule.timers.findIndex(
          (timer) => timer.id === idTimer
        );
        if (index !== -1) {
          schedule.timers.splice(index, 1);
        }
      }
    },
    removeTimerFromActiveSchedule(idTimer) {
      // Remove the timer from the default schedule
      console.log(idTimer);
      const schedule = this.schedules[this.selectedSchedule];
      const index = schedule.timers.findIndex((timer) => timer.id === idTimer);
      if (index !== -1) {
        this.schedules[this.selectedSchedule].timers.splice(index, 1);
      }
      this.saveToLocalStorage();
    },
    decreaseTimer(idTimer, seconds) {
      const selectedSchedule =
        useScheduleStore().schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].actualSeconds -= seconds;
        // Puedes agregar lógica adicional aquí, como manejar el caso en que actualSeconds sea menor que 0.
      }
    },
    resetSchedule() {
      this.selectedTimer = 0;

      this.resetAllTimers();
    },
    resetTimer(idTimer) {
      const selectedSchedule = this.schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].actualSeconds =
          selectedSchedule.timers[timerIndex].initialSeconds;
      }
    },
    resetAllTimers() {
      //resetear todos los timer, igualar actualseconds a initialSecondos
      const timers = this.schedules[this.selectedSchedule].timers;
      for (let i = 0; i < timers.length; i++) {
        timers[i].actualSeconds = timers[i].initialSeconds;
      }

      this.saveToLocalStorage();
    },
    changeTimerName(idTimer, newName) {
      const selectedSchedule = this.schedules[this.selectedSchedule];
      const timerIndex = selectedSchedule.timers.findIndex(
        (t) => t.id === idTimer
      );

      if (timerIndex !== -1) {
        selectedSchedule.timers[timerIndex].name = newName;
      }
      this.saveToLocalStorage();
    },
    loadFromLocalStorage() {
      const storedSchedules = localStorage.getItem("schedules");
      if (storedSchedules) {
        this.schedules = JSON.parse(storedSchedules);
      }
      const selectedSchedule = localStorage.getItem("selectedSchedule");
      if (selectedSchedule) {
        this.selectedSchedule = parseInt(selectedSchedule);
      }
      const selectedTimer = localStorage.getItem("selectedTimer");
      if (selectedTimer) {
        this.selectedTimer = parseInt(selectedTimer);
      }
      const paused = localStorage.getItem("paused");
      if (paused) {
        this.paused = paused === "true";
      }
      const lastScheduleId = localStorage.getItem("lastScheduleId");
      if (lastScheduleId) {
        this.lastScheduleId = parseInt(lastScheduleId);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem("schedules", JSON.stringify(this.schedules));
      localStorage.setItem("selectedSchedule", this.selectedSchedule);
      localStorage.setItem("selectedTimer", this.selectedTimer);
      localStorage.setItem("paused", this.paused);
      localStorage.setItem("lastScheduleId", this.lastScheduleId);
    },
  },
});
