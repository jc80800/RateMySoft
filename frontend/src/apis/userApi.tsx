import { ClientSideError } from "@/types/errors/error";
import { ApiErrorResponse } from "@/types/schemas/shared";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserDO,
} from "@/types/schemas/user";

export class UserApi {

  // Auth endpoints
  static async login(loginRequest: LoginRequest) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginRequest),
    });
    if(!res.ok){
      const json = await res.json() as ApiErrorResponse;
      throw new ClientSideError(json.error)
    }
    const json = await res.json() as AuthResponse;
    return json;
  }

  static async register(registerRequest: RegisterRequest) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerRequest),
    });

    if(!res.ok){
      const json = await res.json() as ApiErrorResponse;
      throw new ClientSideError(json.error)
    }

    const json = await res.json() as AuthResponse;
    return json;
  }

  static async getProfile() {
    const res = await fetch('/auth/profile', {
      method: 'GET',
    });

    if(!res.ok){
      const json = await res.json() as ApiErrorResponse;
      throw new Error(json.error)
    }

    const json = await res.json() as UserDO;
    return json;
  }

}
