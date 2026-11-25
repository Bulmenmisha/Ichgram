# ICHgram

Мини-версия Instagram — финальный проект модуля **Node.js & TypeScript** (IT Career Hub).

Пользователи могут регистрироваться, публиковать фото, ставить лайки, комментировать, подписываться друг на друга, искать людей и получать уведомления.

## Стек

**Backend:** Node.js, Express 5, MongoDB (Atlas) + Mongoose, JWT, bcrypt, multer
**Frontend:** React 19, Vite, React Router, Axios, react-icons

## Функциональность

- Регистрация и вход по email или username (JWT, пароли хешируются bcrypt)
- Профиль: аватар, bio, website, счётчики постов / подписчиков / подписок, редактирование
- Посты: создание с фото, редактирование подписи, удаление (только своих)
- Лайки (toggle) и комментарии; удалять комментарий может его автор или автор поста
- Лента подписок, Explore (случайные посты), поиск пользователей
- Подписки / отписки
- Уведомления о лайках, комментариях и новых подписчиках
- Адаптивная вёрстка (desktop / tablet / mobile)

Изображения хранятся в MongoDB в формате Base64 (data URL), как требует задание.

## Структура

```
ichgram/
├── backend/
│   └── src/
│       ├── config/        # подключение к MongoDB
│       ├── controllers/   # логика: auth, user, post, like, comment, follow, search, notification
│       ├── middlewares/   # protect (JWT), upload (multer), validateId
│       ├── models/        # Mongoose-схемы
│       ├── routes/        # маршруты API
│       ├── app.js         # настройка Express
│       └── server.js      # запуск сервера
└── frontend/
    └── src/
        ├── api/           # axios с автоматической подстановкой токена
        ├── components/    # Sidebar, Layout, PostCard, PostModal, CreatePost, панели
        ├── context/       # AuthContext
        ├── pages/         # Login, Register, Home, Explore, Profile, EditProfile, NotFound
        └── utils/
```

## Запуск

Нужны Node.js 18+ и база MongoDB (например, бесплатный кластер MongoDB Atlas).

```bash
# Backend
cd backend
npm install
cp .env.example .env   # заполнить MONGO_URI и JWT_SECRET
npm run dev            # http://localhost:5001

# Frontend (во втором терминале)
cd frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

> На macOS порт 5000 занят AirPlay Receiver, поэтому сервер работает на 5001.

## API

🔒 — требуется заголовок `Authorization: Bearer <token>`

| Метод | Адрес | Описание |
|---|---|---|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход, возвращает JWT |
| GET | `/api/auth/me` 🔒 | Текущий пользователь |
| GET | `/api/users/:id` 🔒 | Профиль со счётчиками и `isFollowing` |
| PUT | `/api/users/profile` 🔒 | Редактирование профиля (multipart, поле `profileImage`) |
| POST | `/api/posts` 🔒 | Создать пост (multipart, поле `image`) |
| GET | `/api/posts/feed` 🔒 | Лента подписок |
| GET | `/api/posts/explore` 🔒 | Случайные посты |
| GET | `/api/posts/user/:userId` 🔒 | Посты пользователя |
| GET / PUT / DELETE | `/api/posts/:id` 🔒 | Пост: получить / изменить / удалить |
| POST / GET | `/api/likes/:postId` 🔒 | Поставить или снять лайк / список лайкнувших |
| POST / GET | `/api/comments/:postId` 🔒 | Добавить / получить комментарии |
| DELETE | `/api/comments/:commentId` 🔒 | Удалить комментарий |
| GET | `/api/search/users?q=` 🔒 | Поиск по username и имени |
| POST / DELETE | `/api/follow/:userId` 🔒 | Подписаться / отписаться |
| GET | `/api/follow/:userId/followers` 🔒 | Подписчики |
| GET | `/api/follow/:userId/following` 🔒 | Подписки |
| GET | `/api/notifications` 🔒 | Уведомления |
| PUT | `/api/notifications/read` 🔒 | Отметить все прочитанными |

## Безопасность

- Пароли хранятся только в виде bcrypt-хеша и никогда не возвращаются в ответах
- Все маршруты, кроме регистрации и входа, защищены JWT-middleware
- Изменять и удалять можно только свои посты (403 для чужих)
- Валидация входных данных и ObjectId, экранирование поискового запроса
- Загружаются только изображения размером до 5 МБ
