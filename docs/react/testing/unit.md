---
sidebar_position: 1
---

# Unit тесты компонентов

**Unit тесты** (модульные тесты) — это тесты, которые проверяют отдельные компоненты или функции в изоляции от остальной системы. В контексте React юнит-тесты обычно направлены на проверку логики компонентов, их рендеринга и поведения в зависимости от переданных пропсов, состояния и событий.

---

### 🎯 Цели юнит-тестов

1. Проверить, что компонент отображает корректный интерфейс в зависимости от `props` и `state`.
2. Убедиться, что важная логика компонента работает корректно.
3. Тестировать поведение элементов пользовательского интерфейса: клики, изменения формы, события и т.д.
4. Избежать регрессий, проверяя, что внесённые изменения в код не ломают существующую функциональность.

---

### ✅ Что следует тестировать в компонентах?

1. **Рендеринг**:  
   Проверка, что компонент правильно отображается при различных `props`.  
   Например, отображение заголовка или списка.

2. **Взаимодействия**:  
   Проверка событий, таких как клики, ввод текста или другие действия пользователя.

3. **Состояние (state)**:  
   Убедиться, что изменения состояния управляются корректно.

4. **Логика**:  
   Проверка внутренних методов или функций компонента (например, сортировки данных).

5. **Граничные случаи**:  
   Поведение компонента, если переданы некорректные данные или пропсы отсутствуют.

---

### 🚫 Чего не следует тестировать?

1. **Реализацию внутренних библиотек**:  
   Нет смысла тестировать функциональность React или библиотек (например, `useState`).

2. **Стили**:  
   Стилизацию лучше проверять визуально или через другие виды тестов (например, snapshot-тесты).

3. **Повторное тестирование функционала, уже закрытого e2e тестами**:  
   Оставьте функциональные тесты для e2e.

---

### 📦 Стек технологий для Unit тестов в React

Для тестирования React-компонентов обычно используется следующая комбинация инструментов:

1. **Jest** — тестовый фреймворк.
2. **React Testing Library** — библиотека для тестирования, акцентирующаяся на поведении пользователя.  
   Основной принцип: тестировать компоненты так, как их "видит" пользователь.

---

### ✅ Пример: Пишем Unit тесты с React Testing Library

#### Компонент для тестирования

```tsx
// components/Button.tsx
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} data-testid="button">
      {label}
    </button>
  );
};

export default Button;
```

---

#### Пример тестов для компонента Button

```tsx
// components/__tests__/Button.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../Button";

describe("Button component", () => {
  it("должен корректно отображать текст", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    const buttonElement = screen.getByText("Click Me");

    expect(buttonElement).toBeInTheDocument(); // Проверяем, что кнопка отображается
  });

  it("должен вызывать функцию onClick при клике", () => {
    const handleClick = jest.fn(); // Мокаем функцию
    render(<Button label="Click Me" onClick={handleClick} />);

    const buttonElement = screen.getByTestId("button");
    fireEvent.click(buttonElement); // Эмулируем клик

    expect(handleClick).toHaveBeenCalledTimes(1); // Проверяем, что onClick был вызван
  });

  it("должен быть отключён, если передан проп disabled", () => {
    render(<Button label="Disabled" onClick={() => {}} disabled />);

    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toBeDisabled(); // Проверяем, что кнопка отключена
  });
});
```

---

### ❌ Пример плохой практики

```tsx
it("должен тестировать конкретный HTML", () => {
  const { container } = render(<Button label="Click Me" onClick={() => {}} />);
  expect(container.firstChild).toHaveClass("btn-primary"); // ❌ Специфичный тест на класс
});
```

**Почему это плохо?**
- Такой тест связан с конкретной реализацией (CSS-класс) и будет ломаться при любом изменении стилей.
- Такие вещи лучше проверять через e2e тесты (если важна интеграция), но не через Unit тесты.

---

### 💡 Полезные советы

1. Используйте **data-testid** только если не получается добраться до элемента семантическим способом (`text`, `role`, `alt`, и др.).
2. Тестируйте то, что важно пользователям, например текст, события, отображаемые элементы.
3. Всегда пишите минимальные тест-кейсы. Не более:
   - Что компонент рендерится корректно.
   - Что он корректно обрабатывает пользовательский ввод.
4. Старайтесь писать независимые тесты. Один тест должен проверять одну часть функционала.
5. Для тестирования контекста используйте `wrapper` (например, для `React.Context` или провайдеров).

---

### 🧩 Пример: Тестирование компонента с состоянием

#### Компонент Counter

```tsx
import React, { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p data-testid="counter-value">Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;
```

#### Тесты для Counter

```tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "../Counter";

describe("Counter component", () => {
  it("должен корректно отображать начальное значение счётчика", () => {
    render(<Counter />);
    const counterValue = screen.getByTestId("counter-value");

    expect(counterValue).toHaveTextContent("Count: 0");
  });

  it("должен увеличивать счётчик при нажатии на Increment", () => {
    render(<Counter />);
    const incrementButton = screen.getByText("Increment");
    fireEvent.click(incrementButton);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue).toHaveTextContent("Count: 1");
  });

  it("должен уменьшать счётчик при нажатии на Decrement", () => {
    render(<Counter />);
    const decrementButton = screen.getByText("Decrement");
    fireEvent.click(decrementButton);

    const counterValue = screen.getByTestId("counter-value");
    expect(counterValue).toHaveTextContent("Count: -1");
  });
});
```

---

### 🚀 Резюме

- Юнит-тесты проверяют отдельные компоненты и их функциональность.
- Самые важные вещи для тестирования: рендеринг, события, состояние и граничные случаи.
- Используйте **Jest** и **React Testing Library** для написания понятных и удобных тестов.
- Следуйте принципу: **тестируйте поведение, а не реализацию.**
- Профилируйте свои тесты: пишите их только для значимых и важных случаев.