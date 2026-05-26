package migration

import (
	"fmt"
	"log"
	"os"
	"time"

	"Backend/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const mockImage = "https://images.unsplash.com/photo-1628748714348-79dc6e6400c0?w=400&h=300&fit=crop"

func SeedMock(db *gorm.DB) {
	if os.Getenv("SEED_FORCE") == "true" {
		log.Println("mock seed: force reset...")
		clearMockTables(db)
	}

	var productCount int64
	db.Model(&models.Product{}).Count(&productCount)
	if productCount > 0 {
		log.Println("mock seed: skip (data already exists, set SEED_FORCE=true to refill)")
		return
	}

	log.Println("mock seed: filling database...")

	roles := []models.Role{
		{ID: 1, Name: "user"},
		{ID: 2, Name: "admin"},
	}
	mustDB(db.Create(&roles))

	statuses := []models.Status{
		{ID: 1, Name: "Новый"},
		{ID: 2, Name: "В обработке"},
		{ID: 3, Name: "Доставляется"},
		{ID: 4, Name: "Выполнен"},
		{ID: 5, Name: "Отменён"},
	}
	mustDB(db.Create(&statuses))

	tags := []models.Tag{
		{ID: 1, Name: "Металлопрокат"},
		{ID: 2, Name: "Литье чугунное"},
		{ID: 3, Name: "Асбестоцементные материалы"},
		{ID: 4, Name: "Строительные материалы"},
		{ID: 5, Name: "Метизы"},
		{ID: 6, Name: "ЖБИ изделия"},
		{ID: 7, Name: "Полимерные материалы"},
		{ID: 8, Name: "Полиэтиленовые материалы"},
		{ID: 9, Name: "Резинотехнические изделия"},
		{ID: 10, Name: "Сантехнические комплектующие"},
		{ID: 11, Name: "Сварочное оборудование"},
		{ID: 12, Name: "Материалы для наружной отделки"},
		{ID: 13, Name: "Материалы для внутренней отделки"},
		{ID: 14, Name: "Металлоизделия"},
	}
	mustDB(db.Create(&tags))

	products := mockProducts()
	mustDB(db.CreateInBatches(products, 50))

	pass, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	now := time.Now()
	users := []models.User{
		{ID: 1, Username: "admin", Email: "admin@test.ru", Password: string(pass), RoleID: 2, CreatedAt: now},
		{ID: 2, Username: "ivanov", Email: "user@test.ru", Password: string(pass), RoleID: 1, CreatedAt: now},
		{ID: 3, Username: "petrov", Email: "petrov@test.ru", Password: string(pass), RoleID: 1, CreatedAt: now},
		{ID: 4, Username: "sidorov", Email: "pidorov@test.ru", Password: string(pass), RoleID: 1, CreatedAt: now},
		{ID: 5, Username: "kozlov", Email: "kozlov@test.ru", Password: string(pass), RoleID: 1, CreatedAt: now},
	}
	mustDB(db.Create(&users))

	orders, items := mockOrders(products)
	mustDB(db.Create(&orders))
	mustDB(db.Create(&items))

	log.Printf("mock seed: ok (%d products, %d orders, %d users)", len(products), len(orders), len(users))
}

func mockProducts() []models.Product {
	names := []string{
		"Кирпич облицовочный", "Керамогранит", "Бетоназол", "Цемент М500", "Песок речной",
		"Арматура А500", "Уголок стальной", "Швеллер 10", "Лист г/к", "Профнастил С8",
		"Труба ПНД 32", "Манжета резиновая", "Кран шаровый", "Смеситель", "Унитаз компакт",
		"Плитка тротуарная", "Гипсокартон 12.5", "Утеплитель 50мм", "Пена монтажная", "Саморез 4.8x35",
		"Доска обрезная", "ОСБ-3 9мм", "Рубероид", "Мастика битумная", "Клей плиточный",
		"Затирка", "Грунтовка", "Краска фасадная", "Валик малярный", "Шпатель фасадный",
		"Электрод МР-3", "Сварочная маска", "Болт М12", "Гайка М12", "Шайба 12",
		"Анкер клиновой", "Дюбель 8x40", "Хомут сантехнический", "Сифон", "Перемычка ЖБ",
	}
	var list []models.Product
	for i, name := range names {
		tagID := (i % 14) + 1
		list = append(list, models.Product{
			ID:          i + 1,
			Name:        name,
			Count:       20 + (i * 7 % 180),
			Description: "Описание Описание Описание Описание",
			Price:       1200 + (i * 317 % 9000),
			ImageURL:    mockImage,
			TagID:       tagID,
		})
	}
	return list
}

func mockOrders(products []models.Product) ([]models.Order, []models.ProductInOrder) {
	type spec struct {
		userID   int
		statusID int
		adress   string
		lines    []struct{ productIdx, qty int }
	}

	specs := []spec{
		{2, 1, "ул. Ленина, 10", []struct{ productIdx, qty int }{{1, 1}}},
		{2, 2, "пр. Мира, 5", []struct{ productIdx, qty int }{{2, 2}, {3, 1}}},
		{3, 1, "ул. Гагарина, 22", []struct{ productIdx, qty int }{{4, 3}}},
		{3, 3, "ул. Советская, 7", []struct{ productIdx, qty int }{{5, 1}, {6, 2}}},
		{4, 4, "пер. Садовый, 3", []struct{ productIdx, qty int }{{7, 4}}},
		{4, 2, "ул. Победы, 18", []struct{ productIdx, qty int }{{8, 1}, {9, 1}}},
		{5, 1, "ул. Строителей, 1", []struct{ productIdx, qty int }{{10, 2}}},
		{5, 5, "ул. Заводская, 44", []struct{ productIdx, qty int }{{11, 1}}},
		{2, 3, "ул. Центральная, 9", []struct{ productIdx, qty int }{{12, 2}, {13, 1}}},
		{3, 4, "ул. Южная, 31", []struct{ productIdx, qty int }{{14, 5}}},
		{4, 1, "ул. Северная, 2", []struct{ productIdx, qty int }{{15, 1}, {16, 1}}},
		{5, 2, "ул. Восточная, 77", []struct{ productIdx, qty int }{{17, 2}, {18, 3}}},
	}

	var orders []models.Order
	var items []models.ProductInOrder
	itemID := 1
	baseDate := time.Date(2026, 5, 1, 0, 0, 0, 0, time.UTC)

	for i, s := range specs {
		total := 0
		for _, line := range s.lines {
			p := products[line.productIdx%len(products)]
			total += p.Price * line.qty
		}
		orderID := i + 1
		orders = append(orders, models.Order{
			ID:        orderID,
			Adress:    s.adress,
			Date:      baseDate.AddDate(0, 0, i*3),
			FullPrice: total,
			UserID:    s.userID,
			StatusID:  s.statusID,
			CreatedAt: baseDate.AddDate(0, 0, i*3).Add(2 * time.Hour),
		})
		for _, line := range s.lines {
			p := products[line.productIdx%len(products)]
			items = append(items, models.ProductInOrder{
				ID:        itemID,
				Count:     line.qty,
				ProductID: p.ID,
				OrderID:   orderID,
			})
			itemID++
		}
	}

	return orders, items
}

func clearMockTables(db *gorm.DB) {
	db.Exec("TRUNCATE products_in_orders, orders, products, users, tags, statuses, roles RESTART IDENTITY CASCADE")
}

func mustDB(result *gorm.DB) {
	if result.Error != nil {
		panic(fmt.Sprintf("mock seed: %v", result.Error))
	}
}
