---
sidebar_position: 1
---

# Подходы к организации API-вызовов

Организация API-вызовов — это ключевая часть построения масштабируемого, читаемого и поддерживаемого приложения. Хорошо организованные вызовы API:
- Упрощают интеграцию с сервером.
- Предотвращают дублирование кода.
- Повышают тестируемость приложения.

---

### 🌟 Основные принципы работы с API

1. **Разделение ответственности**: Все вызовы API должны быть централизованы в одном месте (например, в сервисе или модуле).
2. **Кэширование данных**: Используйте встроенные механизмы RTK Query, чтобы минимизировать дублирующие запросы.
3. **Единообразная обработка ошибок**: Убедитесь, что ошибки серверных запросов обрабатываются в одном месте, и пользователь получает понятную обратную связь.
4. **Поддержка масштабируемости**: Организация в виде модулей (например, объект `api` для каждой группы эндпоинтов) упрощает работу над приложением.
5. **Использование типов**: Типизация делает код надежнее, особенно когда API меняется.

---

### ✅ Пример хорошей практики (с использованием RTK Query)

#### 1️⃣ Настройка API-сервиса

Создание API-сервиса (`createApi`) — это первый шаг в организации вызовов. Все эндпоинты определяются в одном месте.

```tsx
// services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Создаем API-сервис
export const api = createApi({
  reducerPath: "api", // Уникальный ключ для хранения данных в Redux
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Todos", "Users"], // Теги для управления кэшем
  endpoints: (builder) => ({
    // Запрос списка TODO
    getTodos: builder.query({
      query: () => "todos",
      providesTags: ["Todos"], // Сопоставляем с тегом
    }),
    // Мутация: создание нового TODO
    addTodo: builder.mutation({
      query: (newTodo) => ({
        url: "todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: ["Todos"], // Инвалидируем кэш списка TODO
    }),
    // Запрос данных о пользователе
    getUserById: builder.query({
      query: (id: string) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation, useGetUserByIdQuery } = api;
```

---

#### 2️⃣ Подключение API к Redux Store

Сервис, созданный через `createApi`, нужно подключить в вашем Redux Store.

```tsx
// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // Подключение редюсера RTK Query
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // Подключение middleware RTK Query
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

#### 3️⃣ Использование в компонентах

После создания и настройки эндпоинтов, хуки (например, `useGetTodosQuery`) можно использовать напрямую в компонентах.

```tsx
// components/TodoList.tsx
import React from "react";
import { useGetTodosQuery, useAddTodoMutation } from "../services/api";

const TodoList: React.FC = () => {
  const { data: todos, isLoading, isError } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();

  const handleAddTodo = async () => {
    await addTodo({ title: "New Task", completed: false })
      .unwrap()
      .catch((error) => console.error("Add todo failed:", error));
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

**Что демонстрирует этот пример:**
- Эффективное использование `useGetTodosQuery` для получения данных.
- Мутации через `useAddTodoMutation` с автоинвалидацией кэша.
- Обработка состояний загрузки/ошибок в компоненте.

---

### ❌ Пример плохой практики (без RTK Query)

Обратим внимание на распространенные ошибки при вызове API вручную:

```tsx
const TodoList = () => {
  const [todos, setTodos] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      const newTodo = { title: "New Task", completed: false };
      await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
    } catch (err) {
      setError(err);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading todos</p>;

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
};
```

**Проблемы:**

1. **Повышенная сложность кода**:
   - Необходимо вручную обрабатывать состояния загрузки, ошибок.
   - Повторяющийся код для запросов `fetch`.

2. **Нет кэширования**:
   - Каждый раз данные загружаются с сервера, без повторного использования уже полученной информации.

3. **Дублирование логики**:
   - Код обработки API разбросан по компонентам, что приводит к дублированию.

---

### 💡 Советы для организации API

1. **Структурируйте коды по фичам**:
   - Для каждого модуля приложения создавайте отдельный файл `api`. Например:
     ```
     services/
     ├── todosApi.ts
     ├── usersApi.ts
     ```

2. **Не пишите API вручную**:
   - Используйте RTK Query для автоматизации таких процессов, как кэширование, повторные запросы и обработка ошибок.

3. **Переходите на хуки**:
   - Инкапсулируйте всю работу с API в хуках для чистоты компонентов.

4. **Тестируйте отдельно**:
   - RTK Query позволяет тестировать логику запросов изолированно (без фокусировки на компонентах).
