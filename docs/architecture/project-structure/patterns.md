---
sidebar_position: 2
---

# Архитектурные паттерны

---

### 1️⃣ **Feature-Sliced Design**

**Feature-Sliced Design (FSD)** — это подход к организации проекта, при котором код структурируется вокруг фич, а не абстрактных технических слоев (например, "components", "utils"). Основная цель — привязать архитектуру к бизнес-логике приложения.

---

#### Структура проекта в FSD:

```
src/
├── app/                   // Конфигурация приложения (инициализация, провайдеры)
│   ├── store/             // Глобальное состояние приложения
│   ├── Router.tsx         // Главный роутинг
│   └── App.tsx            // Точка входа
├── pages/                 // Страницы приложения (с корневым рендерингом)
├── features/              // Фичи (независимые бизнес-единицы)
│   ├── auth/              // Фича "Авторизация"
│   │   ├── components/    // Компоненты, относящиеся к фиче
│   │   ├── model/         // Состояние и бизнес-логика
│   │   ├── hooks/         // Логические хуки фичи
│   │   └── api/           // Запросы к API
│   ├── dashboard/         // Фича "Панель управления"
│       └── ...
├── entities/              // Базовые сущности приложения (например, User, Product)
├── shared/                // Общие библиотеки и компоненты
│   ├── ui/                // Универсальные переиспользуемые UI-элементы
│   ├── hooks/             // Универсальные хуки
│   ├── utils/             // Утилиты и хелперы
│   └── styles/            // Общие стили
```

#### Пример:

```tsx
// features/auth/components/LoginForm.tsx
import React from "react";
import { useAuth } from "../model/useAuth";

export const LoginForm = () => {
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" />
      <button type="submit">Login</button>
    </form>
  );
};
```

**Преимущества FSD**:
- Изоляция фич снижает уровень связности в проекте.
- Удобство масштабирования: легко добавлять новые фичи.
- Близость к бизнес-логике.

**Недостатки**:
- Требует обучения команды в начале.
- Подходит для средних и крупных проектов.

---

### 2️⃣ **Atomic Design**

**Atomic Design** — это подход к построению интерфейса, который фокусируется на уровне абстракции компонентов. Основная цель — декомпозиция сложного интерфейса на мелкие элементы (атоми). Это помогает организовать переиспользуемые UI-компоненты.

---

#### Уровни в Atomic Design:

1. **Atoms (Атомы)**:
   - Самые маленькие элементы (кнопки, инпуты, теги).
2. **Molecules (Молекулы)**:
   - Комбинация атомов (например, форма с инпутом и кнопкой).
3. **Organisms (Организмы)**:
   - Комбинация нескольких молекул (например, хедер с логотипом и навигацией).
4. **Templates (Шаблоны)**:
   - Организация организмов на страницах.
5. **Pages (Страницы)**:
   - Комбинация шаблонов для отображения контента.

---

#### Пример структуры проекта:

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.scss
│   │   └── Input/
│   │       ├── Input.tsx
│   │       └── Input.module.scss
│   ├── molecules/
│   │   ├── SearchForm/
│   │       ├── SearchForm.tsx
│   │       └── SearchForm.module.scss
│   ├── organisms/
│   │   ├── Navbar/
│   │       ├── Navbar.tsx
│   │       └── Navbar.module.scss
```

#### Пример:

```tsx
// atoms/Button.tsx
import React, { FC } from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick} className="button">
    {label}
  </button>
);
```

**Преимущества Atomic Design**:
- Подходит для библиотек компонентов.
- Легко переиспользовать UI-части.
- Повышает осознанность в проектировании интерфейса.

**Недостатки**:
- Уровни абстракции могут быть избыточными.
- Чуть сложнее внедрять в продуктовый код.

---

### 3️⃣ **MVVM**

**Model-View-ViewModel (MVVM)** — популярный паттерн, применяемый для разделения бизнес-логики и представления. 

- **Model**: Управляет состоянием данных и их изменениями.
- **View (Представление)**: Отображает данные пользователю.
- **ViewModel**: Связующее звено между Model и View.

---

#### Пример структуры:

```tsx
// model/CounterModel.ts
export class CounterModel {
  private _count = 0;

  get count() {
    return this._count;
  }

  increment() {
    this._count++;
  }

  reset() {
    this._count = 0;
  }
}
```

```tsx
// viewmodel/CounterViewModel.ts
import { CounterModel } from "./CounterModel";

export class CounterViewModel {
  private counter: CounterModel;

  constructor() {
    this.counter = new CounterModel();
  }

  getCount() {
    return this.counter.count;
  }

  incrementCounter() {
    this.counter.increment();
  }

  resetCounter() {
    this.counter.reset();
  }
}
```

```tsx
// view/CounterView.tsx
import React from "react";
import { CounterViewModel } from "../viewmodel/CounterViewModel";

const viewModel = new CounterViewModel();

export const CounterView = () => {
  return (
    <div>
      <p>Count: {viewModel.getCount()}</p>
      <button onClick={() => viewModel.incrementCounter()}>+</button>
      <button onClick={() => viewModel.resetCounter()}>Reset</button>
    </div>
  );
};
```

**Преимущества MVVM**:
- Четкое разделение логики.
- Локализация изменений.

**Недостатки**:
- Увеличивает сложность для простых приложений.
- Не всегда необходимо в React-приложениях.

---

### 4️⃣ **Features vs Layers**

**Features** и **Layers** представляют два подхода к организации проекта.

#### Features:
- Основывается на функциональных единицах приложения (например, "auth", "profile").
- **Преимущество**: Легче расширять, добавляя новые фичи.

#### Layers:
- Организация по техническим слоям (например, "components", "utils", "hooks").
- **Преимущество**: Хорошо подходит для небольших проектов или библиотек.

---

#### 🧨 Пример сравнения:

#### Features:

```
src/
├── features/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── authSlice.ts
│   │   ├── authApi.ts
```

#### Layers:

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
├── redux/
│   ├── authSlice.ts
├── api/
│   ├── authApi.ts
```

---

### 🎯 Выводы:

- **Feature-Sliced Design** лучше всего подходит для крупных и активно развивающихся проектов.
- **Atomic Design** идеально для библиотек компонентов и сложных интерфейсов.
- **MVVM** полезен для проектов, где требуется жесткое разделение логики.
- Сравнивая **Features vs Layers**, чаще всего выигрывает подход, основанный на фичах, за счёт близости к бизнес-логике.