<style scoped>
ul { list-style: none; width: 250px; margin: 0 auto; text-align: right; font-size: 14px; }
ul li { line-height: 30px; display: flex; justify-content: flex-end; margin-bottom: 10px; }
ul span { display: inline-block; width: 60px; }
ul input { flex: 1; }
</style>

<template>
  <ul>
    <li>
      <label> 用户名：
        <input  type="text" class="username" v-model="user.username">
      </label>
    </li>
    <li>
      <label> 密码：
        <input  type="text" class="password" v-model="user.password">
      </label>
    </li>
    <li>
      <button class="submit" @click="onSubmit" :disabled="!validate">提交</button>
    </li>
  </ul>
</template>

<script>
import Service from './service';

export default {
  data: () => ({
    user: {
      username: '',
      password: '',
    },
  }),
  computed: {
    validate() {
      console.log(`this.user.username && this.user.password: ${this.user.username} --- ${this.user.password}`);
      return this.user.username && this.user.password;
    },
  },
  methods: {
    async onSubmit() {
      const response = await Service.login(this.user);
      if (response.status === 200) {
        this.loginSuccess();
        return;
      }
      this.loginFailure();
    },
    loginSuccess() {
      this.$router.push({ name: 'home' });
    },
    loginFailure() {
      // eslint-disable-next-line
      alert('用户名、密码错误，请稍后再试！');
    },
  },
};
</script>
