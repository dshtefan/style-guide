---
sidebar_position: 1
---

# Кастомные хуки

**Кастомные хуки** — это хуки, создаваемые разработчиками для инкапсуляции логики, которая должна быть переиспользуема. Кастомные хуки позволяют структурировать код, устранять дублирование и поддерживать чистоту компонентов. Они часто используются для управления состоянием, подписок, работы с API или другой функциональности, которая требует логической изоляции.

---

### 🧠 Когда использовать кастомные хуки?

1. Когда один и тот же код используется в нескольких компонентах.
2. Когда вы хотите вынести сложную бизнес-логику из компонентов.
3. Когда требуется более читаемая структура кода, исключающая повторения или усложнения компонента.

---

### 📚 Название и структура

#### Правила именования кастомных хуков:
1. Название хука должно начинаться с префикса **`use`**. Это обязательное требование React.
   - Например: `useFetch`, `useForm`, `useToggle`.
2. Название должно отражать суть хука. Оно должно быть чётким и информативным.

#### Структура кастомного хука:
1. **Инкапсуляция логики.** Хук должен содержать только ту часть логики, которую необходимо переиспользовать.
2. **Возврат данных и функций.** Хук должен возвращать минимальное количество данных, необходимых компоненту.
3. **Чистота и согласованность.** Логика в хуке должна быть лёгкой для отладки, документации и тестирования.

Пример стандартной структуры:
```tsx
const useCustomHook = () => {
  // Инициализация состояния
  // Методы для обновления состояния
  // Логика/эффекты

  return {
    // Объект или массив доступных методов/данных
  };
};
```

---

### 📂 Где хранить кастомные хуки?

Кастомные хуки рекомендуется размещать в папке `hooks`, например:

```
src/
├── components/
├── hooks/
│   ├── useFetch.ts
│   ├── useToggle.ts
├── pages/
```

Такое разделение улучшает структуру проекта, а также облегчает поиск и использование хуков.

---

### ✅ Пример хорошего кода: Кастомный хук `useToggle`

**Хук для управления состоянием "включено/выключено".**

```tsx
// hooks/useToggle.ts
import { useState } from "react";

const useToggle = (initialState: boolean = false) => {
  const [state, setState] = useState(initialState);

  const toggle = () => setState((prev) => !prev);

  return { state, toggle };
};

export default useToggle;
```

**Использование кастомного хука:**

```tsx
// components/ToggleButton.tsx
import React from "react";
import useToggle from "../hooks/useToggle";

const ToggleButton: React.FC = () => {
  const { state: isToggled, toggle } = useToggle();

  return (
    <button onClick={toggle}>
      {isToggled ? "🌕 On" : "🌑 Off"}
    </button>
  );
};

export default ToggleButton;
```

**Почему это хорошо?**
- Хук инкапсулирует логику включения/выключения, что позволяет переиспользовать её в других компонентах.
- Рендер-логика остаётся в компоненте `ToggleButton`, что делает его простым и читаемым.

---

### ✅ Пример хорошего кода: Кастомный хук `useFetch`

**Хук для работы с API.**

```tsx
// hooks/useFetch.ts
import { useEffect, useState } from "react";

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

const useFetch = <T>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading };
};

export default useFetch;
```

**Использование кастомного хука:**

```tsx
// components/UserList.tsx
import React from "react";
import useFetch from "../hooks/useFetch";

interface User {
  id: number;
  name: string;
}

const UserList: React.FC = () => {
  const { data: users, error, isLoading } = useFetch<User[]>("/api/users");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UserList;
```

**Почему это хорошо?**
- `useFetch` изолирует логику работы с API.
- Хук переиспользуем, его можно применить для любого API-запроса.

---

### ❌ Пример плохого кода

**Копирование идентичной логики в разных компонентах.**

```tsx
const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

**Почему это плохо?**
- Логика работы с API дублируется каждый раз.
- Код сложно поддерживать и рефакторить.
- При изменении логики (например, добавлении отмены запроса) потребуется исправлять все компоненты.

---

### 🛠 Рекомендации по созданию кастомных хуков

1. **Делайте хуки изолированными.**  
   - Хук должен отвечать только за одну задачу.

2. **Возвращайте понятную структуру данных.**  
   - Используйте объект или массив, чтобы другие разработчики знали, что ожидать от хука.

3. **Документируйте интерфейс.**  
   - Пользователи вашего хука должны понимать, как он работает.

4. **Инкапсулируйте только бизнес-логику.**  
   - Логика, специфичная для компонентов UI, должна оставаться в компонентах.

---

### 🚀 Выводы

- Кастомные хуки упрощают управление сложными задачами и обеспечивают переиспользуемость логики.
- Они помогают избежать дублирования кода, делая компоненты более простыми и понятными.
- Создание кастомных хуков требует баланса между функциональностью и изоляцией логики.