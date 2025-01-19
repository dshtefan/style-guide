---
sidebar_position: 1
---

# Разделение ответственности (Separation of Concerns)

Принцип разделения ответственности подразумевает, что каждая часть приложения должна заниматься только "своими делами". Это улучшает читаемость, тестируемость, модульность и возможность масштабирования приложения. Ниже приведены базовые рекомендации, хороший и плохой примеры реализации.

---

### 💎 Основные рекомендации

1. **Разделяйте бизнес-логику и UI**:
   - Компоненты должны быть "чистыми" и сосредоточены на оформлении (UI).
   - Бизнес-логика не должна смешиваться с визуализацией. Для этого используйте хендлеры, хуки, сервисы и состояния.

2. **Избегайте "god-компонентов"**:
   - Не пишите компоненты, которые отвечают за всё сразу: логику, состояние, фетчинг данных, отображение UI.
   - Старайтесь делить их на более мелкие части (например, Custom Hooks, вспомогательные компоненты и хелперы).

3. **Группируйте компоненты по зонам ответственности**:
   - Делите на **UI-компоненты**, **контейнеры**, **хелперы** и **сервисы**.
   - Пример структуры: `components`, `hooks`, `services`.

4. **Создавайте переиспользуемые хуки для сложной логики**:
   - Если компонент обрабатывает фетчинг данных, пагинацию, фильтрацию и т.п., вынесите эту логику в пользовательские хуки, такие как `usePagination` или `useFilter`.

5. **Следуйте Feature-Sliced подходу при масштабировании**:
   - Структура приложения должна позволять легко добавлять новые фичи, избегая дублирования кода.

---

### ✅ Пример хорошей реализации

```tsx
// UI-компонент: отвечает только за отображение
const UserCard = ({ name, email }: { name: string; email: string }) => (
  <div className="user-card">
    <p>{name}</p>
    <p>{email}</p>
  </div>
);
```

```tsx
// Хук: логика получения данных и состояния
import { useState, useEffect } from "react";

const useUserData = () => {
  const [users, setUsers] = useState<Array<{ name: string; email: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsers(data.map(({ name, email }) => ({ name, email }))); // Чистый массив
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  return { users, isLoading };
};
```

```tsx
// Контейнер: соединяет UI и логику
import { UserCard } from "./UserCard";
import { useUserData } from "./useUserData";

const UserListContainer = () => {
  const { users, isLoading } = useUserData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserCard key={user.email} name={user.name} email={user.email} />
      ))}
    </div>
  );
};
```

### ❌ Пример плохой реализации

```tsx
// Компонент перераздувается: отвечает и за логику, и за отображение
const UserList = () => {
  const [users, setUsers] = useState<Array<{ name: string; email: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsers(data.map(({ name, email }) => ({ name, email })));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-list">
      {users.map(({ name, email }) => (
        <div key={email} className="user-card">
          <p>{name}</p>
          <p>{email}</p>
        </div>
      ))}
    </div>
  );
};
```

**Почему это плохо?** 
- В этом компоненте смешаны логика получения данных, управление состоянием и отображение UI.
- Тестировать такую логику будет сложнее, так как нужно учитывать все зависимости (например, состояние).
- Повторно использовать части функционала (обработку данных или UI) будет затруднительно.

---

### 👉 **Ключевые выводы**:
- Разделяйте задачи — компонент (UI) должен заниматься только одним типом работы.
- Используйте пользовательские хуки, чтобы избавляться от громоздкости компонентов.
- Старайтесь проектировать код таким образом, чтобы его можно было переиспользовать и расширять.
