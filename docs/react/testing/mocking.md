---
sidebar_position: 4
---

# Мокирование и Snapshot-тесты

Мокирование и snapshot-тестирование — два подхода, которые играют важную роль в обеспечении качества кода. Моки помогают изолировать тестируемый компонент или логику, заменяя реальные зависимости фиктивными, а snapshot-тесты фиксируют текущее состояние компонента и помогают обнаруживать изменения.

---

### 📦 Почему это важно?

- **Мокирование** позволяет протестировать код в изоляции, симулируя внешнее поведение (например, API-запросы или вызовы сторонних библиотек).
- **Snapshot-тесты** фиксируют текущее состояние интерфейса, что полезно для проверки регрессий в UI.

Эти подходы особенно полезны в контексте React-приложений с большим количеством компонентов и сложной логикой.

---

### 🎯 Что тестировать с помощью моков?

- Взаимодействия с API (HTTP-запросы, `fetch`, `axios`).
- Вызовы внешних библиотек.
- Пользовательские хуки.
- Компоненты, которые зависят от контекста или сторонних провайдеров (например, React Context, Redux, Apollo).

---

### ✅ Пример: Мокирование API с Jest

#### Компонент для тестирования

```tsx
// components/UserProfile.tsx
import React, { useEffect, useState } from "react";

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch {
        setError("Failed to load user data.");
      }
    };

    fetchUser();
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return <p data-testid="user-name">User: {user.name}</p>;
};

export default UserProfile;
```

---

#### Тесты с мокированием API

```tsx
// components/__tests__/UserProfile.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import UserProfile from "../UserProfile";

global.fetch = jest.fn(); // Мокируем fetch

describe("UserProfile component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Очищаем моки перед каждым тестом
  });

  it("должен корректно отображать данные пользователя", async () => {
    // Настраиваем фейковый успешный ответ от API
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ name: "John Doe" }),
    });

    render(<UserProfile userId="1" />);

    // Проверяем, что сначала отображается "Loading..."
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Ждем, пока отобразятся данные пользователя
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("User: John Doe");
    });
  });

  it("должен показывать сообщение об ошибке при сбое загрузки", async () => {
    // Настраиваем ошибочный ответ
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load user data.")).toBeInTheDocument();
    });
  });
});
```

---

### ✅ Пример: Snapshot-тесты с Jest

Snapshot-тесты фиксируют рендер HTML-древа компонента, чтобы отслеживать изменения. Это удобно для UI-компонентов с предсказуемой разметкой.

#### Компонент для тестирования

```tsx
// components/Greeting.tsx
import React from "react";

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

export default Greeting;
```

---

#### Snapshot-тест

```tsx
// components/__tests__/Greeting.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import Greeting from "../Greeting";

describe("Greeting component", () => {
  it("должен соответствовать сохраненному snapshot", () => {
    const { container } = render(<Greeting name="John" />);
    expect(container).toMatchSnapshot();
  });
});
```

---

### ❗️ Snapshot-тесты: Лучшие практики

1. **Автоматическая валидация изменений**: Если snapshot-тест падает, это может означать, что произошли намеренные или случайные изменения в разметке. Перед обновлением snapshot убедитесь, что изменения ожидаемы.
2. **Локальные элементы разметки**: Если компонент рендерит динамические данные (например, сгенерированные id), используйте мокированные значения или удаляйте их из snapshot для стабильности тестов.
3. **Не используйте для сложных случаев:** Snapshot неэффективен для проверки интерактивного поведения.

---

### ✅ Пример: Комбинирование моков и snapshot-тестов

#### Компонент Header

```tsx
// components/Header.tsx
import React from "react";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header>
      {isAuthenticated ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
};

export default Header;
```

#### Тесты

```tsx
// components/__tests__/Header.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Header from "../Header";

describe("Header component", () => {
  it("должен соответствовать snapshot", () => {
    const { container } = render(
      <Header isAuthenticated={false} onLogout={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it("должен вызывать onLogout при клике на кнопку", () => {
    const mockLogout = jest.fn();
    const { getByText } = render(<Header isAuthenticated={true} onLogout={mockLogout} />);

    fireEvent.click(getByText("Logout"));

    expect(mockLogout).toHaveBeenCalledTimes(1); // Убедиться, что onLogout вызван
  });
});
```

---

### 🔧 Частые ошибки и проблемы

1. **Проблемы с асинхронным кодом:**  
   Забудете добавить `await` в мок — тесты начнут падать на `act`. Убедитесь, что асинхронные точки покрыты через `waitFor`.

2. **Проблемы с нестабильными snapshot:**  
   Если snapshot регулярно ломается из-за небольших изменений, рассмотрите возможность применения мокированных данных.

3. **Перемокирование:**  
   Не переусердствуйте — моки должны упрощать тестирование, но не прятать настоящие баги.

---

### 💡 Полезные советы

1. Мокируйте **только зависимые элементы**, которые не входят в тестируемую часть.
2. Стремитесь к минимальной зависимости от snapshot, если компонент сложный. Для динамической проверки UI используйте **React Testing Library**.
3. Следите за **качеством мокированных данных**: они должны быть реалистичными и отражать реальные сценарии работы приложения.
4. Если тест для snapshot падает, убедитесь, что это либо регрессия, либо ожидаемое изменение. Проверяйте обновления перед подтверждением.

---

### 🚀 Резюме

- **Мокирование** помогает изолировать компонент от внешних зависимостей.
- **Snapshot-тесты** фиксируют текущую разметку компонента для упрощённой проверки регрессий.
- Используйте моки для API, контекста или сторонних библиотек.
- Snapshot-тесты применяйте для UI компонентов с предсказуемой разметкой.
- Следуйте принципу: "Тестировать в первую очередь поведение, а не реализацию."