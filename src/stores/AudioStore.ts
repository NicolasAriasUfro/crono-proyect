import {defineStore} from "pinia";

export const useAudioStore = defineStore("audio", {
    state: () => {
        return {
            playing: false,
            muted: false,
            audio_: null as HTMLAudioElement | null,
        };
    },
    getters:{
        async audio(state) {
            const audioModule = await import("@/assets/audio/elevator-music.mp3");
            state.audio_ = new Audio(audioModule.default);
            return state.audio_;
        }
    }
});
