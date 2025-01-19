---
sidebar_position: 2
---

# SOLID для фронтенда

Принципы **SOLID** являются базовыми для построения устойчивой архитектуры приложений. Хотя они изначально разработаны для объектно-ориентированного программирования, ниже мы рассмотрим их применение в контексте фронтенда на **React** с **TypeScript**.

---

### 🛠 Расшифровка SOLID:

1. **S** — *Single Responsibility Principle* (Принцип единственной ответственности)
2. **O** — *Open/Closed Principle* (Принцип открытости/закрытости)
3. **L** — *Liskov Substitution Principle* (Принцип подстановки Барбары Лисков)
4. **I** — *Interface Segregation Principle* (Принцип разделения интерфейса)
5. **D** — *Dependency Inversion Principle* (Принцип инверсии зависимостей)

---

### 1️⃣ Single Responsibility Principle (Принцип единственной ответственности)

Компонент должен выполнять только одну задачу. Каждый компонент или модуль должен быть ответственен за один "аспект" системы. 

#### ✅ Пример хорошей практики:

```tsx
// Компонент отвечает только за отрисовку кнопки
const SubmitButton = ({ onSubmit }: { onSubmit: () => void }) => {
  return <button onClick={onSubmit}>Submit</button>;
};

// Логика обработки формы изолирована
const useSubmitForm = () => {
  const submitForm = async () => {
    // Логика отправки данных
    console.log("Form submitted");
  };
  return { submitForm };
};

// Контейнер объединяет компоненты и логику
const SubmitContainer = () => {
  const { submitForm } = useSubmitForm();

  return <SubmitButton onSubmit={submitForm} />;
};
```

#### ❌ Пример плохой практики:

```tsx
// Один компонент отвечает и за логику, и за отрисовку
const SubmitForm = () => {
  const handleSubmit = async () => {
    console.log("Form submitted");
  };

  return <button onClick={handleSubmit}>Submit</button>;
};
```

**Почему это плохо?**
- "God-компоненты" трудно тестировать.
- Нарушается принцип разделения ответственности.

---

### 2️⃣ Open/Closed Principle (Принцип открытости/закрытости)

Модули и компоненты должны быть **открыты для расширения** и **закрыты для модификации**. Это означает, что поведение компонента можно изменить без необходимости менять его внутренний код.

#### ✅ Пример хорошей практики:

```tsx
// Базовый компонент
const Alert = ({ message, type }: { message: string; type: "success" | "error" }) => {
  return <div className={`alert alert-${type}`}>{message}</div>;
};

// Расширение через композицию
const ErrorAlert = ({ message }: { message: string }) => {
  return <Alert message={message} type="error" />;
};

const SuccessAlert = ({ message }: { message: string }) => {
  return <Alert message={message} type="success" />;
};
```

#### ❌ Пример плохой практики:

```tsx
// Модификация базового компонента для каждого нового типа
const Alert = ({ type, message }: { type: string; message: string }) => {
  if (type === "success") {
    return <div style={{ color: "green" }}>{message}</div>;
  }
  if (type === "error") {
    return <div style={{ color: "red" }}>{message}</div>;
  }
  return null;
};
```

**Почему это плохо?**
- Проблемы с модификацией: каждое новое состояние требует изменения самой функции.

---

### 3️⃣ Liskov Substitution Principle (Принцип подстановки Барбары Лисков)

Базовый компонент должен быть заменяем на производные компоненты без нарушения функциональности приложения.

#### ✅ Пример хорошей практики:

```tsx
interface User {
  id: string;
  name: string;
}

const UserList = ({ users }: { users: User[] }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// Реализация с разными наборами данных
const AdminsList = () => {
  const admins: User[] = [
    { id: "1", name: "Admin One" },
    { id: "2", name: "Admin Two" },
  ];
  return <UserList users={admins} />;
};
```

#### ❌ Пример плохой практики:

```tsx
// Компонент, который нарушает контракт взаимозаменяемости
const AdminList = ({ admins }: { admins: { id: string; permissions: string[] }[] }) => {
  return (
    <ul>
      {admins.map((admin) => (
        <li key={admin.id}>{admin.permissions.join(", ")}</li>
      ))}
    </ul>
  );
};

// Теперь сделать общую "замену" AdminList вместо UserList становится невозможным.
```

**Почему это плохо?**
- Нарушается механизм заменяемости структур в компонентах.

---

### 4️⃣ Interface Segregation Principle (Принцип разделения интерфейсов)

Клиенты не должны быть вынуждены реализовывать интерфейсы (или типы), которые они не используют. 

#### ✅ Пример хорошей практики:

```tsx
interface Clickable {
  onClick: () => void;
}

interface SubmitButtonProps extends Clickable {
  label: string;
}

const SubmitButton = ({ label, onClick }: SubmitButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

#### ❌ Пример плохой практики:

```tsx
interface FullButtonProps {
  label: string;
  onClick: () => void;
  isDisabled: boolean;
  tooltip?: string;
}

const SimpleButton = ({ label, onClick }: FullButtonProps) => {
  // Лишние свойства будут переданы без использования
  return <button onClick={onClick}>{label}</button>;
};
```

**Почему это плохо?**
- `SimpleButton` вынужден "принимать" ненужные свойства, такие как `isDisabled` и `tooltip`.

---

### 5️⃣ Dependency Inversion Principle (Принцип инверсии зависимостей)

Модули высокого уровня не должны зависеть от модулей низкого уровня. Вместо этого оба должны зависеть от абстракций.

#### ✅ Пример хорошей практики:

```tsx
// Сервис для управления пользователями
interface UserService {
  getUser: (id: string) => Promise<{ id: string; name: string }>;
}

const ApiUserService: UserService = {
  getUser: async (id) => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  },
};

// Компонент зависит от абстракции
const UserProfile = ({ userService, userId }: { userService: UserService; userId: string }) => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    userService.getUser(userId).then(setUser);
  }, [userId]);

  return <div>{user ? user.name : "Loading..."}</div>;
};

// При необходимости можно заменить источник данных
const MockUserService: UserService = {
  getUser: async (id) => ({ id, name: "Mock User" }),
};
```

---

### Выводы

1. **S**: Держите компоненты компактными, фокусируясь на одной цели.
2. **O**: Расширяйте функциональность через композицию, а не модификацию.
3. **L**: Убедитесь, что ваши базовые компоненты могут быть заменены производными.
4. **I**: Создавайте интерфейсы и типы, которые четко соответствуют задачам.
5. **D**: Зависьте от абстракций, чтобы упростить тестирование и замену зависимостей.