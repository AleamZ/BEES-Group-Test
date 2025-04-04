import { createBrowserRouter, Navigate } from 'react-router-dom';
import FakeData from '../view/FakeData';
import ApiData from '../view/ApiData';
import App from '../App';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/fake-data" replace />
            },
            {
                path: 'fake-data',
                element: <FakeData />,
            },
            {
                path: 'api-data',
                element: <ApiData />,
            }
        ],
    },
]);