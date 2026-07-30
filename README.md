# BugOrFeature (Котосапёр)

**Котосапер** — уютная браузерная игра в духе классического сапёра: открывайте клетки с котиками, помечайте подозрительные места рыбками-флажками и не разбудите спящих пёсиков. Проект разрабатывается в рамках курса Яндекс Практикума командой BugOrFeature.

## Об игре

Игровое поле — сетка закрытых клеток. Под некоторыми из них прячутся **пёсики** (мины), остальные безопасны. Цель — открыть все безопасные клетки, не наступив на пёсика.

| Элемент | Описание |
| :--- | :--- |
| 🐱 **Котик** | Безопасная открытая клетка |
| 🐶 **Пёсик** | Мина — открытие такой клетки завершает игру поражением |
| 🐟 **Рыбка** | Флажок на подозрительной клетке (правый клик) |
| **Цифра** | Сколько пёсиков среди 8 соседних клеток |

**Управление:** левый клик — открыть клетку; правый клик — поставить/убрать рыбку; клик по открытой клетке с цифрой — **хорд** (открывает соседей, если флажков достаточно). Первый клик всегда безопасен.

Подробнее о механике: [docs/scenario.md](docs/scenario.md), об игровом движке: [docs/gameEngine.md](docs/gameEngine.md).

## Реализованные фичи

### Игра
- Три уровня сложности: **Котёнок** (9×9), **Кот** (12×12), **Дикий кот** (16×16)
- **Кастомное поле** — настройка размера и числа мин
- Отрисовка на **Canvas** с анимациями наведения и открытия клеток
- Таймер, счётчик оставшихся мин, рестарт, баннер победы/поражения
- Режим **полноэкранного** отображения

### Пользователь и авторизация
- Регистрация, вход и выход (API Яндекс Практикума)
- **Профиль**: редактирование данных, загрузка аватара, смена пароля
- Уведомление об **офлайн-режиме** на странице профиля

### Сообщество
- **Форум**: список тем, просмотр топика, создание новой темы (пока на мок-данных)
- **Лидерборд** по уровням сложности (пока на мок-данных)

### Технические возможности
- **SSR** (Server-Side Rendering) на React + Express
- **PWA**: манифест, service worker, офлайн-кэширование
- Страницы ошибок **404** и **500**, Error Boundary
- Архитектура клиента по **Feature-Sliced Design**
- UI на **Chakra UI** с кастомной темой
- Docker-окружение для production (nginx + Node + PostgreSQL)
- **CSP** (Content Security Policy) — HTTP-заголовки безопасности контента
- Автодеплой статики на Vercel

## Презентация

Демо работы за **первые два спринта**: [видео на Яндекс Диске](https://disk.yandex.ru/i/DBDlcEll9FseOw)

---

### Как запускать?

0. Для проверки доработок 5-6 спринта достаточно выполнить команду yarn dev:spa
1. Убедитесь что у вас установлен `node` и `docker`
2. Выполните команду `yarn bootstrap` - это обязательный шаг, без него ничего работать не будет :)
3. Выполните команду `yarn dev`
3. Выполните команду `yarn dev --scope=client` чтобы запустить только клиент
4. Выполните команду `yarn dev --scope=server` чтобы запустить только server


### Как добавить зависимости?
В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента 
```yarn lerna add {your_dep} --scope client```

Для сервера
```yarn lerna add {your_dep} --scope server```

И для клиента и для сервера
```yarn lerna add {your_dep}```


Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
```yarn lerna add {your_dep} --dev --scope server```


### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

```yarn test```

### Линтинг

```yarn lint```

### Форматирование prettier

```yarn format```

### Production build

```yarn build```

И чтобы посмотреть что получилось


`yarn preview --scope client`
`yarn preview --scope server`

## Хуки
В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Ой, ничего не работает :(

Откройте issue, я приду :)

## Автодеплой статики на vercel
Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Docker и переменные окружения

Секреты и пароли **не хранятся в репозитории** — только в `.env` (файл в `.gitignore`).
Шаблон с тестовыми значениями для локальной разработки: `.env.sample`.

Перед первым запуском:

```bash
node init.js
```

Скрипт создаст `.env` из `.env.sample`, если его ещё нет.

### Переменные окружения

