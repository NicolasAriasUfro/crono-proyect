<script lang=ts>
import {useScheduleStore} from "@/stores/SheduleStore";
import {useTheme} from "vuetify/lib/framework.mjs";
import {useAudioStore} from "@/stores/AudioStore";

export default {
  data: () => ({
    audioStore: useAudioStore(),
    theme: useTheme(),
    audio: useAudioStore().audio,
  }),
  methods: {
    useScheduleStore,
    playAudio() {
        this.audio.volume = 0.2;
        this.audio.loop = true;
        this.audio.play();
        this.audioStore.playing = true;
    },
    pauseAudio() {
      this.audio.pause();
    },
    muteAudio() {
      this.audio.muted = true;
      this.audioStore.muted = true;
    },
    unMuteAudio() {
      this.audio.muted = false;
      this.audioStore.muted = false;
    },
    generalPause() {
      useScheduleStore().paused = true;
      this.pauseAudio();
    },
    generalPlay() {
      useScheduleStore().paused = false;
      this.playAudio();
    },
    generalReset() {
      this.generalPause();
      this.audioStore.playing = false;
      useScheduleStore().resetSchedule();
    },
  },
};
</script>

<template>
  <div class="general-bar">
    <button
      v-if="useScheduleStore().paused"
      @click.prevent="generalPlay"
    >
      <font-awesome-icon
        class="icon"
        icon="fa-solid fa-play"
      />
    </button>
    <button
      v-else
      @click.prevent="generalPause"
    >
      <font-awesome-icon
        class="icon"
        icon="fa-solid fa-pause"
      />
    </button>
    <button @click.prevent="generalReset">
      <font-awesome-icon
        class="icon"
        icon="fa-solid fa-stop"
      />
    </button>
    <v-divider
      class="ms-3 divider"
      vertical
    />
    <div class="ml-10">
      <button
        v-if="!audioStore.muted"
        @click.prevent="muteAudio"
      >
        <font-awesome-icon
          class="icon"
          icon="fa-solid fa-volume-high"
        />
      </button>
      <button
        v-else
        @click.prevent="unMuteAudio"
      >
        <font-awesome-icon
          class="icon"
          icon="fa-solid fa-volume-xmark"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.general-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: v-bind("theme.current.colors.background");
  padding: 10px;
  border-radius: 10px;
  width: 100%;
}
button {
  background-color: transparent;
  border: none;
  font-size: larger;
  margin: 0 10px;
}
.divider {
  border-color: v-bind("theme.current.colors.primary") !important;
}
.icon {
  color: var(--primary) !important;
}
</style>(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)
