<script lang=ts>
import {useGroupStore} from "@/stores/GroupStore.js";
import {useTheme} from "vuetify";
import {useAudioStore} from "@/stores/AudioStore";
import { useSessionStore } from "@/stores/SessionStore";

export default {
  props: {
    groupId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    sessionStore: useSessionStore(),
    audioStore: useAudioStore(),
    theme: useTheme(),
    audio: useAudioStore().audio,
  }),
  beforeUpdate() {
    this.useGroupStore().selectedGroup = this.groupId;
  },
  methods: {
    useGroupStore,
    async playAudio() {
        (await this.audio).volume = 0.2;
        (await this.audio).loop = true;
        (await this.audio).play();
        this.audioStore.playing = true;
    },
    async pauseAudio() {
      (await this.audio).pause();
    },
    async muteAudio() {
      (await this.audio).muted = true;
      this.sessionStore.music = false;
      this.audioStore.muted = true;
    },
    async unMuteAudio() {
      (await this.audio).muted = false;
      this.sessionStore.music = true;
      this.audioStore.muted = false;
    },
    generalPause() {
      useGroupStore().paused = true;
      this.pauseAudio();
    },
    generalPlay() {
      useGroupStore().paused = false;
      this.playAudio();
    },
    generalReset() {
      this.generalPause();
      this.audioStore.playing = false;
      useGroupStore().resetAllTimers();
    },
  },
  beforeMount() {
    if (!this.sessionStore.music) {
      this.audioStore.muted = true;
      if (this.audioStore.audio_) {
        this.audioStore.audio_.muted = true;
      }
    }
  }
};
</script>

<template>
  <div class="general-bar">
    <button
      v-if="useGroupStore().paused"
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
</style>(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)(await this.audio)async async async 
