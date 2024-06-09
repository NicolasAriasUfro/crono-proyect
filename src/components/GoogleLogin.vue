<script lang=ts>
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {useSessionStore} from '@/stores/SessionStore';
import router from '@/router';

export default {
        data: () => ({
            store: useSessionStore(),
            googleProvider: new GoogleAuthProvider(),
            auth: getAuth(),
        }),
        methods: {
            loginGoogle() {
                signInWithPopup(this.auth, this.googleProvider)
                    .then( (result) => {
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        const user = result.user;
                        this.store.token = credential?.accessToken; 
                        this.store.userName = user.displayName;
                        setTimeout(() => {
                            router.push({ name: 'cronograma' }), 500
                        })
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