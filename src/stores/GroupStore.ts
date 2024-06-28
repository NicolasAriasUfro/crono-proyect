import { API_ROUTE } from "@/main";
import { Group, Schedule, Timer, TimerBehavior, UserGroup } from "@/types";
import axios, { AxiosError } from "axios";
import {defineStore} from "pinia";
import { useSessionStore } from "./SessionStore";

export const useGroupStore = defineStore("group", {
    state: () => ({
        groups: [] as Group[],
        currentGroup: [] as UserGroup[],
        paused: true,
        selectedSchedule: 0,
        selectedTimer: 0,
        lastScheduleId: 0,
        selectedGroup: 0,
    }),
    actions: {
        async fetchAllGroups() {
            const headers = {
                'Authorization': `Bearer ${useSessionStore().token}`
            };
            try {
                const groupsFetch = await axios.get(`${API_ROUTE}/api/groups`, { headers })
                const groups: Group[] = groupsFetch.data.map((group: { timer_group_id: any; name: any; owner: any; owner_name: any; }) => {
                    return {
                        id: group.timer_group_id,
                        name: group.name,
                        isOwner: group.owner,
                        ownerName: group.owner_name
                    } as Group;
                });
                this.groups = groups;
            } catch (why) {
                console.log(why);
            }
        },
        async createGroup(notThecurrentShedule: Schedule) {
            const currentSchedule: UserGroup = useSessionStore().groups[0];
            try {
                const dto = {
                    timer_group_id: 50, //TODO: CHANGE THIS WHEN SCHEDULE WORKING
                    name: notThecurrentShedule.name,
                    timers: currentSchedule.timers.map(timer => ({
                        timer_id: timer.id,
                        name: timer.name,
                        seconds: timer.initialSeconds
                    })),
                };
                const headers = {
                    'Authorization': `Bearer ${useSessionStore().token}`,
                    'Content-Type': 'application/json'
                }
                const url = `${API_ROUTE}/api/groups/new`;
                const response = await axios.post(url, dto, { headers });
                const userGroup: UserGroup = {
                    id: response.data.timer_group_id,
                    name: response.data.name,
                    timers: response.data.timers.map((timer: { id: never; name: never; seconds: never; }) => ({
                        id: timer.id,
                        name: timer.name,
                        initialSeconds: timer.seconds,
                        actualSeconds: timer.seconds,
                        TimerBehavior: TimerBehavior.NORMAL,
                        selected: false,
                    })),
                };
                const group: Group = {
                    id: response.data.timer_group_id,
                    name: response.data.name,
                    isOwner: true,
                    ownerName: useSessionStore().userName
                }
                this.groups.push(group);
                useSessionStore().groups.push(userGroup);
            } catch (error: any) {
                console.log(error);
                console.log(error.stack);
                throw error;
            }
        },
        async deleteGroup(groupSelected: Group) {
            try {
                const dto = {
                    timer_group_id: groupSelected.id,
                    name: groupSelected.name,
                    owner: groupSelected.isOwner,
                    owner_name: groupSelected.ownerName,
                };
                const headers = {
                    'Authorization': `Bearer ${useSessionStore().token}`,
                    'Content-Type': 'application/json'
                }
                const url = `${API_ROUTE}/api/groups/delete`;
                const response = await axios.delete(url, { 
                    headers,
                    data: dto,
                });
                console.log(response)
            } catch (error: any) {
                console.log(error.stack)
                console.log(error)
            }
        },
        // getTimeOfSelectedTimer() {
        //     return this.groups[this.selectedGroup].cronograma[0].timers[
        //         this.selectedTimer
        //     ].actualSeconds;
        // },
        everySecond() {
            if (this.currentGroup.length > 0) {
                const currentTimer =
                    this.currentGroup[0].timers[this.selectedTimer];
                if (!this.paused && currentTimer) {
                    if (currentTimer.actualSeconds <= 0) {
                        currentTimer.actualSeconds = currentTimer.initialSeconds;
                        currentTimer.selected = false;
                        this.selectNextTimer();
                    } else {
                        currentTimer.actualSeconds--;
                        currentTimer.selected = true;
                    }
                }
            }
        },
        selectNextTimer() {
            //revisar si ya terminó
            if (this.selectedTimer >= this.currentGroup[0].timers.length) {
                this.paused = true;
                console.log("terminó");
                this.selectedTimer = 0;
            } else {
                this.selectedTimer++;
            }
        },
        // addTimer(nameTimer, initialSeconds) {
        //     this.schedules[this.selectedSchedule].lastTimerId++;
        //     //create the timer
        //     const newTimer = {
        //         id: this.schedules[this.selectedSchedule].lastTimerId,
        //         name: nameTimer,
        //         initialSeconds,
        //         actualSeconds: initialSeconds,
        //     };
        //     //add the timer
        //     this.schedules[this.selectedSchedule].timers.push(newTimer);
        //     return newTimer;
        // },
        // removeTimer(idSchedule, idTimer) {
        //     const schedule = this.schedules.find((s) => s.id === idSchedule);
        //     if (schedule) {
        //         const index = schedule.timers.findIndex(
        //             (timer) => timer.id === idTimer
        //         );
        //         if (index !== -1) {
        //             schedule.timers.splice(index, 1);
        //         }
        //     }
        // },
        // removeTimerFromActiveSchedule(idTimer) {
        //     // Remove the timer from the default schedule
        //     console.log(idTimer);
        //     const schedule = this.schedules[this.selectedSchedule];
        //     const index = schedule.timers.findIndex(
        //         (timer) => timer.id === idTimer
        //     );
        //     if (index !== -1) {
        //         this.schedules[this.selectedSchedule].timers.splice(index, 1);
        //     }
        // },
        // decreaseTimer(idTimer, seconds) {
        //     const selectedSchedule =
        //         useGroupStore().schedules[this.selectedSchedule];
        //     const timerIndex = selectedSchedule.timers.findIndex(
        //         (t) => t.id === idTimer
        //     );

        //     if (timerIndex !== -1) {
        //         selectedSchedule.timers[timerIndex].actualSeconds -= seconds;
        //         // Puedes agregar lógica adicional aquí, como manejar el caso en que actualSeconds sea menor que 0.
        //     }
        // },
        resetSchedule() {
            this.selectedTimer = 0;
            this.resetAllTimers();
        },
        // resetTimer(idTimer) {
        //     const selectedSchedule =
        //         this.groups[this.selectedGroup].cronograma[0].timers[
        //             this.selectedSchedule
        //         ];
        //     const timerIndex = selectedSchedule.timers.findIndex(
        //         (t) => t.id === idTimer
        //     );
        //     if (timerIndex !== -1) {
        //         selectedSchedule.timers[timerIndex].actualSeconds =
        //             selectedSchedule.timers[timerIndex].initialSeconds;
        //     }
        // },
        resetAllTimers() {
            //resetear todos los timer, igualar actualseconds a initialSecondos
            if (this.currentGroup.length > 0) {
                const currentTimers = this.currentGroup[0].timers;
                if (currentTimers) {
                    for (let i = 0; i < currentTimers.length; i++) {
                        currentTimers[i].actualSeconds =
                            currentTimers[i].initialSeconds;
                        currentTimers[i].selected = false;
                    }
                    this.selectedTimer = 0;
                } 
            }
        },
        // changeTimerName(idTimer, newName) {
        //     const selectedSchedule = this.schedules[this.selectedSchedule];
        //     const timerIndex = selectedSchedule.timers.findIndex(
        //         (t) => t.id === idTimer
        //     );
        //     if (timerIndex !== -1) {
        //         selectedSchedule.timers[timerIndex].name = newName;
        //     }
        // },
    },
    persist: true,
});
