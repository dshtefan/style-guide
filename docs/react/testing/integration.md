---
sidebar_position: 2
---

# Integration тесты

**Integration тесты** (интеграционные тесты) проверяют, как несколько частей приложения работают вместе. В отличие от юнит-тестов, которые изолированно анализируют функциональность одной части, интеграционные тесты направлены на проверку взаимодействия различных компонентов, хуков и библиотек.

---

### 🎯 Цели интеграционных тестов

1. **Проверить взаимодействие компонентов**: Убедиться, что дочерние компоненты правильно функционируют в контексте родительских.
2. **Тестировать пользовательские сценарии**: Например, навигацию, заполнение и отправку формы.
3. **Валидировать логику состояния и управления данными**: Убедиться, что состояние обновляется корректно при взаимодействии пользователя.
4. **Проверить взаимодействие с API**: Тестировать работу функций, которые выполняют запросы.

---

### ✅ Что следует тестировать в интеграционных тестах?

1. **Поток или сценарий пользовательского взаимодействия**: Например, при нажатии кнопки состояние компонента обновляется, а данные отправляются на сервер.
2. **Взаимодействие между компонентами**: Убедиться, что компоненты правильно обмениваются данными через пропсы или контекст.
3. **Работу сторонних библиотек**: Например, корректную работу React Router при навигации или Formik для управления формами.

---

### 🚫 Чего не следует тестировать?

1. **Мелкие детали реализации компонентов**: Они уже протестированы юнит-тестами.
2. **Внешние API-эндпоинты**: Вместо этого используйте моки для тестирования взаимодействий.
3. **Большие пользовательские сценарии от начала до конца**: Это задача e2e тестов.

---

### 📦 Инструменты для интеграционного тестирования

- **Jest** — используется как тестовый раннер.
- **React Testing Library** — помогает тестировать компоненты с фокусом на взаимодействие пользователя.
- **MSW (Mock Service Worker)** — для мокирования HTTP-запросов и имитации API.
- **Mocking libraries** (например, `jest.fn()`) — для подмены функций и обработчиков событий.

---

### ✅ Пример интеграционного теста для формы

#### Компонент для тестирования

```tsx
// components/LoginForm.tsx
import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onLogin(email, password);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="password-input"
        />
      </label>
      <button type="submit" data-testid="submit-button">
        Log In
      </button>
      {error && <p data-testid="error-message">{error}</p>}
    </form>
  );
};

export default LoginForm;
```

---

#### Интеграционный тест для LoginForm

```tsx
// components/__tests__/LoginForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";

describe("LoginForm integration tests", () => {
  it("должен вызывать onLogin с правильными данными", async () => {
    const mockOnLogin = jest.fn().mockResolvedValueOnce({});
    render(<LoginForm onLogin={mockOnLogin} />);

    // Эмулируем ввод email
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });

    // Эмулируем ввод пароля
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    });

    // Эмулируем отправку формы
    fireEvent.click(screen.getByTestId("submit-button"));

    // Проверяем, что onLogin был вызван с правильными аргументами
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it("должен отображать сообщение об ошибке при ошибке входа", async () => {
    const mockOnLogin = jest.fn().mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<LoginForm onLogin={mockOnLogin} />);

    // Заполняем поля формы
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "wrongpassword" },
    });

    // Отправляем форму
    fireEvent.click(screen.getByTestId("submit-button"));

    // Проверяем, что сообщение об ошибке отображается
    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent("Invalid credentials");
    });
  });
});
```

---

### ✅ Что здесь хорошо?

1. Тестирование взаимодействия компонентов:
   - Проверяется работа функции `onLogin`.
   - Проверяется изменение отображаемого сообщения об ошибке.

2. Используются реальные сценарии:
   - Ввод текста в поля формы.
   - Нажатие на кнопку.

3. Тест учитывает асинхронную природу некоторых операций.

---

### ❌ Пример плохой практики

```tsx
it("должен тянуть данные напрямую через API", async () => {
  // ❌ Неправильный вариант
  const { container } = render(
    <LoginForm onLogin={(email, password) => fetch(`/api/login`, { email, password })} />
  );

  fireEvent.change(screen.getByTestId("email-input"), {
    target: { value: "test@example.com" },
  });

  fireEvent.change(screen.getByTestId("password-input"), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByTestId("submit-button"));

  // ❌ Мы проверяем реальный эндпоинт, что недопустимо для интеграционного теста
  const response = await screen.findByText(/Success/i);
  expect(response).toBeInTheDocument();
});
```

**Почему это плохо?**
- Тестирование реальных API-эндпоинтов не является целью интеграционных тестов.
- Вместо этого нужно мокировать взаимодействия с API.

---

### 💡 Полезные советы по интеграционным тестам

1. **Используйте моки для зависимостей**: Все внешние запросы (API) и компоненты, не относящиеся к тестируемому сценарию, должны быть замокированы.
2. Сосредоточьтесь на **важных сценариях взаимодействия компонентов**: Не пытайтесь протестировать всё.
3. Пишите **асинхронные тесты корректно**: Если в тестируемом коде есть асинхронные операции, всегда используйте `waitFor` или `findBy...`.
4. Держите тесты **отдельными и изолированными**: Один тест проверяет один сценарий.
5. Стремитесь к **максимальной простоте тестов**, не дублируя проверки, сделанные в других уровнях (юнит или e2e).

---

### 🚀 Резюме

- Интеграционные тесты проверяют взаимодействие компонентов и обработку событий.
- Они замыкаются на пользовательские сценарии, такие как работа с формами, навигация или API-запросы.
- Используйте **React Testing Library** для тестирования пользовательского опыта.
- Мокируйте внешние API в тестах, используя библиотеки, такие как **MSW**.
- Не пытайтесь протестировать всё: интеграционные тесты должны дополнять юнит- и e2e тесты, а не подменять их.
