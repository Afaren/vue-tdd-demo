import { render, screen } from '@testing-library/vue';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const { debug } = render(HelloWorld, {
      propsData: { msg },
    });

    debug();

    expect(screen.queryByText(msg))
      .toBeTruthy();
  });
});
