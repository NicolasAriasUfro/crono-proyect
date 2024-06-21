import { API_ROUTE } from "@/main";
import { Group, LoginForm, RegisterForm, SocialLogin, Timer, TimerBehavior, UserGroup } from "@/types";
import axios from "axios";
import {defineStore} from "pinia";

export const useSessionStore = defineStore('session', {
    state: () => {
        return {
            token: null,
            userName: null,
            music: true,
            theme: "moraCremaTheme",
            groups: [] as UserGroup[],
        };
    },
    actions: {
        async fetchGroups() {
            try {
                const headers = {
                    'Authorization': `Bearer ${this.token}`
                };
                const groupsFetch = await axios.get(`${API_ROUTE}/api/groups/user`, { headers })
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
                    group_id: group.id
                };
                const response = await axios.post(url, data, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
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
                throw error;
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
                this.token = response.data.access_token;
                this.userName = response.data.user_name;
            } catch (error) {
                console.log(error);
            }
        },
        async socialLogin(socialLogin: SocialLogin) {
            try {
                const url = `${API_ROUTE}/api/user/social-login`;
                const response = await axios.post(url, socialLogin, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                this.token = response.data.access_token;
                this.userName = response.data.user_name;
            } catch (error) {
                console.log(error);
            }
        }
    },
    persist: true,
})