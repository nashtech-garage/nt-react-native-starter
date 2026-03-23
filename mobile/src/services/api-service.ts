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

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  age: number;
  firstName: string;
  lastName: string;
};

export type UserProfileResponse = {
  status: boolean;
  data?: {
    id: number;
    username: string;
    email: string;
    age: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  error?: { message?: string };
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  age?: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  priceUnit: string;
};

export type ProductListResponse = {
  status: boolean;
  data?: Product[];
  error?: { message?: string };
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const apiService = {
  fetchData: () => axios.get('https://jsonplaceholder.typicode.com/photos'),
  login: (username: string, password: string) =>
    backendClient.post<LoginResponse>('/login', { username, password }),
  register: (payload: RegisterPayload) =>
    backendClient.post<LoginResponse>('/signup', payload),
  getProfile: (token: string) =>
    backendClient.get<UserProfileResponse>('/user/', {
      headers: authHeaders(token),
    }),
  updateProfile: (token: string, body: UpdateProfilePayload) =>
    backendClient.patch<UserProfileResponse>('/user/', body, {
      headers: authHeaders(token),
    }),
  getProducts: (token: string, priceUnit?: string) =>
    backendClient.get<ProductListResponse>('/product/', {
      headers: authHeaders(token),
      params: priceUnit && priceUnit !== 'all' ? { priceUnit } : undefined,
    }),
};
