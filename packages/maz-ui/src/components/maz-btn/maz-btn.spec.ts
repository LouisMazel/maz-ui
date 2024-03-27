import { newSpecPage } from '@stencil/core/testing';
import { MazBtn } from './maz-btn';

describe('maz-btn', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MazBtn],
      html: '<maz-btn></maz-btn>',
    });
    expect(root).toEqualHtml(`
      <maz-btn>
        <mock:shadow-root>
          <button>
            Hello, World! I'm
          </button>
        </mock:shadow-root>
      </maz-btn>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MazBtn],
      html: `<maz-btn first="Stencil" last="'Don't call me a framework' JS"></maz-btn>`,
    });
    expect(root).toEqualHtml(`
      <maz-btn first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <button>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </button>
        </mock:shadow-root>
      </maz-btn>
    `);
  });
});
