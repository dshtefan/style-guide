---
sidebar_position: 2
---

# Хранение и обработка токенов

Токены (например, JWT) играют ключевую роль в авторизации пользователей. Неправильное хранение может привести к утечке данных и безопасности приложения в целом. В этом разделе мы разберем лучшие практики работы с токенами в React-приложениях с использованием **RTK Query**.

---

### 🔑 Основные подходы к работе с токенами

1. **Правильное место хранения токенов:**
   - **Local Storage**: Используется для хранения токенов, которые не истекают (например, в случае "Remember Me"). Однако это не самый безопасный подход, так как данные могут быть уязвимы для XSS-атак.
   - **Session Storage**: Больше подходит для временных сессий, токен стирается при закрытии вкладки. Аналогично уязвим для XSS.
   - **HttpOnly Cookies**: Самый безопасный способ, так как cookie недоступна из JavaScript, но требует настройки сервера.

2. **Обновление токенов:**
   - Для долгосрочной авторизации рекомендуется использовать **refresh-токены** с их безопасным хранением на сервере.

3. **Автоматическая обработка токена и повторный вход:**
   - Интерсепторы в RTK Query позволяют автоматически добавлять токены в заголовки запросов и обновлять их при необходимости.

---

### 📖 Пример реализации с RTK Query

#### 1️⃣ Настройка API-сервиса с токеном

Для начала создадим API-сервис, который будет работать с токенами. В случае устаревшего токена мы настроим его автоматическое обновление.

```tsx
// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Типизация токенов
interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

// Создаем API-сервис для авторизации
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://example.com/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Добавляем токен в заголовки
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthToken, { username: string; password: string }>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      // Обновляем токены после успешного логина
      transformResponse: (response: AuthToken) => response,
    }),
    refreshToken: builder.mutation<AuthToken, { refreshToken: string }>({
      query: (body) => ({
        url: "auth/refresh",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
```

---

#### 2️⃣ Настройка Redux Slice для хранения токенов

Создаем отдельный slice для управления токенами и информации о пользователе.

```tsx
// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthToken } from "../../services/authApi";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<AuthToken>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;
export default authSlice.reducer;
```

---

#### 3️⃣ Реализация компонента логина

Компонент для входа в систему, где мы сохраняем токены после успешного выполнения запроса.

```tsx
// components/LoginForm.tsx
import React, { useState } from "react";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setTokens } from "../features/auth/authSlice";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens = await login({ username, password }).unwrap();
      dispatch(setTokens(tokens)); // Сохраняем токены в Redux
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {isError && <p>Login failed. Please try again.</p>}
    </form>
  );
};

export default LoginForm;
```

---

#### 4️⃣ Автообновление токенов при их истечении

Добавление перехватчика для обработки обновления токенов.

```tsx
// services/authApi.ts (обновление baseQuery)
baseQuery: fetchBaseQuery({
  baseUrl: "https://example.com/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  onError: async (error, { dispatch, getState }) => {
    if (error?.status === 401) {
      const refreshToken = (getState() as RootState).auth.refreshToken;
      if (refreshToken) {
        const newTokens = await dispatch(
          useRefreshTokenMutation({ refreshToken })
        ).unwrap();
        dispatch(setTokens(newTokens)); // Обновляем токены
      } else {
        dispatch(clearTokens());
      }
    }
  },
}),
```

---

### ✅ Пример хорошей практики

1. Использование **RTK Query** убирает необходимость вручную пробрасывать токены в запросы.
2. Обновление токенов происходит автоматически, когда токен устаревает.
3. Токены хранятся в Redux (или в secure cookies/localStorage, если так требует проект).

---

### ❌ Пример плохой практики

```tsx
const sendRequest = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch("https://example.com/api/data", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshResp = await fetch("https://example.com/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    const newTokens = await refreshResp.json();
    localStorage.setItem("accessToken", newTokens.accessToken);
    localStorage.setItem("refreshToken", newTokens.refreshToken);
  }
};
```

**Почему это плохо:**
1. ❌ Логика запросов и обработки токенов разбита по коду на множество компонентов.
2. ❌ Широкое заимствование localStorage без проверки безопасности.
3. ❌ Нет централизованного хранилища токенов.

---

### 💡 Рекомендации:

1. **Используйте RTK Query**: Централизованно обрабатывайте токены и запросы.
2. **Храните токены в Redux, Secure Cookies или Session Storage.**
3. **Автоматически обновляйте токены через refresh-token API.**
4. Обрабатывайте ошибки, связанные с авторизацией, в одном месте (например, в `onError` RTK Query).

---

### 🎯 Выводы:

- RTK Query позволяет собрать работу с токенами в едином API-сервисе.
- Логика авторизации становится гораздо проще, благодаря хукам `useLoginMutation`, `useRefreshTokenMutation`.
- Автоматическая настройка токенов в заголовках запросов позволяет сосредоточиться на бизнес-логике, а не повторяющемся коде.