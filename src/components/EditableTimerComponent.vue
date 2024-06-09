<script lang=ts>
import { useScheduleStore } from "@/stores/SheduleStore";

export default {
  props: {
    isEditable: {
      type: Boolean,
      default: false,
    },
    idTimer: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      timeName: "",
      timerOptions: ["priorizada", "normal", "baja"],
      timerInterval: null,
      esPrioritaria: false,
      isActive: false,
    };
  },
  computed: {
    formattedActualTime() {
      const isNegativeTime = this.actualSeconds < 0;
      let seconds = this.actualSeconds;
      if (isNegativeTime) {
        seconds = -this.actualSeconds;
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

      if (isNegativeTime) {
        return `-${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      }
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    },
    formattedInitialTime() {
      const seconds = this.initialSeconds;
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    },
    name() {
      const selectedSchedule =
        useScheduleStore().schedules[useScheduleStore().selectedSchedule];
      const timer = selectedSchedule.timers.find((t) => t.id === this.idTimer);

      return timer ? timer.name : 0;
    },
    actualSeconds() {
      const selectedSchedule =
        useScheduleStore().schedules[useScheduleStore().selectedSchedule];
      const timer = selectedSchedule.timers.find((t) => t.id === this.idTimer);

      return timer ? timer.actualSeconds : 0;
    },
    initialSeconds() {
      const selectedSchedule =
        useScheduleStore().schedules[useScheduleStore().selectedSchedule];
      const timer = selectedSchedule.timers.find((t) => t.id === this.idTimer);

      return timer ? timer.initialSeconds : 0;
    },
  },
  mounted() {},
  methods: {
    deleteTimer() {
      useScheduleStore().removeTimerFromActiveSchedule(this.idTimer);
    },
    changeTimerName() {
      this.name = this.timeName;
      useScheduleStore().changeTimerName(this.idTimer, this.timeName);
    },
  },
};
</script>

<template>
  <v-card
    color="secondary_light_2"
    elevated
    ma-2
    class="timer rounded"
    :class="{
      priorizada: esPrioritaria,
      startedTimer: isActive,
      'bg-green': isActive,
      'elevation-20': isActive,
    }"
  >
    <v-row>
      <v-col>
        <h3>{{ name }}</h3>
        <strong>{{ formattedInitialTime }}</strong>
      </v-col>
      <v-col>
        <v-select :items="timerOptions"></v-select>
      </v-col>
      <v-col>
        <v-form @click.prevent>
          <v-text-field label="Nuevo nombre" v-model="timeName"></v-text-field>
          <v-btn color="success_light_1" @click="changeTimerName" :disabled="timeName===''">cambiar nombre</v-btn>
          <v-btn color="success_light_1" @click="deleteTimer">eliminar</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped></style>
