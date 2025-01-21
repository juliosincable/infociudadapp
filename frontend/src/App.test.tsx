import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';

test('renders without crashing', () => {
    const { baseElement } = render(
        <IonReactRouter>
            <App />
        </IonReactRouter>
    );
    expect(baseElement).toBeDefined();
});

