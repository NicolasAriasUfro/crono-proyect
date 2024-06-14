<script lang=ts>
import {useScheduleStore} from "@/stores/SheduleStore";
import {useTheme} from "vuetify";
import {TimerBehavior} from "@/types.ts";
import {$enum} from "ts-enum-util";

interface Options{
  title:string,
  subtitle:string,
}
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
      theme: useTheme(),
      timerSubtitle: $enum(TimerBehavior).keys(),
      timerTitle: $enum(TimerBehavior).getKeys(),
      timerInterval: null,
      esPrioritaria: false,
      isDeleted: false,
      isActive: false,
    };
  },
  computed: {
    timerObjects():Options[]{
      let objects:Options[] = [];
      let opt:Options;
      for (let i = 0; i < this.timerSubtitle.length; i++) {
        opt = {
          title: this.timerTitle.at(i) || "",
          subtitle: this.timerSubtitle.at(i) || "",
        }
        objects.push(opt)
      }
      return objects
    },
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
      eliminada: isDeleted,
      startedTimer: isActive,
      'bg-green': isActive,
      'elevation-20': isActive,
    }"
  >
    <v-row>
      <v-col class="showtime">
        <h3>{{ name }}</h3>
        <strong> {{ formattedActualTime }} / {{ formattedInitialTime }}</strong>
        <div v-if="isEditable">
          time interval = {{ timerInterval }}
        </div>
      </v-col>
      <v-col>
        <v-select :item-props="true" :items="timerObjects" />
      </v-col>
      <v-col>
        <v-btn
          v-if="isEditable"
          @click="deleteTimer"
        >
          eliminar
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
* {
  /* border: orangered 1px solid; */
}

.priorizada {
  background-color: orange;
}
.timer {
  margin-bottom: 5px;
}

.eliminada {
  background-color: red;
}
.showtime{
  min-width: 19ch;
}
</style>
