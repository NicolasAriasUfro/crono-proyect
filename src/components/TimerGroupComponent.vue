<script lang=ts>
import { useScheduleStore } from "@/stores/SheduleStore";
import { useSessionStore } from "@/stores/SessionStore";
import { Timer } from "@/types";
import { useGroupStore } from "@/stores/GroupStore";

export default {
    props: {
        idGroup: {
            type: Number,
            default: null,
        },
        idTimer: {
          type: Number,
          default: null,
        },
        isEditable: {
        type: Boolean,
        default: false,
        },  
    },
    data() {
        return {
            timerOptions: ["priorizada", "normal", "baja"],
            timerInterval: null,
            esPrioritaria: false,
            isDeleted: false,
            isActive: false,
            selectedSchedule: [] as Timer[] | undefined,
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
            const timer = this.selectedSchedule?.find((t) => t.id === this.idTimer);
            return timer ? timer.name : 0;
        },
        actualSeconds() {
            const timer = this.selectedSchedule?.find((t) => t.id === this.idTimer);
            return timer ? timer.actualSeconds : 0;
        },
        initialSeconds() {
            const timer = this.selectedSchedule?.find((t) => t.id === this.idTimer);
            return timer ? timer.initialSeconds : 0;
        },
        selectedTimer() {
            return this.selectedSchedule?.find((t) => t.id === this.idTimer)?.selected;
        },
        progress() {
            const timer = this.selectedSchedule?.find((t) => t.id === this.idTimer);
            if (!timer || timer.initialSeconds === 0) return 0;
            return (timer.actualSeconds / timer.initialSeconds) * 100;
        },
    },
    methods: {
        deleteTimer() {
            useScheduleStore().removeTimerFromActiveSchedule(this.idTimer);
        },
    },
    beforeMount() {
      this.selectedSchedule = useGroupStore().currentGroup[0].timers;
    }
};
</script>

<template>
  <v-card
    :color="selectedTimer ? 'success_light_1' : 'secondary_light_2'"
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
      <v-col>
        <h3>{{ name }}</h3>
        <strong> {{ formattedActualTime }} / {{ formattedInitialTime }}</strong>
        <!-- <div v-if="isEditable">time interval = {{ timerInterval }}</div> -->
      </v-col>
      <v-col>
        <v-select :items="timerOptions" />
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
    <v-row>
      <v-col>
        <v-progress-linear
          v-model="progress"
          color="success"
          height="6"
          class="smooth-progress"
        />
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

.eliminada {
    background-color: red;
}

.smooth-progress {
    transition: width 1s cubic-bezier(0.4, 0.0, 0.2, 1); 
}
</style>
