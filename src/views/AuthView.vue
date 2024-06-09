<script>
import AuthService from '../services/AuthService.js'
import GoogleLogin from '../../../crono-proyect/src/components/GoogleLogin.vue'
import { useSessionStore } from '@/stores/SessionStore';
import router from '@/router';

export default {
  components: { GoogleLogin },
  data: () => ({
    message: '',
    store: useSessionStore(),
    tab: 0,
    tabs: [
      {name:"Login", icon:"mdi-account"},
      {name:"Register", icon:"mdi-account-outline"}
    ],
    dialog: true,
    valid: true,
    authService: new AuthService(),
    email: '',
    emailRules: [
      value => {
        if (value) return true
        return 'Por favor ingresar correo.'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true
        return 'El correo debe ser valido.'
      }
    ],
    password: '',
    passwordRules: [
      value => {
        if ( value ) return true
        return 'Por favor ingresar Contraseña.'
      },
      v => (v.length >= 6) || "Min 6 caracteres!"
    ]
  }),
  methods: {
    authUser() {
      const currentUser = this.authService.checkUserValido(this.email, this.password);
      if (currentUser != null) {
        this.store.token = 'some token'; //TODO: TOKEN HERE
        this.store.userName = currentUser.userName;
        this.store.groups = currentUser.groups;
        router.push({ path: '/cronograma' })
      } else {
        this.$refs.loginForm.reset()
        this.message = '¡Credenciales incorrectas!';
      }
    },
    validate() {
      if (this.$refs.loginForm.validate()) {
        //TODO: MAGIC HERE (soon*)
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    back() {
      router.push({ name: "frontpage" })
    }
  },
}
</script>

<template>
  <v-sheet
    color="primary"
    height="100%"
  />
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
    min-width="360px"
    transition="dialog-transition"
  >
    <v-tabs
      class="rounded"
      bg-color="primary"
      direction="vertical"
      elevation-10
    >
      <div class="d-flex justify-space-between">
        <div class="flex-grow-1">
          <v-tab
            class="d-block mx-0"
            value="one"
            width="300px"
          >
            Login
          </v-tab>
        </div>
        <div class="flex-grow-1 justify-center">
          <v-tab
            class="d-block mx-0"
            value="dos"
            width="300px"
          >
            Registro
          </v-tab>
        </div>
      </div>
      <v-tabs-window>
        <v-tabs-window-item value="one">
          <v-card
            rounded="0"
            class="px-8 py-5"
            color="background"
          >
            <v-form
              ref="loginForm"
              v-model="valid"
              class="mb-3"
              validate-on="input"
            >
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    bg-color="teal-lighten-5"
                    color="red-darken-4"
                    :rules="emailRules"
                    label="Correo"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    bg-color="teal-lighten-5"
                    :rules="passwordRules"
                    :type="'password'"
                    label="Contraseña"
                    required
                  />
                </v-col>
                <v-col
                  class="d-flex align-center justify-space-between"
                  align-self="center"
                >
                  <div class="flex-grow-1">
                    <v-btn
                      align-center
                      color="pink-lighten-2"
                      type="button"
                      :disabled="!valid"
                      @click="authUser"
                    >
                      Ingresar
                    </v-btn>
                  </div>
                  <div class="flex-grow-1 text-center align-center align-end">
                    <p class="d-flex pl-4 text-center align-end">
                      {{ message }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-form>
            <hr>
            <div class="my-5 text-center ">
              <p>También puedes ingresar con:</p>
              <GoogleLogin />
            </div>
            <hr>
            <div class="d-flex justify-center mt-5">
              <v-btn
                color="success"
                @click="back"
              >
                Volver
              </v-btn>
            </div>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item
          value="dos"
          class="text-center"
        >
          SOON&#8482;
        </v-tabs-window-item>
      </v-tabs-window>
    </v-tabs>
  </v-dialog>
</template>