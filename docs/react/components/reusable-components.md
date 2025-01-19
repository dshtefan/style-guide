---
sidebar_position: 4
---

# Переиспользуемые компоненты

**Переиспользуемые компоненты** — основа создания интерфейсов, которые легко масштабировать и поддерживать. Они выполняют определенные задачи и предполагают использование в различных частях приложения с минимальными изменениями.

---

### 🎯 Принципы переиспользуемых компонентов

1. **Универсальность**:  
   Компонент не должен знать контекст использования. Он только рендерит данные, переданные через `props`.

2. **Минимальная логика**:  
   Логика переиспользуемого компонента должна быть минимальной и универсальной. Конкретная бизнес-логика должна выноситься в более высокоуровневые компоненты или кастомные хуки.

3. **Конфигурация через `props`**:  
   Старайтесь передавать настройки компонента через `props`. Позволяйте разработчикам настраивать поведение компонента, не изменяя его код.

4. **Переиспользование внутри одного проекта**:  
   Даже если кажется, что компонент полезен только в одном месте, задумайтесь, можно ли применить его в других частях приложения в будущем.

5. **Компоновка**:  
   Концентрируйте логику вокруг отображаемого поведения и позволяйте конфигурацию с помощью `children` или кастомного рендера.

---

### ✅ Пример хорошей практики

#### Универсальный Button-компонент

**Создание компонента:**

```tsx
// components/Button.tsx
import React from "react";
import classNames from "classnames"; // Использование библиотеки для работы с классами
import "./Button.scss";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
}) => {
  const buttonClass = classNames("btn", `btn-${variant}`, `btn-${size}`, {
    "btn-disabled": disabled,
  });

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
```

**Добавление стилей:**

```css
/* Button.scss */
.btn {
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-disabled {
  opacity: 0.65;
  pointer-events: none;
}
```

**Использование:**

```tsx
// pages/Home.tsx
import React from "react";
import Button from "../components/Button";

const Home: React.FC = () => {
  return (
    <div>
      <Button
        label="Primary Button"
        variant="primary"
        size="medium"
        onClick={() => console.log("Primary clicked")}
      />
      <Button
        label="Danger Button"
        variant="danger"
        size="large"
        onClick={() => console.log("Danger clicked")}
      />
    </div>
  );
};

export default Home;
```

---

### ❌ Пример плохой практики

```tsx
const Button = ({ label, onClick, type }) => {
  return (
    <button
      style={{
        background: type === "danger" ? "red" : "blue",
        color: "white",
        padding: "10px 20px",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
```

**Почему это плохо?**
- Стили захардкожены — невозможно переопределить внешний вид через CSS.
- Нет строгой типизации `type`: можно передать что-то, что компонент не поддерживает.
- Нет конфигурации через модификаторы, такие как `size` или `variant`.

---

### 🧩 Продвинутые подходы к переиспользованию

#### Использование `children` для гибкости

Рассмотрим пример "Карточки", где вам может потребоваться полностью кастомизировать содержимое.

**Карточка-компонент:**

```tsx
// components/Card.tsx
import React from "react";
import "./Card.scss";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
```

**Добавление стилей:**

```scss
// Card.scss
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
}

.card-content {
  font-size: 14px;
  color: #666;
}
```

**Использование с разным контентом:**

```tsx
import React from "react";
import Card from "../components/Card";

const App: React.FC = () => {
  return (
    <div>
      <Card title="Card 1">
        <p>This is the content of Card 1</p>
      </Card>

      <Card title="Card 2">
        <button onClick={() => console.log("Clicked!")}>Click Me</button>
      </Card>
    </div>
  );
};

export default App;
```

**Почему это хорошо?**
- Легко адаптировать содержимое компонента `Card` без изменения его внутренней логики.
- Гибкое применение любых вложенных элементов.

---

### 🔄 Расширяемость через композицию или наследование

#### Higher-Order Component (HOC)

Если вам нужно оборачивать поведение, например, для логгирования, состояние:

```tsx
// withLogger.tsx
import React from "react";

const withLogger = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  return (props) => {
    console.log("Props:", props);
    return <WrappedComponent {...props} />;
  };
};

export default withLogger;
```

**Использование:**

```tsx
import withLogger from "../hoc/withLogger";
import Button from "../components/Button";

const LoggedButton = withLogger(Button);

const App: React.FC = () => {
  return <LoggedButton label="Click me!" onClick={() => console.log("Clicked!")} />;
};
```

---

### 💡 Советы по созданию переиспользуемых компонентов

1. **Разделение ответственности:**  
   Переиспользуемый компонент должен отвечать только за одно: рендеринг, обработку событий или изоляцию логики.

2. **Не переусложняйте компонент:**  
   Добавляйте только необходимые свойства, и не пытайтесь предусмотреть все возможные варианты.

3. **Используйте универсальные имена и интерфейсы:**  
   Например, вместо "UserCard" используйте `Card`, чтобы оставить компонент более общим.

4. **Поддержка кастомизации:**  
   - Через `children`.
   - Через `props` (например, стилизация с внешними классами).

5. **Соблюдайте модульность:**  
   Стили (SCSS), тесты и компонент должны быть в одной папке для лучшей читабельности.

---

### 🚀 Выводы

- Переиспользуемые компоненты позволяют избежать дублирования кода и упрощают поддержку проекта.
- Основной принцип: **решайте одну задачу, но делайте это хорошо.**
- Гибкость достигается через `props`, `children` и продуманный интерфейс компонента.