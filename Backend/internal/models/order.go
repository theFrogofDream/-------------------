package models

import "time"

type Order struct {
	id         int
	adress     string
	date       time.Time
	fullPrice  int
	userID     int
	status     string
	products   []Product
	created_at time.Time
}
