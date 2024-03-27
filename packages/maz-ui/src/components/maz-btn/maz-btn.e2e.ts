import { newE2EPage } from '@stencil/core/testing';

describe('maz-btn', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<maz-btn></maz-btn>');
    const element = await page.find('maz-btn');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<maz-btn></maz-btn>');
    const component = await page.find('maz-btn');
    const element = await page.find('maz-btn >>> button');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
