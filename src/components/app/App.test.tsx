import React from 'react';

import App from './App';
import { unmountComponentAtNode } from 'react-dom';
import '../../config/i18n';
import { fireEvent, render } from '@testing-library/react';

let container: HTMLDivElement = document.createElement('div');

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
});

test('loading overlay is shown before app is loaded', () => {
    const screen = render(<App />, { container });

    const overlay = screen.getByTestId('loading');
    expect(overlay).not.toBeNull();

    expect(document.querySelector('[data-testid=submit]')).toBeNull();
});

test('renders with disabled button', () => {
    const screen = render(<App />, { container });
    setTimeout(() => {
        const submitButton = screen.getByTestId('submit');
        expect(submitButton?.getAttribute('disabled')).toBe(true);
    }, 2000);
});

test('asleep drop down is limited', () => {
    const screen = render(<App />, { container });
    setTimeout(() => {
        const inBedSelect = screen.getByTestId('in-bed-select');

        fireEvent.change(inBedSelect, {
            target: { value: 120 },
        });

        expect(screen.getByTestId('asleep-120')).not.toBeNull();
        expect(screen.getByTestId('asleep-150')).toBeNull();
    }, 2000);
});

test('button enabled when both drop downs are selected', () => {
    const screen = render(<App />, { container });
    setTimeout(() => {
        const inBedSelect = screen.getByTestId('in-bed-select');
        const asleepSelect = screen.getByTestId('asleep-select');

        fireEvent.change(inBedSelect, {
            target: { value: 120 },
        });

        fireEvent.change(asleepSelect, {
            target: { value: 120 },
        });

        const submitButton = screen.getByTestId('submit');
        expect(submitButton?.getAttribute('disabled')).toBe(false);
    }, 2000);
});
