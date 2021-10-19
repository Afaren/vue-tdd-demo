import { fireEvent, render, screen } from '@testing-library/vue';

import Vue from 'vue';
import sinon from 'sinon';
import VueRouter from 'vue-router';
import { createLocalVue, mount } from '@vue/test-utils';
import Login from '@/login/index.vue';
import Service from '@/login/service';
import router from '@/router';

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
    const wrapper = mount(Login);
    const onSubmit = sinon.stub(wrapper.vm, 'onSubmit');

    wrapper.find('input.username').setValue('谢小呆');
    wrapper.find('input.password').setValue('123');
    // @vue/test-utils 更新到 1.0.3 之后 setValue 不能及时反映到 dom 的 disabled 属性上，需要异步
    await Vue.nextTick();
    wrapper.find('button.submit').trigger('click');

    expect(onSubmit.called).toBeTruthy();
  });

  it('Given 用户访问登录页面，When 用户未输入登录信息，Then submit 按钮为 disabled And 点击 submit 不会调用 onSubmit', async () => {
    const wrapper = mount(Login);
    const onSubmit = sinon.stub(wrapper.vm, 'onSubmit');
    const submitBtn = wrapper.find('button.submit');
    await Vue.nextTick();
    submitBtn.trigger('click');

    expect(submitBtn.attributes('disabled')).toEqual('disabled');
    expect(onSubmit.called).toBeFalsy();
  });

  it('Given 用户访问登录页面 And 用户输入用户名、密码，When 点击 submit，Then 调用 Service.login() 后返回 200 And 调用 loginSuccess 方法', async () => {
    const stub = sinon.stub(Service, 'login');
    stub.resolves({ status: 200 });

    const wrapper = mount(Login);
    const loginSuccess = sinon.stub(wrapper.vm, 'loginSuccess');

    const expectedUser = { username: '谢小呆', password: '123' };
    wrapper.find('input.username').setValue(expectedUser.username);
    wrapper.find('input.password').setValue(expectedUser.password);
    await Vue.nextTick();
    wrapper.find('button.submit').trigger('click');

    await Vue.nextTick();

    expect(loginSuccess.called).toBeTruthy();
    expect(stub.alwaysCalledWith(expectedUser)).toBeTruthy();
    stub.restore();
  });

  it('Given 用户访问登录页面 And 用户输入用户名、密码，When 点击 submit，Then 调用 Service.login() 后返回不等于 200 And 调用 loginFailure 方法', async () => {
    const stub = sinon.stub(Service, 'login');
    stub.resolves({ status: 404 });

    const wrapper = mount(Login);
    const loginFailure = sinon.stub(wrapper.vm, 'loginFailure');

    const user = { username: '谢小呆', password: '123' };
    wrapper.find('input.username').setValue(user.username);
    wrapper.find('input.password').setValue(user.password);
    await Vue.nextTick();
    wrapper.find('button.submit').trigger('click');

    await Vue.nextTick();

    expect(loginFailure.called).toBeTruthy();
    stub.restore();
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
