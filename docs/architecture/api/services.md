---
sidebar_position: 3
---

# Выделение сервисов для работы с API

**Выделение сервисов** — это принцип создания отдельного слоя для обработки запросов к серверу. В этом слое можно разместить логику запросов, их настройку и управление данными, оставив компоненты максимально чистыми и сфокусированными только на отображении UI.

---

### 🎯 Зачем выносить API в отдельные сервисы?

1. **Разделение ответственности**: Компоненты отвечают только за отображение, а работа с API сосредоточена в одном месте (Separation of Concerns 🚀).
2. **Повышаем переиспользуемость**: Логику запросов можно использовать в разных частях приложения.
3. **Тестируемость**: Сервисы проще тестировать независимо от UI.
4. **Масштабируемость**: Добавление новой бизнес-логики или API вызовов становится менее трудозатратным.

---

### 🔑 Основные подходы

1. Все API вызовы группируются по доменам/фичам. Например, запросы, связанные с пользователями, размещаются в одном сервисе, а запросы для задач (todos) — в другом.
2. Использование **Redux Toolkit Query (RTK Query)** позволяет удобно управлять кэшированием, запросами и мутациями. Все эндпоинты группируются с помощью `createApi`.
3. Каждый сервис становится самодостаточной единицей, легко интегрируемой в любой модуль приложения.

---

### ✅ Пример хорошей практики (с использованием RTK Query)

Создадим два разных API-сервиса: один для работы с **пользователями**, второй — для **задач (TODOs)**.

#### 1️⃣ Сервис для пользователей (User API)

```tsx
// services/userApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://example.com/api",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id: string) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const { useGetUserByIdQuery, useUpdateUserMutation } = userApi;
```

#### 2️⃣ Сервис для TODO (Task API)

```tsx
// services/todoApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://example.com/api",
  }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "todos",
      providesTags: ["Todo"],
    }),
    addTodo: builder.mutation({
      query: (newTodo) => ({
        url: "todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: ["Todo"], // Инвалидируем кэш TODO после добавления
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todoApi;
```

---

#### 3️⃣ Подключение сервисов к Redux Store

Несколько API-сервисов можно интегрировать, подключив их к одному Redux Store.

```tsx
// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../services/userApi";
import { todoApi } from "../services/todoApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

#### 4️⃣ Использование в компонентах

Теперь хуки, сгенерированные RTK Query, (`useGetTodosQuery`, `useGetUserByIdQuery`), можно использовать в компонентах.

**Компонент для отображения списка TODO:**

```tsx
// components/TodoList.tsx
import React from "react";
import { useGetTodosQuery, useAddTodoMutation } from "../services/todoApi";

const TodoList: React.FC = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();

  const handleAddTodo = async () => {
    await addTodo({ title: "New Task", completed: false }).unwrap();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading todos.</p>;

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
};

export default TodoList;
```

**Компонент для отображения пользователя:**

```tsx
// components/UserProfile.tsx
import React from "react";
import { useGetUserByIdQuery } from "../services/userApi";

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId);

  if (isLoading) return <p>Loading user...</p>;
  if (isError) return <p>Error loading user.</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default UserProfile;
```

---

### ❌ Пример плохой практики

**Прямые `fetch` запросы внутри компонентов:**  
Такой код делает компоненты тяжелыми и усложняет их поддержку:

```tsx
const TodoList = () => {
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const response = await fetch("https://example.com/api/todos");
      const data = await response.json();
      setTodos(data);
      setIsLoading(false);
    };

    fetchTodos();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
```

**Почему это плохо:**
1. Нет разделения ответственности: компонент выполняет логику API и рендеринг.
2. Отсутствует кэширование: данные каждый раз запрашиваются заново.
3. Сложно тестировать, так как нет инкапсуляции в сервисе.

---

### 💡 Рекомендации:

1. **Сервисы по фичам или доменам:** Разделяйте API запросы по функциям приложения, например:
   ```
   - services/
     - userApi.ts
     - todoApi.ts
     - productApi.ts
   ```

2. **Используйте теговую систему RTK Query** для автоматического обновления данных при мутациях.

3. **Централизованный store:** Подключите все сервисы к одному Redux Store.

4. **Не перегружайте логику компонентов API запросами.** Они должны быть максимально "глупыми".

---

### 🎯 Выводы:

- Использование **RTK Query** делает выделение API-сервисов интуитивным и декларативным.
- Логика запросов вынесена в отдельные модули, которые легко переиспользовать в любом компоненте.
- Подход обеспечивает масштабируемость, повышение производительности (кэширование) и тестируемость.