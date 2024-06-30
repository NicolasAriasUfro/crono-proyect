<script lang=ts>
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {useSessionStore} from '@/stores/SessionStore';
import router from '@/router';
import { SocialLogin } from '@/types';

export default {
        data: () => ({
            store: useSessionStore(),
            googleProvider: new GoogleAuthProvider(),
            auth: getAuth(),
        }),
        methods: {
            loginGoogle() {
                signInWithPopup(this.auth, this.googleProvider)
                    .then(async (result) => {
                        const _credential = GoogleAuthProvider.credentialFromResult(result);
                        const user = result.user;
                        const socialLogin: SocialLogin = {
                          name: user.displayName,
                          email: user.email,
                        };
                        try {
                          await this.store.socialLogin(socialLogin);
                          await this.store.fetchGroups();
                          setTimeout(() => {
                              router.push({ name: 'cronograma' }), 500
                          })
                        } catch (error) {
                          console.log(error);
                        }
                        
                    })
                    .catch( (why) => {
                        console.log("failed" + why);
                    })
            },
        },
    }
</script>


<template>
  <div class="my-3">
    <v-btn
      id="google-btn"
      color="background"
      rounded
      border="md"
      @click="loginGoogle"
    >
      <font-awesome-icon
        id="google-icon"
        icon="fa-brands fa-google"
      />
    </v-btn>
  </div>
</template>

<style>

</style>