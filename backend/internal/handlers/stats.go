package handlers

import (
	"gaming-lag-platform/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	userRepo    *repository.UserRepository
	postRepo    *repository.PostRepository
	networkRepo *repository.NetworkRepository
}

func NewStatsHandler(
	userRepo *repository.UserRepository,
	postRepo *repository.PostRepository,
	networkRepo *repository.NetworkRepository,
) *StatsHandler {
	return &StatsHandler{userRepo: userRepo, postRepo: postRepo, networkRepo: networkRepo}
}

func (h *StatsHandler) GetGlobalStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"users": h.userRepo.Count(),
		"posts": h.postRepo.Count(),
		"tests": h.networkRepo.CountAll(),
	})
}
