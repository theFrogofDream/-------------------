package service

import (
	"errors"
	"time"

	"Backend/internal/auth"
	"Backend/internal/config"
	"Backend/internal/dtos"
	"Backend/internal/models"
	"Backend/internal/repositories"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	repo   *repositories.UserRepository
	cfg    *config.Config
}

func NewUserService(repo *repositories.UserRepository, cfg *config.Config) *UserService {
	return &UserService{repo: repo, cfg: cfg}
}

func (s *UserService) Login(req dtos.LoginRequest) (*dtos.AuthResponse, error) {
	u, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("неверная почта или пароль")
		}
		return nil, err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("неверная почта или пароль")
	}
	token, err := auth.GenerateToken(u.ID, u.Role.Name, s.cfg.JWTSecret)
	if err != nil {
		return nil, err
	}
	return &dtos.AuthResponse{Token: token, User: toUserResponse(u)}, nil
}

func (s *UserService) Register(req dtos.RegisterRequest) error {
	exists, err := s.repo.ExistsByEmail(req.Email)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("email уже зарегистрирован")
	}
	exists, err = s.repo.ExistsByUsername(req.Login)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("логин уже занят")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	id, err := s.repo.NextID()
	if err != nil {
		return err
	}

	u := &models.User{
		ID:        id,
		Username:  req.Login,
		Email:     req.Email,
		Password:  string(hash),
		RoleID:    1,
		CreatedAt: time.Now(),
	}
	return s.repo.Create(u)
}

func toUserResponse(u *models.User) dtos.UserResponse {
	role := "user"
	if u.Role.Name != "" {
		role = u.Role.Name
	}
	return dtos.UserResponse{
		ID:       u.ID,
		Username: u.Username,
		Email:    u.Email,
		Role:     role,
	}
}
