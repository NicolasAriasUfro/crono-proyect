<script lang=ts>
export default {
  name: "ChronometerComponent",
  data() {
    return {
      second: 0,
      minute: 0,
      hour: 0,
      timeString: "00:00:00",
      paused: true,
      started: false,
      timerInterval: null,
    };
  },
  computed: {
    formattedTime() {
      let timeString = "";
      timeString += this.hour < 10 ? `0${this.hour}` : this.hour + ":";
      timeString += ":";
      timeString += this.minute < 10 ? `0${this.minute}` : this.minute;
      timeString += ":";
      timeString += this.second < 10 ? `0${this.second}` : this.second;
      return timeString;
    },
  },
  methods: {
    crono() {
      this.timerInterval = setInterval(() => {
        if (this.second === 59) {
          this.second = 0;
          if (this.minute === 59) {
            this.minute = 0;
            this.hour = (this.hour + 1) % 24; // Reset to 0 after reaching 23
          } else {
            this.minute++;
          }
        } else {
          this.second++;
        }
      }, 1000);
    },
    startCrono() {
      this.started = true;
      if (this.paused) {
        this.paused = false;
        this.second = 0;
        this.minute = 0;
        this.hour = 0;
        this.crono();
      }
    },
    pauseCrono() {
      this.paused = true;
      clearInterval(this.timerInterval);
    },
    unpauseCrono() {
      this.paused = false;
      this.crono();
    },
    pauseManager() {
      if (this.paused) {
        this.unpauseCrono();
      } else {
        this.pauseCrono();
      }
    },
    resetCrono() {
      this.pauseCrono();
      this.second = 0;
      this.minute = 0;
      this.hour = 0;
    },
  },
};
</script>

<template>
  <div>
    <h5>Chronometer</h5>
    <div class="chronometer"></div>
    {{ formattedTime }}
    <div>
      <button v-if="!started" @click="startCrono">Start</button>
      <button v-else @click="pauseManager">
        {{ paused ? "Continue" : "Pause" }}
      </button>
      <button @click="resetCrono">Reset</button>
    </div>
  </div>
</template>

<style scoped></style>
