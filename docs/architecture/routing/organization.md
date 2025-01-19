---
sidebar_position: 1
---

# Организация роутов

Маршруты определяют структуру и поведение страниц фронтенд-приложения. С правильно организованной маршрутизацией вы упрощаете процесс разработки, улучшаете читаемость кода и предоставляет пользователям более понятное взаимодействие с приложением.

---

### 🛠 Принципы правильной организации роутов:

1. **Четкая структура**:
   - Роуты должны быть логически структурированы в соответствии с организацией фичей и их функциями.
   - Группируйте маршруты, связанные с одной фичей, или сегментируйте их по вложенности (`/auth/login`, `/auth/register`).

2. **Чистота кода**:
   - Определяйте маршруты централизованно (например, в одном файле `routes.ts`). Это помогает избежать рассредоточенного определения путей.

3. **Используйте динамические параметры и вложенные маршруты**:
   - Динамические параметры (`/products/:id`) позволяют удобно отображать страницы на основе входных данных.
   - Вложенные маршруты упрощают управление страницами, которые являются частью одной фичи.

4. **Ленивая загрузка**:
   - Загружайте страницы при необходимости (lazy loading) для оптимизации размеров бандла (см. пункт 3.4.3).

5. **Обработка ошибок и редиректы**:
   - Убедитесь, что у пользователя есть fallback на случай, если он попал на несуществующую страницу (`404`).

---

### ✅ Пример хорошей практики (с централизованным определением маршрутов)

```tsx
// routes.ts
export const routes = {
  home: "/",
  about: "/about",
  productDetail: (id: string) => `/products/${id}`, // Функция для генерации динамического маршрута
  login: "/auth/login",
  register: "/auth/register",
};

// AppRoutes.tsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.about} element={<AboutPage />} />
          <Route path={routes.productDetail(":id")} element={<ProductDetailPage />} />
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
};
```

---

### ❌ Пример плохой практики

```tsx
// Пример с рассредоточенным определением маршрутов внутри компонентов
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};
```

**Основные проблемы:**

1. Маршруты находятся непосредственно в `AppRoutes` без вынесенной конфигурации:
   - Если маршрут изменится (`/products/:id` сменится на `/items/:itemId`), его придется менять вручную во многих местах.
2. Нет функции для генерации маршрутов:
   - Трудно переиспользовать путь где-то еще, например, в навигационном меню компонента.

---

### 💡 Работа с вложенными маршрутам

Для страниц, у которых есть вложенная структура (например, `/dashboard/settings`, `/dashboard/users`), предпочтительнее использовать вложенные маршруты.

```tsx
// DashboardRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import DashboardSettingsPage from "./DashboardSettingsPage";
import DashboardUsersPage from "./DashboardUsersPage";

export const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}>
        {/* Вложенные маршруты */}
        <Route path="settings" element={<DashboardSettingsPage />} />
        <Route path="users" element={<DashboardUsersPage />} />
      </Route>
    </Routes>
  );
};
```

Теперь пользователю доступны:
- `/dashboard`, чтобы отобразить общую информацию.
- `/dashboard/settings` для настройки профиля.
- `/dashboard/users`, чтобы управлять пользователями.

---

### 🛠 Функции для работы с динамическими маршрутами

Создавайте утилиты для формирования динамических маршрутов.

```tsx
// routes.ts
export const routes = {
  productDetail: (id: string) => `/products/${id}`,
};

// Пример использования:
import { routes } from "./routes";

<Link to={routes.productDetail("12345")}>Перейти к продукту</Link>;
```

---

### 🎛 Хорошая структура маршрутов

Храни маршруты в виде конфигурационного файла `routes.ts`. Это помогает избежать дублирования путей в различных файлах и снижает вероятность ошибок.

**Пример структуры:**

```
src/
├── app/
│   ├── AppRoutes.tsx        // Основной роутер приложения
│   ├── routes.ts            // Константы и функции для маршрутов
├── pages/
│   ├── HomePage.tsx         // Главная страница
│   ├── AboutPage.tsx        // Страница "О нас"
│   ├── auth/
│   │   ├── LoginPage.tsx    // Страница входа
│   │   ├── RegisterPage.tsx // Страница регистрации
│   ├── products/
│       ├── ProductDetailPage.tsx // Динамическая страница продукта
```

---

### 🚩 Обработка ошибок и редиректы

1. **404-страница:** Убедитесь, что маршруту по умолчанию сопоставляется страница для несуществующих маршрутов.

```tsx
<Route path="*" element={<NotFoundPage />} />
```

2. **Редиректы:**
   - Используйте `Navigate`, чтобы переадресовывать пользователей.

```tsx
<Route path="/" element={<Navigate to="/dashboard" replace />} />
```

---

### 🎯 Выводы:

1. Используйте централизованную конфигурацию маршрутов (`routes.ts`).
2. Применяйте вложенные маршруты для логически связанных рутов.
3. Настраивайте Lazy Loading для оптимизации загрузки больших приложений.
4. Обязательно обрабатывайте ошибки и создавайте 404-страницу.