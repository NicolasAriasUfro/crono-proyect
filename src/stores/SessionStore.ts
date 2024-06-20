import { API_ROUTE } from "@/main";
import { CurrentUser, Group, LoginForm, RegisterForm, Timer, TimerBehavior, UserGroup } from "@/types";
import axios from "axios";
import {defineStore} from "pinia";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            id: 0 as number,
            token: null,
            userName: null,
            music: true,
            theme: "moraCremaTheme",
            groups: [] as UserGroup[],
        };
    },
    actions: {
        async fetchGroups(userId: number) {
            try {
                const groupsFetch = await axios.get(`${API_ROUTE}/api/groups/user/${userId}`)
                const groups: UserGroup[] = groupsFetch.data.map((group: { timer_group_id: never; name: never; timers: never[]; }) => {
                    return {
                        id: group.timer_group_id,
                        name: group.name,
                        timers: group.timers.map((timer: { timer_id: never; name: never; seconds: any; }) => {
                            return {
                                id: timer.timer_id,
                                name: timer.name,
                                initialSeconds: timer.seconds,
                                actualSeconds: timer.seconds,
                                behavior: TimerBehavior.NORMAL,
                                selected: false,
                            } as Timer;
                        })
                    } as UserGroup;
                });
                this.groups = groups;
            } catch (why) {
                console.log(why);
            }
        },
        async addGroup(group: Group) {
            try {
                const url = `${API_ROUTE}/api/user/add-group`;
                const data = {
                    user_id: this.id, //TODO: FIX THIS
                    group_id: group.id
                };
                const response = await axios.post(url, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const userGroup: UserGroup = {
                    id: response.data.timer_group_id,
                    name: response.data.name,
                    timers: response.data.timers.map((timer: { timer_id: never; name: never; seconds: never; }) => ({
                        id: timer.timer_id,
                        name: timer.name,
                        initialSeconds: timer.seconds,
                        actualSeconds: timer.seconds,
                        behavior: TimerBehavior.NORMAL,
                        selected: false,
                    }))
                };
                this.groups.push(userGroup);
            } catch (error) {
                console.log(error);
            }
        },
        async register(registerForm: RegisterForm) {
            try {
                const url = `${API_ROUTE}/api/user/register`;
                const _response = await axios.post(url, registerForm, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } catch (error) {
                console.log(error);
                // this is intended, trust me bro
                throw error;
            }
        },
        async login(loginForm: LoginForm) {
            try {
                const url = `${API_ROUTE}/api/user/login`;
                const response = await axios.post(url, loginForm, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log(response);
                this.id = response.data.user_id;
                this.token = response.data.access_token;
                this.userName = response.data.user_name;
            } catch (error) {
                console.log(error);
            }
        }
    },
    persist: true,
})