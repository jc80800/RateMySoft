package dto

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Handle   string `json:"handle" validate:"required,min=3,max=20"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type UserResponse struct {
	ID     string `json:"id"`
	Email  string `json:"email"`
	Handle string `json:"handle"`
	Role   string `json:"role"`
}
