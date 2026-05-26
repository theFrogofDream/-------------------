# Docker: Backend

Стек: **backend** (Go/Gin), **postgres**, **redis**.

## Быстрый старт

В `docker-compose.yml` задано `name: uralstroybaza` (иначе при пути из одних дефисов Docker не сможет вывести имя проекта).

Убедитесь, что порт **8080** свободен.

Из корня репозитория:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
docker compose logs backend
```

API: `http://localhost:8080`

PostgreSQL: `localhost:5432` (`postgres` / `postgres`, БД `mydb`).

Redis: `localhost:6379`

## Остановка

```bash
docker compose down
```

С удалением данных БД:

```bash
docker compose down -v
```

## Frontend + Browser

Backend в Docker, фронт локально:

```bash
cd Frontend/Frontend
npm install
npm run dev
```

В `vite.config.js` должен быть proxy `/api` → backend (см. ниже). Откройте в Cursor Browser:

| URL | Макет |
|-----|--------|
| `/login` | Авторизация |
| `/register` | Регистрация |
| `/` | Каталог |
| `/cart` | Корзина |
| `/profile` | Личный кабинет |
| `/admin` | Админ-панель |

### Vite proxy

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

## Расхождения API (пока handlers не реализованы)

| Frontend | Backend (AGENTS.md) |
|----------|---------------------|
| `POST /api/registr` | `POST register` |
| `GET /api/products` | `GET products/:tagid` |
| `PATCH /api/order/:id` | `PATCH order/:id` |
| Корзина в Redis | CartContext в памяти (Redis в compose готов) |

После `rewrite` префикс `/api` снимается; пути совпадают с роутером Gin.

## Переменные окружения

См. [`.env.example`](.env.example). Для локального Go без Docker: `DB_HOST=localhost`, `REDIS_ADDR=localhost:6379`.

## Инициализация БД

При первом запуске `postgres` выполняется [`Diplom.sql`](Diplom.sql) в БД `mydb` (только таблицы). Тестовые данные — seed в backend при старте.