| Переменная | Назначение | Локально (`yarn dev`) | В Docker (server) |
| :--- | :--- | :--- | :--- |
| `POSTGRES_HOST` | Хост PostgreSQL | `localhost` | `postgres` (задаётся в compose) |
| `POSTGRES_PORT` | Порт на хосте | `5432` | `5432` (внутри сети compose) |
| `POSTGRES_USER` | Пользователь БД | из `.env` | из `.env` |
| `POSTGRES_PASSWORD` | Пароль БД | из `.env` | из `.env` |
| `POSTGRES_DB` | Имя базы | из `.env` | из `.env` |
| `EXTERNAL_SERVER_URL` | URL API для браузера / сборки клиента | `http://localhost:3001` | `http://localhost:3001` |
| `INTERNAL_SERVER_URL` | URL API внутри docker-сети | — | `http://server:3001` |

### Локальная разработка (только база в Docker)

```bash
node init.js
docker compose -f docker-compose.dev.yml up -d
yarn dev
```

PostgreSQL поднимается в контейнере, client и server — на хосте через `yarn dev`.

### Production-like окружение (полный стек)

```bash
node init.js
docker compose up --build
```

Запускаются три сервиса:

1. **client** — SSR-сервер клиента (Node)
2. **server** — API-сервер (Node), стартует после готовности PostgreSQL
3. **postgres** — база данных PostgreSQL 14

Порядок старта: `postgres` (healthcheck) → `server` → `client`.

Если нужен один сервис:

```bash
docker compose up postgres -d
docker compose up server
```

## Content Security Policy (CSP)

Политика безопасности контента ограничивает, откуда браузер может загружать скрипты, стили, изображения, API-запросы и другие ресурсы. Это снижает риск XSS и несанкционированной загрузки контента.

### Где реализовано

| Файл | Назначение |
| :--- | :--- |
| `packages/client/server/csp.ts` | Сборка политики, генерация nonce, middleware |
| `packages/client/server/index.ts` | Подключение CSP к SSR-серверу, nonce для inline-скриптов |
| `packages/client/public/color-mode-init.js` | Скрипт темы вынесен из inline в отдельный файл |
| `packages/client/vite.config.ts` | CSP для режима `yarn dev:spa` |
| `packages/client/nginx.conf` | Статическая CSP для деплоя через nginx |
| `packages/client/server/csp.test.ts` | Тесты сборки политики |

Заголовок `Content-Security-Policy` отправляется **с каждым HTTP-ответом** SSR-сервера клиента.

### Директивы (production, SSR)

| Директива | Значение | Зачем |
| :--- | :--- | :--- |
| `default-src` | `'self'` | Базовое ограничение — только наш origin |
| `script-src` | `'self' 'nonce-…'` | Скрипты с origin сайта и с matching nonce |
| `style-src` | `'self' 'unsafe-inline'` | Стили; `unsafe-inline` нужен для Chakra UI |
| `font-src` | `'self'` | Локальные шрифты (`/fonts/*.woff2`) |
| `img-src` | `'self' data: blob: https://ya-praktikum.tech` | Картинки, аватары, blob-превью |
| `connect-src` | `'self'` + API | XHR/fetch к BFF и API Практикума |
| `media-src` | `'self'` | Аудио игры |
| `worker-src` | `'self'` | Service Worker (PWA) |
| `form-action` | `'self' https://oauth.yandex.ru` | Отправка форм и OAuth |
| `object-src` | `'none'` | Запрет Flash/Java-плагинов |

`connect-src` дополнительно включает origin из `EXTERNAL_SERVER_URL` (форум, темы, BFF).

### Режимы разработки

- **`yarn dev` (SSR)** — политика с **nonce** на каждый запрос; для Vite HMR добавлен `'unsafe-eval'`.
- **`yarn dev:spa`** — упрощённая dev-политика через `vite.config.ts` (`'unsafe-inline'`, `'unsafe-eval'`), без per-request nonce.

### Как проверить

1. Запустите `yarn dev` или `yarn preview --scope client`.
2. Откройте DevTools → **Network** → выберите HTML-документ.
3. В **Response Headers** должен быть `Content-Security-Policy`.
4. В **Console** не должно быть ошибок вида `Refused to execute inline script` / `Refused to connect`.

Тесты политики:

```bash
yarn test --scope=client server/csp.test.ts
```

## Структура клиента (FSD)

Клиент организован по [Feature-Sliced Design](https://feature-sliced.design/).  
Описание папок в `packages/client/src`: [src/README.md](packages/client/src/README.md).