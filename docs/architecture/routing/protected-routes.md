---
sidebar_position: 2
---

# Защищенные маршруты

Защищенные маршруты используются для ограничения доступа к определенным страницам приложения. Только пользователи, соответствующие определенным требованиям (например, авторизованные), могут получить доступ к таким маршрутам. Важно правильно организовать защищенные маршруты, чтобы избежать утечек данных и повысить безопасность приложения.

---

### 🛡️ Принципы реализации защищенных маршрутов:

1. **Проверка состояния авторизации**:
   - Убедитесь, что у пользователя есть токен доступа, или он авторизован через глобальное состояние (например, Redux, Zustand) или `Context API`.
   - Ограничивайте доступ к маршрутам в зависимости от состояния пользователя.

2. **Перенаправление (Redirect)**:
   - Если пользователь не авторизован, перенаправляйте его, например, на страницу входа.

3. **Разграничение доступа**:
   - Проверяйте роли пользователя или уровни доступа для определенных маршрутов (например, администратор, пользователь).

4. **Гибкость для публичных страниц**:
   - Дайте возможность открывать публичные маршруты, такие как `/login` или `/register`, для всех пользователей.

5. **Lazy Loading защищенных маршрутов**:
   - Ленивая загрузка защищенных компонентов улучшает производительность.

---

### ✅ Пример хорошей практики

Рассмотрим реализацию компонента `<ProtectedRoute />`, который проверяет, авторизован ли пользователь. Если нет, он перенаправляется на страницу входа.

```tsx
// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isAuthorized: boolean;
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthorized, children }) => {
  if (!isAuthorized) {
    // Перенаправление на страницу логина
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

**Использование защищенного маршрута:**

```tsx
// AppRoutes.tsx
import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));

const AppRoutes: React.FC = () => {
  const isAuthorized = Boolean(localStorage.getItem("authToken")); // Проверка авторизации (пример)

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Защищенные маршруты */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthorized={isAuthorized}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
```

**Почему это хороший пример:**
1. Защищенная логика вынесена в отдельный компонент (`ProtectedRoute`), что упрощает его повторное использование.
2. Неавторизованные пользователи перенаправляются на страницу входа.
3. Реализована проверка через простую, но расширяемую логику состояния (`isAuthorized`).

---

### ❌ Пример плохой практики

Пример с дублированием логики проверки авторизации в каждом роуте:

```tsx
// AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const isAuthorized = Boolean(localStorage.getItem("authToken"));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Логика авторизации в каждом роуте */}
      {isAuthorized ? (
        <Route path="/dashboard" element={<DashboardPage />} />
      ) : (
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};
```

**Проблемы:**
1. Логика проверки (`isAuthorized`) дублируется для каждого защищенного маршрута.
2. Если нужно изменить проверку, это потребует правок в нескольких местах.
3. Код громоздкий и не поддерживает другие типы проверки (например, роли пользователя).

---

### 🧑‍💼 Разграничение доступа по ролям

Если нужно организовать доступ на основе ролей пользователя (например, "администратор" или "обычный пользователь"), модифицируем компонент `ProtectedRoute`.

```tsx
// RoleBasedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface RoleBasedRouteProps {
  isAuthorized: boolean;
  requiredRole: string;
  userRole?: string; // Текущая роль пользователя
  children: React.ReactElement;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  isAuthorized,
  requiredRole,
  userRole,
  children,
}) => {
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
```

**Использование для страниц с доступом по ролям:**

```tsx
<Route
  path="/admin"
  element={
    <RoleBasedRoute
      isAuthorized={isAuthorized}
      userRole={userRole} // Роль текущего пользователя
      requiredRole="admin"
    >
      <AdminPage />
    </RoleBasedRoute>
  }
/>
```

**Что произойдет:**
1. Если пользователь не авторизован, он будет перенаправлен на `/login`.
2. Если его роль не соответствует "admin", перенаправление произойдет на `/unauthorized`.

---

### 💡 Рекомендации:

1. **Повторное использование логики**:
   - Всегда оборачивайте логику проверки в компоненты высокого порядка (например, `ProtectedRoute`) или используйте хуки.

2. **Роли**:
   - Выделите роли пользователей в глобальное состояние (например, в Redux или Context), чтобы упростить управление доступом.

3. **Четкое разделение логики авторизации и роутов**:
   - Храните проверки и маршруты в отдельной области кода.

4. **Обработка неавторизованных страниц**:
   - Реализуйте страницу для неавторизованных пользователей (например, `/unauthorized`), чтобы объяснить причину ограничения.

---

### Пример структуры проекта для защищённой маршрутизации:

```
src/
├── components/
│   ├── ProtectedRoute.tsx      // Компонент для проверки авторизации
│   ├── RoleBasedRoute.tsx      // Компонент для проверки по ролям доступа
├── pages/
│   ├── LoginPage.tsx           // Страница входа
│   ├── AdminPage.tsx           // Страница администратора
│   ├── UnauthorizedPage.tsx    // Страница для неавторизованных пользователей
├── routes/
│   ├── AppRoutes.tsx           // Общие маршруты приложения
│   ├── routes.ts               // Конфигурация маршрутов
```

---

### 🎯 Выводы:

1. Реализуйте защищенные маршруты через компоненты (`ProtectedRoute`, `RoleBasedRoute`), чтобы избежать дублирования логики.
2. Предусмотрите обработку маршрутов для различных сценариев, таких как неавторизованность или отсутствие привилегий.
3. Убедитесь, что ваша маршрутизация гибкая и масштабируемая для роста приложения.