import {defineStore} from "pinia";
interface TimeManagerStore {
    paused: boolean;

}
export const useTimeManagerStore = defineStore("timeManager", {
    state:():TimeManagerStore=> {
        return {
            paused: true,
        };

    },
    getters:{
        isPaused(state):boolean{
            return state.paused;
        }
    },
    actions: {
        setPausedTrue(){
            this.paused = true
        },
        setPausedFalse(){
            this.paused = false
        }
    }
});