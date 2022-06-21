import { defineStore } from 'pinia';
let timer;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    token: null,
    didAutoLogout: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    didAutoLogout: (state) => state.didAutoLogout,
  },
  actions: {
    setUser(payload) {
      this.token = payload.token;
      this.userId = payload.userId;
      this.didAutoLogout = false;
    },
    setAutoLogout() {
      this.didAutoLogout = true;
    },
    // 登陆
    async login(payload) {
      return this.auth({
        ...payload,
        mode: 'login',
      });
    },
    // 注册
    async signup(payload) {
      return this.auth({
        ...payload,
        mode: 'signup',
      });
    },
    // http逻辑
    async auth(payload) {
      const mode = payload.mode;
      let url = import.meta.env.VITE_SIGNIN_URL;

      if (mode === 'signup') {
        url = import.meta.env.VITE_SIGNUP_URL;
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message ||
            'Failded to authentication, check your login data'
        );
        throw error;
      }
      // token有效期设置
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      //本地缓存
      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      // 计时器
      timer = setTimeout(function () {
        this.autoLogout();
      }, expiresIn);

      this.setUser({
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: expirationDate,
      });
    },

    //自动登录
    tryLogin() {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpriration = localStorage.getItem('tokenExpiration');

      const expiresIn = +tokenExpriration - new Date().getTime();
      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(function () {
        this.autoLogout();
      }, expiresIn);

      if (token && userId) {
        this.setUser({
          token: token,
          userId: userId,
        });
      }
    },

    //登出
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('tokenExpiration');

      clearTimeout(timer);

      this.setUser({
        token: null,
        userId: null,
      });
    },

    autoLogout() {
      this.logout();
      this.setAutoLogout();
    },
  },
});
