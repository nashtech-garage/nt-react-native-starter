import axios from 'axios';

const backendClient = axios.create({
    // Android emulator -> host machine loopback
    baseURL: 'http://10.0.2.2:3000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export type LoginResponse = {
    status: boolean;
    data?: {
        user: any;
        token: string;
    };
    error?: {
        message?: string;
    };
};

export const apiService = {
    fetchData: () => axios.get('https://jsonplaceholder.typicode.com/photos'),
    login: (username: string, password: string) =>
        backendClient.post<LoginResponse>('/login', { username, password }),
};