import { API_ROUTE } from "@/main";
import { Timer, TimerBehavior, UserGroups } from "@/types";
import axios from "axios";
import {defineStore} from "pinia";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            token: null,
            userName: null,
            theme: "moraCremaTheme",
            groups: [] as UserGroups[],
        };
    },
    actions: {
        async fetchGroups(userId: number) {
            try {
                const groupsFetch = await axios.get(`${API_ROUTE}/api/groups/user/${userId}`)                
                const groups: UserGroups[] = groupsFetch.data.map((group: { timer_group_id: any; name: any; timers: any[]; }) => {
                    return {
                        id: group.timer_group_id,
                        name: group.name,
                        groups: group.timers.map((timer: { timer_id: any; name: any; seconds: any; }) => {
                            return {
                                id: timer.timer_id,
                                name: timer.name,
                                initialSeconds: timer.seconds,
                                actualSeconds: timer.seconds,
                                behavior: TimerBehavior.NORMAL,
                                selected: false,
                            } as Timer;
                        })
                    } as UserGroups;
                });
                this.groups = groups;
            } catch (why) {
                console.log(why);
            }
        },
    },
    persist: true,
})