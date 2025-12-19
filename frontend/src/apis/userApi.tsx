import { AuthResponse, LoginRequest, RegisterRequest, UserDO } from "@/types/schemas/user";

export class UserApi {




  // Auth endpoints
  static async login(loginRequest : LoginRequest): Promise<AuthResponse> {
    const data = await fetchHelper('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginRequest),
    });
    return data;
  }

  static async register(registerRequest : RegisterRequest): Promise<AuthResponse> {
    const data = await fetchHelper('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerRequest),
    });
    return data;
  }

  static async getProfile(): Promise<UserDO> {
    const data = await fetchHelper('/auth/profile', {
      method: 'GET',
    });
    return data;
  }

}
