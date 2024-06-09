import {defineStore} from "pinia";

export const useAudioStore = defineStore("audio", {
    state: () => {
        return {
            playing: false,
            muted: false,
            audio: new Audio(require("@/assets/audio/elevator-music.mp3")),
        };
    },
});
