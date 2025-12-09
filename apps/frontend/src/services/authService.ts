import { api } from './api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login({ email, password }: LoginRequest) {
    const { data } = await api.post<LoginResponse>('/login', { email, password });
    return data;
  },

  async register({ name, email, password }: RegisterRequest) {
    const { data } = await api.post('/users', { name, email, password });
    return data;
  },
  
  async getProfile() {
    const { data } = await api.get('/me');
    return data;
  }
};

// const onFinish = async (values) => {
//   try {
//     const response = await authService.login(values);
    
//     // Salva o token recebido
//     localStorage.setItem('weplan.token', response.token);
    
//     message.success('Login realizado!');
//     navigate('/dashboard');
//   } catch (error) {
//     message.error('Email ou senha inválidos');
//   }
// }