export interface User {
    email: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface Item {
    id: number;
    name: string;
    description: string;
  }