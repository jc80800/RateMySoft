package auth

import (
	"fmt"
	"time"

	"ratemysoft-backend/internal/domain"

	"github.com/golang-jwt/jwt/v5"
)

// JWTService handles JWT token generation and validation
type JWTService struct {
	secretKey []byte
	issuer    string
	expiry    time.Duration
}

// NewJWTService creates a new JWT service
func NewJWTService(secretKey string, expiryHours int) *JWTService {
	return &JWTService{
		secretKey: []byte(secretKey),
		issuer:    "ratemysoft",
		expiry:    time.Duration(expiryHours) * time.Hour,
	}
}

// GenerateToken creates a new JWT token for the given user
func (s *JWTService) GenerateToken(user *domain.User) (string, error) {
	now := time.Now()
	expiresAt := now.Add(s.expiry)

	claims := &JWTClaims{
		UserID: user.ID.String(),
		Email:  string(user.Email),
		Handle: user.Handle,
		Role:   string(user.Role),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    s.issuer,
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(s.secretKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// ValidateToken validates a JWT token string and returns the claims
func (s *JWTService) ValidateToken(tokenString string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Verify the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.secretKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	// Additional validation: check issuer
	if claims.Issuer != s.issuer {
		return nil, fmt.Errorf("invalid token issuer")
	}

	return claims, nil
}

// ParseClaims parses a token without validating (useful for debugging)
func (s *JWTService) ParseClaims(tokenString string) (*JWTClaims, error) {
	token, _, err := jwt.NewParser().ParseUnverified(tokenString, &JWTClaims{})
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}
