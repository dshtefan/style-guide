---
sidebar_position: 3
---

# Композиция компонентов

**Композиция компонентов** в React — это процесс объединения простых и независимых компонентов для создания более сложных интерфейсов. Это важный принцип, который позволяет избежать дублирования кода, сделать приложение более модульным и улучшить читаемость.

Вместо сосредоточенности на наследовании, React делает акцент на принципе "сборки" или композиции.

---

### 🎯 Принципы композиции компонентов

1. **Делите и властвуйте**:  
   - Разделяйте сложные компоненты на более мелкие, чтобы добиться простоты и изоляции.
2. **Используйте `props.children` для вложенных компонентов**.
3. **Объединяйте функциональность через HOC (Higher-Order Components), Render Props или Composition API (React Context).**
4. **Выбирайте композицию вместо условий**:  
   - Например, вместо встроенных условий рендера (if-else) используйте композицию.

---

### ✅ Пример хорошей практики композиции

#### Простое использование `props.children`

**Контейнер для отображения контента:**

```tsx
// Modal.tsx
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
```

**Композиция через `props.children`:**

```tsx
import React, { useState } from "react";
import Modal from "./Modal";

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>This is the modal content!</p>
        <button onClick={() => setModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default App;
```

**Почему это хорошо?**
- `Modal` сам по себе не знает, что внутри (он просто контейнер).
- Содержимое модального окна легко изменять, не трогая компонент `Modal`.

---

#### Паттерн "Рендер-пропсы" (Render Props)

Суть подхода в том, чтобы передавать функцию в качестве `prop`, которая будет определять рендеринг.

```tsx
// Toggle.tsx
import React, { useState } from "react";

interface ToggleProps {
  render: (isOn: boolean, toggle: () => void) => React.ReactNode;
}

const Toggle: React.FC<ToggleProps> = ({ render }) => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => setIsOn((prev) => !prev);

  return <>{render(isOn, toggle)}</>;
};

export default Toggle;
```

**Использование `Toggle`:**

```tsx
import React from "react";
import Toggle from "./Toggle";

const App: React.FC = () => {
  return (
    <Toggle
      render={(isOn, toggle) => (
        <div>
          <button onClick={toggle}>{isOn ? "On" : "Off"}</button>
          <p>Status: {isOn ? "Enabled" : "Disabled"}</p>
        </div>
      )}
    />
  );
};

export default App;
```

**Почему это хорошо?**
- Можно переиспользовать компонент `Toggle` в любой ситуации, где необходимо управление состоянием включен/выключен.
- Устранение дублирования логики управления состоянием `isOn`.

---

#### Контекст (React Context API)

**Контекст позволяет передавать данные по дереву компонентов без необходимости пробрасывать `props` на каждом уровне.**

```tsx
// ThemeContext.tsx
import React, { createContext, useContext } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode; value: Theme }> = ({
  children,
  value,
}) => {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
```

**Использование контекста:**

```tsx
// App.tsx
import React from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";

const ThemedComponent: React.FC = () => {
  const theme = useTheme();

  return (
    <div style={{ background: theme === "light" ? "#fff" : "#333", color: theme === "light" ? "#000" : "#fff" }}>
      Current theme: {theme}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider value="dark">
      <ThemedComponent />
    </ThemeProvider>
  );
};

export default App;
```

**Почему это хорошо?**
- Контекст делает логику гибкой и чистой.
- Тематизацию компонентов можно расширять без изменения их внутреннего кода.

---

### ❌ Пример плохой практики

#### Смешивание логики и состояния

```tsx
import React, { useState } from "react";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => setIsOn((prev) => !prev);

  return (
    <div>
      <button onClick={handleClick}>{isOn ? "On" : "Off"}</button>
      <p>Status: {isOn ? "Enabled" : "Disabled"}</p>
    </div>
  );
};
```

**Почему это плохо?**
- Невозможно переиспользовать логику включения/выключения: она жестко привязана к компоненту.
- Усложнение тестирования: необходимо тестировать как состояние, так и визуальную часть.

---

### 🔍 Когда использовать композицию?

1. Когда нужно построить сложный UI из маленьких компонентов.  
   - Например, модальные окна, списки, карточки.

2. Когда хотите передать части UI через `props.children`.  
   - Это особенно полезно в компонентах, таких как контейнеры или обертки.

3. Когда есть повторяющаяся бизнес-логика.  
   - Хуки, такие как `useState` или методы API, лучше вынести в общие решения.

---

### Докладные преимущества композиции

1. **Переиспользуемость:**  
   - Компоненты можно использовать повторно, изменяя только их вложенные данные.

2. **Тестируемость:**  
   - Каждый компонент можно тестировать изолированно.

3. **Читаемость:**  
   - Код становится проще, компоненты описывают свою четкую задачу.

4. **Масштабируемость:**  
   - Легче добавлять новые UI, чем работать с монолитными компонентами.

---

### 🤓 Частые ошибки

1. Использование **if-else** внутри компонентов вместо передачи логики через `props` или контекст.
2. Излишняя вложенность при работе с композиционными компонентами.
3. Создание "богов-компонентов" (God Components), которые стремятся решать все задачи.

---

### 🚀 Выводы

- Композиция компонентов — это основополагающий подход React.
- Используйте композицию для создания гибкого, масштабируемого и удобного в поддержке приложения.
- Следуйте принципу: **"Компонент выполняет одну задачу хорошо".**