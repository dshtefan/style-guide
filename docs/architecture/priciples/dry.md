---
sidebar_position: 2
---

# DRY (Don't Repeat Yourself)

👩‍💻 Принцип *DRY* (Don’t Repeat Yourself) означает: избегайте дублирования кода. Каждая часть логики должна находиться в одном месте, и ее изменение не должно требовать модификации нескольких участков приложения. Повторение одинаковых решений или кусков кода снижает читаемость, усложняет поддержку и способствует ошибкам.

Этот принцип *не означает избыточной абстракции*. Важно помнить: борясь с нарушением DRY, существует риск создания сложного и малопонятного интерфейса кода.

---

### 💡 Где чаще всего нарушается DRY?

1. **Дублирование бизнес-логики**:
   - Например, одно и то же вычисление реализуется в нескольких местах.
2. **Повторяющиеся запросы к API**:
   - Один и тот же эндпоинт вызывается из разных компонентов без общего сервиса.
3. **Копирование стилей**:
   - Вы повторяете CSS/SCSS/стили для одинаковых компонентов вручную.
4. **Дублирование типов (TypeScript)**:
   - Одинаковые интерфейсы и типы создаются в разных файлах.
5. **Переиспользуемые компоненты не выделены**:
   - Одинаковый код интерфейса (например, кнопки, карточки) повторно вставляется в разных местах.

---

### ✅ Пример хорошей реализации

```tsx
// Utility-функция для форматирования дат
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
```

```tsx
// Использование утилиты в компоненте
import { formatDate } from "../utils/formatDate";

const EventCard = ({ title, date }: { title: string; date: string }) => (
  <div className="event-card">
    <h2>{title}</h2>
    <p>{formatDate(date)}</p> {/* Повторное использование утилиты */}
  </div>
);
```

👉 **Преимущество**:
- Логика форматирования даты централизована, изменения в одном месте обновятся автоматически во всех компонентах.

---

```tsx
// Сервис для работы с API
export const userApiService = {
  fetchUserProfile: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
  },
};
```

```tsx
// Использование API-сервиса
import { userApiService } from "../services/userApiService";

const UserProfile = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    userApiService
      .fetchUserProfile(userId)
      .then((data) => setProfile(data))
      .catch((error) => console.error(error));
  }, [userId]);

  return (
    <div>
      {profile ? (
        <div>
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
```

👉 **Преимущество**:
- API-логика изолирована, нет дублирования вызовов эндпоинтов в разных компонентах.

---

### ❌ Пример плохой реализации

```tsx
// Дублирование логики форматирования даты
const EventCard = ({ title, date }: { title: string; date: string }) => (
  <div className="event-card">
    <h2>{title}</h2>
    <p>
      {new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  </div>
);

const AnotherComponent = ({ date }: { date: string }) => (
  <div className="another-component">
    <span>
      {new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </span>
  </div>
);
```

**Почему это плохо?**:
- Логика форматирования даты повторяется в нескольких компонентах. Если потребуется изменить формат, это нужно будет сделать в каждом месте.

---

```tsx
// Дублирование API-вызовов
const UserProfile1 = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`) // Дубляж
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [userId]);

  return <p>{profile ? profile.name : "Loading..."}</p>;
};

const UserProfile2 = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`) // Дубляж
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [userId]);

  return <span>{profile ? profile.email : "Loading..."}</span>;
};
```

**Почему это плохо?**:
- Каждая функция отдельно дублирует API-вызов. Если API-endpoint изменится, потребуется менять это в каждом компоненте.

---

### 🛠 Практические советы для соблюдения DRY

1. **Создавайте утилиты для повторяемой логики**:
   - Логика, которая обрабатывает данные (например, форматирование данных, сортировки), должна быть вынесена в отдельные файлы `utils`.

2. **Используйте сервисы для работы с API**:
   - Организуйте API-запросы в сервисах, чтобы централизовать вызовы и логику обработки ответа.

3. **Следите за повторяющимися компонентами**:
   - Если один и тот же UI-код встречается более чем дважды, вынесите его в отдельный компонент.

4. **Используйте миксины и переменные в SCSS**:
   - Чтобы не дублировать значения цветов, шрифтов или отступов, используйте SCSS-переменные и общие миксины.

5. **Не повторяйте типы (TypeScript)**:
   - Централизуйте типизацию в файле `types` или `interfaces`. Например:
     ```ts
     export interface UserProfile {
       id: string;
       name: string;
       email: string;
     }
     ```

---

### 👉 **Выводы**
- *DRY* помогает поддерживать чистоту и читаемость кода.
- Поддержка кода становится проще: изменения в одном месте автоматически применяются ко всему приложению.
- Соблюдайте баланс между соблюдением DRY и избыточной абстракцией, чтобы не усложнять архитектуру. 😎
