<script lang="ts">
import GoogleLogin from '../../../crono-proyect/src/components/GoogleLogin.vue'
import { useSessionStore } from '@/stores/SessionStore';
import router from '@/router';
import { LoginForm } from '@/types';

export default {
  components: { GoogleLogin },
  data: () => ({
    message: '',
    messageRegister: '',
    store: useSessionStore(),
    tab: 0,
    tabs: [
      {name:"Login", icon:"mdi-account"},
      {name:"Register", icon:"mdi-account-outline"}
    ],
    dialog: true,
    valid: true,
    userName: '',
    userNameRegister: '',
    userNameRules: [
      (value: string) => {
        if (value) return true
        return 'Por favor ingresar nombre de usuario.'
      },
      (value: string) => {
        if (value.length >= 4 && value.length <= 15) return true
        return 'El nombre de usuario debe tener entre 4 y 15 caracteres.' 
      }
    ],
    email: '',
    emailRegister: '',
    emailRules: [
      (value: string) => {
        if (value) return true
        return 'Por favor ingresar correo.'
      },
      (value: string) => {
        if (/.+@.+\..+/.test(value)) return true
        return 'El correo debe ser valido.'
      }
    ],
    password: '',
    passwordRegister: '',
    passwordRules: [
      (value: string) => {
        if ( value ) return true
        return 'Por favor ingresar Contraseña.'
      },
      (v: string) => (v.length >= 6) || "¡Mínimo 6 caracteres!",
      (v: string) => (v.length <= 15) || "¡Máximo 15 caracteres!"
    ],
    rePassword: '',
    rePasswordRules: [
      (value: string) => {
        if (value) return true;
        return 'Por favor repetir Contraseña.';
      },
      (v: string) => (v.length >= 6) || "¡Mínimo 6 caracteres!",
      (v: string) => (v.length <= 15) || "¡Máximo 15 caracteres!",
    ],
  }),
  watch: {
    passwordRegister() {
      console.log("pass")
      this.validateRePassword();
    }
  },
  computed: {
    passwordMatch() {
      return (_value: string) => this.passwordRegister === this.rePassword || '¡Las contraseñas no coinciden!'
    }
  },
  methods: {
    async register() {
      try {
        const loginForm: LoginForm = {
          name: this.userNameRegister,
          email: this.emailRegister,
          password: this.passwordRegister
        }
        await this.store.register(loginForm);
        this.messageRegister = 'Cuenta creada con éxito'
        this.reset();
      } catch (error) {
        this.messageRegister = 'No se ha podido crear la cuenta ' + (error.response?.data || error.message);
      }
      
    },
    authUser() {
      const currentUser = this.authService.checkUserValido(this.email, this.password);
      if (currentUser != null) {
        this.store.token = 'some token'; //TODO: TOKEN HERE
        this.store.userName = currentUser.userName;
        this.store.groups = currentUser.groups;
        router.push({ path: '/cronograma' })
      } else {
        this.reset();
        this.message = '¡Credenciales incorrectas!';
      }
    },
    validateRePassword() {
        (this.$refs.rePasswordField as any).validate();
    },
    reset() {
      (this.$refs.loginForm as any).reset();
    },
    resetValidation() {
      (this.$refs.form as any).resetValidation();
    },
    back() {
      router.push({ name: "frontpage" })
    },
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
      :v-value="tab"
      class="rounded"
      bg-color="primary"
      direction="vertical"
      elevation-10
    >
      <div class="d-flex justify-space-between">
        <div class="flex-grow-1">
          <v-tab
            class="d-block mx-0"
            :value="0"
            width="300px"
          >
            Login
          </v-tab>
        </div>
        <div class="flex-grow-1 justify-center">
          <v-tab
            class="d-block mx-0"
            :value="1"
            width="300px"
          >
            Registro
          </v-tab>
        </div>
      </div>
      <v-tabs-window>
        <v-tabs-window-item :value="0">
          <v-card
            rounded="0"
            class="px-8 pb-5 d-flex flex-column justify-center"
            color="background"
            height="550px"
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
          :value="1"
          class="text-center"
        >
        <v-card
            rounded="0"
            class="px-8 py-5"
            color="background"
            height="550px"
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
                    v-model="userNameRegister"
                    bg-color="teal-lighten-5"
                    color="red-darken-4"
                    :rules="userNameRules"
                    label="Nombre usuario"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="emailRegister"
                    bg-color="teal-lighten-5"
                    color="red-darken-4"
                    :rules="emailRules"
                    label="Correo"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordRegister"
                    bg-color="teal-lighten-5"
                    :rules="passwordRules"
                    :type="'password'"
                    label="Contraseña"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    ref="rePasswordField"
                    v-model="rePassword"
                    bg-color="teal-lighten-5"
                    :rules="[passwordMatch]"
                    :type="'password'"
                    label="Repetir Contraseña"
                    required
                  />
                </v-col>
                <v-col
                  class="d-flex align-center justify-space-between"
                  align-self="center"
                >
                  <div class="d-flex lex-grow-1 align-start">
                    <v-btn
                      align-center
                      color="pink-lighten-2"
                      type="button"
                      :disabled="!valid"
                      @click="register"
                    >
                      Registrar
                    </v-btn>
                  </div>
                  <div class="d-flex flex-grow-1 text-center justify-center">
                    <p class="d-flex pl-4 text-center align-end">
                      {{ messageRegister }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </v-form>
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
      </v-tabs-window>
    </v-tabs>
  </v-dialog>
</template>