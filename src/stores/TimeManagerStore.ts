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
});