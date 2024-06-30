<script lang="ts">
import GoogleLogin from '../../../crono-proyect/src/components/GoogleLogin.vue'
import { useSessionStore } from '@/stores/SessionStore';
import router from '@/router';
import { LoginForm, RegisterForm } from '@/types';

export default {
  components: { GoogleLogin },
  data: () => ({
    hasRegistered: false,
    message: '',
    messageRegister: '',
    store: useSessionStore(),
    tab: "",
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
      this.validateRePassword();
    }
  },
  computed: {
    passwordMatch() {
      return (_value: string) => this.passwordRegister === this.rePassword || '¡Las contraseñas no coinciden!'
    }
  },
  methods: {
    accountCreated(isActive: any) {
      this.email = this.emailRegister;
      this.reset();
      this.tab = "login";
      isActive.value = false;
    },
    async register() {
      try {
        const registerForm: RegisterForm = {
          name: this.userNameRegister,
          email: this.emailRegister,
          password: this.passwordRegister
        }
        await this.store.register(registerForm);
        this.messageRegister = 'Cuenta creada con éxito'
        this.hasRegistered = true;
      } catch (error: any) {
        this.messageRegister = 'No se ha podido crear la cuenta ' + (error.response?.data || error.message);
      }
      
    },
    async authUser() {
      try {
        const loginForm: LoginForm = {
          email: this.email,
          password: this.password,
        };
        await this.store.login(loginForm);
        router.push({ path: '/cronograma' })
      } catch (error) {
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
      v-model="tab"
      class="rounded"
      bg-color="primary"
      direction="vertical"
      elevation-10
    >
      <div class="d-flex justify-space-between">
          <v-tab
            class="d-block mx-0"
            value="login"
            width="50%"
          >
            Login
          </v-tab>
          <v-tab
            class="d-block mx-0"
            value="registro"
            width="50%"
          >
            <div>
              Registro
            </div>
            
          </v-tab>
      </div>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="login">
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
          value="registro"
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
  <v-dialog v-model="hasRegistered" max-width="500">
    <template #default="{ isActive }">
      <v-card
        color="background"
        title="¡Cuenta creada exitosamente!"
        rounded
      >
        <v-divider
          class="mx-15"
          color="surface"
        />
        <v-sheet
          color="background"
          class="mx-auto"
        >
          
        </v-sheet>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="success"
            @click="accountCreated(isActive);;"
          >
            Ok!
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>