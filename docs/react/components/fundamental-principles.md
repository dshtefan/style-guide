---
sidebar_position: 1
---

# Фундаментальные принципы создания компонентов

Компоненты являются строительными блоками React-приложений. Они должны быть простыми, читаемыми, предсказуемыми и легко тестируемыми. Основная цель хорошего компонента — изолированность, переиспользуемость и четкое выполнение своей задачи.

---

### 🎯 Основные принципы создания компонентов:

1. **Одна задача — один компонент.**
2. **Минимальная логика внутри компонента.**
3. **Чистота и предсказуемость.**
4. **Композиция вместо наследования.**
5. **Распределение ответственности между компонентами (Dumb и Smart).**

---

### 🛠 Как создавать компоненты

#### ✅ Пример хорошей практики

1. Каждый компонент должен представлять **одну небольшую функцию**.
2. Отделяйте бизнес-логику от UI.
3. Для более сложных компонентов разделяйте их на подкомпоненты или используйте композицию.

```tsx
// Button.tsx
import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} className="button">
      {label}
    </button>
  );
};

export default Button;
```

**Чем это хорошо?**  
1. Компонент изолирован, он делает только то, что заявляет (рендерит кнопку с функцией `onClick`).
2. Используется строгая типизация с помощью **TypeScript**.
3. Класс `button` можно кастомизировать через SCSS.

---

#### ❌ Пример плохой практики

```tsx
const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label?.toUpperCase()}</button>;
};
```

**Проблемы:**
1. **Нет типизации.** Ошибки могут всплывать уже в рантайме.
2. Логика (`label?.toUpperCase()`) встроена в рендеринг — трудно масштабировать или тестировать.
3. Нет возможности передавать дополнительные свойства, такие как `disabled`, `className`.

---

### 🧱 Элементы хорошего компонента

**1. Чистый синтаксис JSX:**  
Выносите сложные вычисления и логику в отдельные функции или кастомные хуки. JSX должен быть читабельным.

```tsx
// Header.tsx
import React from "react";

const Header: React.FC = () => {
  const welcomeMessage = getWelcomeMessage();

  return (
    <header>
      <h1>{welcomeMessage}</h1>
    </header>
  );
};

const getWelcomeMessage = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good Morning!" : "Welcome!";
};
```

---

**2. Повторное использование компонентов:**  
Применяйте композицию: соберите сложные UI-компоненты из простых.

```tsx
// Card.tsx
import React from "react";

interface CardProps {
  title: string;
  content: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, content }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{content}</div>
    </div>
  );
};

export default Card;
```

```tsx
// Usage in Home.tsx
import React from "react";
import Card from "../components/Card";

const Home: React.FC = () => {
  return (
    <div>
      <Card title="Card 1" content={<p>This is the content of card 1</p>} />
      <Card title="Card 2" content={<p>This is the content of card 2</p>} />
    </div>
  );
};
```

**Почему это важно?**  
- Логика и отображение разделены.
- Компонент максимально универсален.

---

**3. Минимальная вложенность для JSX:**  
Сложные компоненты с глубокой вложенностью ошибок трудно поддерживать. Делайте основной JSX простым, а вложенные элементы передавайте через `children`:

```tsx
// Layout.tsx
import React from "react";

interface LayoutProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, footer, children }) => {
  return (
    <div className="layout">
      <div className="header">{header}</div>
      <div className="content">{children}</div>
      <div className="footer">{footer}</div>
    </div>
  );
};

export default Layout;
```

**Использование:**

```tsx
// App.tsx
import React from "react";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <Layout 
      header={<h1>Header</h1>} 
      footer={<p>Footer</p>}
    >
      <p>This is the main content area</p>
    </Layout>
  );
};
```

---

**4. Придерживайтесь UI-области:**

- Логику сложных операций убирайте в **кастомные хуки** или **сервисы**.
- Вот пример, где компонент только отображает данные, а бизнес-логика перемещена в хук:

```tsx
// hooks/useUserData.ts
import { useState, useEffect } from "react";

export const useUserData = (userId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((response) => response.json())
      .then((userData) => {
        setData(userData);
        setLoading(false);
      });
  }, [userId]);

  return { data, loading };
};
```

```tsx
// components/UserProfile.tsx
import React from "react";
import { useUserData } from "../hooks/useUserData";

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { data: user, loading } = useUserData(userId);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
```

---

### 💡 Советы:

1. **Делите компоненты на “глупые” (Dumb) и “умные” (Smart):**  
   - Глупые компоненты используют данные, переданные через `props`.
   - Умные компоненты содержат логику состояния.

2. **Используйте строгую типизацию:**  
   Типизация через **TypeScript** помогает избежать многих ошибок уже на этапе разработки.

3. **Организуйте стили с SCSS или CSS-модулями:** 
   Компонентные стили пишите близко к соответствующим компонентам.

```scss
// Button.module.scss
.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
}
```

---

### ❌ Антипаттерны

1. **"Боги-компоненты" (`God Components`):**  
Компоненты, которые пытаются делать всё: рендерить UI, управлять логикой и состоянием.

2. **Плохая читаемость кода:**  
Длинные файлы с запутанной логикой.

3. **Глобальные стили без модулей:**  
Коллизии имен CSS-классов в больших приложениях.

4. **Прямое использование данных из API в компонентах:**  
Модели данных API могут изменяться, и это усложнит поддержку.

---

### 🎯 Выводы

1. Компоненты должны быть:
   - **Маленькими** (с минимальной логикой).
   - **Идеально изолированными**.
   - **Переиспользуемыми.**

2. Строгая типизация и разделение логики обязательно повышают стабильность и читаемость.