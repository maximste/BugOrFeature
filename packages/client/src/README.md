# Структура `packages/client/src`

Клиент организован по [Feature-Sliced Design](https://feature-sliced.design/). Слои импортируют только из слоёв **ниже** (например, `pages` → `widgets`, `entities`, `shared`, `composibles`).

## Папки

| Папка | Назначение |
|-------|------------|
| [`app/`](./app/) | Инициализация приложения: `entry-client`, `entry-server`, Redux store, маршруты, SSR (`ssr`), глобальные стили, хук `usePage` |
| [`pages/`](./pages/) | Страницы (`main`, `not-found`). В `ui/` — компонент страницы, в `model/` — `init*` для загрузки данных при SSR |
| [`widgets/`](./widgets/) | Крупные составные блоки UI (например, `header`) |
| [`features/`](./features/) | Сценарии пользователя (действия). Пока заготовка |
| [`entities/`](./entities/) | Бизнес-сущности: данные, API, UI-кирпичи. Пока заготовка |
| [`shared/`](./shared/) | Переиспользуемый код без привязки к фичам: `config/`, `lib/` |
| [`composables/`](./composables/) | Чистые функции: форматирование, маппинг DTO → view и т.п. |

## Дерево

```text
src/
  app/          # store, routes, SSR, entries
  pages/        # main, not-found
  widgets/      # header
  features/     # (заготовка)
  entities/     # (заготовка)
  shared/       # config, lib
  composables/  # форматтеры, мапперы
```

## Соглашения

- **Public API:** наружу из слайса экспортируйте только через `index.ts`.
- **Алиас:** `@/` → `src/` (см. [`tsconfig.json`](../tsconfig.json), [`vite.config.ts`](../vite.config.ts)).
- **Вне `src`:** Express SSR-сервер — [`packages/client/server/`](../server/), не путать с `app/entry-server.tsx`.
