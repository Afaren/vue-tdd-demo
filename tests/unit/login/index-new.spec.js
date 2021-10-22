import { fireEvent, render, screen } from '@testing-library/vue';

import Vue from 'vue';
import sinon from 'sinon';
import VueRouter from 'vue-router';
import { createLocalVue, mount } from '@vue/test-utils';
import Login from '@/login/index.vue';
import App from '@/App.vue';
import Service from '@/login/service';
import Router from '@/router';

describe('Login Page', () => {

  it('When 用户访问登录页面，Then 看到用户名、密码输入框和提交按钮', () => {
    const { getByLabelText, getByText } = render(Login);

    getByLabelText('用户名：');
    getByLabelText('密码：');
    getByText('提交');
  });

  it('Given 用户访问登录页面，When 用户输入用户名为 谢小呆, 密码为 123，Then 页面中的 user 为 {username: "谢小呆", password: "123"}', async () => {
    const { getByDisplayValue, getByLabelText } = render(Login);

    const username = getByLabelText('用户名：');
    const password = getByLabelText('密码：');

    await fireEvent.update(username, '谢小呆');
    await fireEvent.update(password, '123');

    getByDisplayValue('谢小呆');
    getByDisplayValue('123');
  });

  // todo all old-style test cases

  it('Given 用户访问登录页面 And 用户输入用户名、密码，When 点击 submit，Then onSubmit 方法被调用', async () => {
    const onSumbitSpy = jest.spyOn(Login.methods, 'onSubmit');

    const { getByLabelText, getByText } = render(Login);

    const username = getByLabelText('用户名：');
    const password = getByLabelText('密码：');
    const sumbit = getByText('提交');

    await fireEvent.update(username, '谢小呆');
    await fireEvent.update(password, '123');
    await fireEvent.click(sumbit);

    expect(onSumbitSpy).toHaveBeenCalled();
  });

  it('Given 用户访问登录页面，When 用户未输入登录信息，Then submit 按钮为 disabled And 点击 submit 不会调用 onSubmit', async () => {
    const { getByText } = render(Login);
    const sumbit = getByText('提交');
    expect(sumbit).toBeDisabled();
  });

  it('Given 用户访问登录页面 And 用户输入用户名、密码，When 点击 submit，Then 调用 Service.login() 后返回 200 And 调用 loginSuccess 方法', async () => {
    Service.login = jest.fn();
    Service.login.mockResolvedValue({ status: 200 });

    const loginSuccess = jest.spyOn(Login.methods, 'loginSuccess');
    loginSuccess.mockImplementation();

    const { getByLabelText, getByText } = render(Login);

    const username = getByLabelText('用户名：');
    const password = getByLabelText('密码：');
    const sumbit = getByText('提交');

    await fireEvent.update(username, '谢小呆');
    await fireEvent.update(password, '123');
    await fireEvent.click(sumbit);

    await Vue.nextTick();

    expect(loginSuccess).toHaveBeenCalled();
  });

  it('Given 用户访问登录页面 And 用户输入用户名、密码，When 点击 submit，Then 调用 Service.login() 后返回不等于 200 And 调用 loginFailure 方法', async () => {
    Service.login = jest.fn();
    Service.login.mockResolvedValue({ status: 404 });

    const loginFailure = jest.spyOn(Login.methods, 'loginFailure');
    loginFailure.mockImplementation();

    const { getByLabelText, getByText } = render(Login);

    const username = getByLabelText('用户名：');
    const password = getByLabelText('密码：');
    const sumbit = getByText('提交');

    await fireEvent.update(username, '谢小呆');
    await fireEvent.update(password, '123');
    await fireEvent.click(sumbit);

    await Vue.nextTick();

    expect(loginFailure).toHaveBeenCalled();
  });

  it('When App load, should have totally 2 routes', async () => {

    render(App, {routes: Router }, (vue, store, router) => {
      expect(router.getRoutes()).toHaveLength(2);
    });
  });

  it('When 执行 loginSuccess()，Then $route.path 为 /', async () => {
    const localVue = createLocalVue();
    localVue.use(VueRouter);

    const wrapper = mount(Login, {
      localVue,
      router,
    });

    wrapper.vm.loginSuccess();
    expect(wrapper.vm.$route.path).toEqual('/');
  });
});
