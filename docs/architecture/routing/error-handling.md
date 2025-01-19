---
sidebar_position: 4
---

# Обработка ошибок и fallback элементы

Обработка ошибок и fallback элементы — ключевые аспекты построения надежного приложения. Они позволяют избежать неожиданного поведения и предоставляют пользователю адекватную обратную связь, а разработчикам — понимание, где и почему что-то пошло не так.

**Цели:**
1. Предоставить пользователю понятное сообщение об ошибке.
2. Уменьшить потерю взаимодействия с интерфейсом.
3. Локализовать ошибки для более легкого их исправления.

---

### 🌟 Основные рекомендации:

1. **Обработка ошибок на уровне маршрутов**:
   - Если страница или компонент не загружаются, предоставьте fallback элемент (например, сообщите, что данные не были загружены).
   
2. **Глобальная обработка ошибок**:
   - Используйте Error Boundaries (`catch` для асинхронных вызовов) для отлова критических ошибок.

3. **Показывайте fallback элементы для пользовательского удобства**:
   - Например, отображайте спиннер или кастомную страницу ошибки.

4. **Создайте универсальную страницу "404" или "Не найдено"**:
   - Пользователь должен видеть дружественное напоминание, если запросил несуществующий ресурс.

5. **Обрабатывайте сетевые ошибки и сбои API**:
   - Если какое-то действие не удалось выполнить из-за проблемы с сетью или сервером, предоставьте обоснованное сообщение.

---

### ✅ Пример хорошей практики

#### Глобальная обработка ошибок с Error Boundary

Error Boundary помогает "поймать" ошибки в рендеринге и предотвратить падение всего приложения.

```tsx
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Использование ErrorBoundary:**

```tsx
import React, { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));

const App = () => (
  <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPage />
    </Suspense>
  </ErrorBoundary>
);
```

**Преимущества:**
- Приложение остается рабочим, даже если часть интерфейса ломается.
- Пользователь видит сообщение об ошибке вместо пустого экрана.

---

#### Обработка ошибки на уровне маршрутов

Добавьте страницу "404 Not Found" для обработки ошибок, когда пользователь попадает на несуществующий маршрут.

```tsx
// NotFoundPage.tsx
import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <p>Page not found</p>
      <a href="/">Go back to home</a>
    </div>
  );
};

export default NotFoundPage;
```

**Применение страницы Not Found в маршрутах:**

```tsx
// AppRoutes.tsx
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
```

**Чем это полезно?**
- Обработка случаев, когда пользователь попадает на несуществующий маршрут.
- Предоставление пользователю понятной навигации, чтобы вернуться к главной странице.

---

#### Обработка ошибок API

Для вызовов API обработка ошибок также очень важна. Используйте глобальный обработчик ошибок, который позволяет оповещать пользователя о сбоях.

```tsx
// api/fetchData.ts
import axios from "axios";

export const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data. Please try again later.");
  }
};
```

**Пример обработки ошибки в компоненте:**

```tsx
import React, { useEffect, useState } from "react";
import { fetchData } from "./api/fetchData";

const DataComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const result = await fetchData("https://api.example.com/data");
        setData(result);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchDataAsync();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return <div>Data: {JSON.stringify(data)}</div>;
};

export default DataComponent;
```

**Плюсы подхода:**
- Пользователь информирован о результатах загрузки или ошибках запроса.
- Интерфейс не зависает в ожидании.

---

### ❌ Пример плохой практики

Игнорирование ошибок:

```tsx
const DataComponent = () => {
  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <div>Data loaded.</div>;
};
```

**Проблемы:**
1. Ошибки никак не обрабатываются.
2. Если запрос провалится, пользователь ничего не узнает.
3. Отсутствует резервный сценарий на случай сбоя API.

---

### 🛠 Структура для обработки ошибок

**Пример структуры проекта:**

```
src/
├── components/
│   ├── ErrorBoundary.tsx      // Глобальный перехватчик ошибок
├── pages/
│   ├── NotFoundPage.tsx       // Страница "404"
│   ├── HomePage.tsx           // Главная страница
│   ├── ErrorPage.tsx          // Кастомная страница ошибки
├── api/
│   ├── fetchData.ts           // Обёртки над запросами API с обработкой ошибок
├── routes/
│   ├── AppRoutes.tsx          // Определение роутов
```

---

### 🎯 Выводы:

1. Используйте **Error Boundary** для предотвращения падений приложения.
2. Реализуйте fallback элементы для рендера временных состояний или ошибок.
3. Обрабатывайте сетевые ошибки в API и показывайте пользователю полезные сообщения.
4. Создавайте кастомные страницы для "404" и других предсказуемых ошибок.