---
sidebar_position: 3
---

# Организация файлов с типами

Организация и структура файлов с типами имеет большое значение для поддерживаемости и читаемости кода в масштабируемых TypeScript-проектах. Плохая структура может привести к запутанности командной работы, повышению когнитивной нагрузки разработчиков и сложности в рефакторинге. 

Ниже описаны лучшие практики по организации файлов с типами, а также антипаттерны, которых следует избегать.

---

### ❓ Зачем выделять типы в отдельные файлы?

- **Повышение читаемости:** Типы становятся изолированными от реализации, поэтому их проще найти и использовать.  
- **Повторное использование:** Хорошо организованные типы можно использовать в нескольких модулях.  
- **Удобство рефакторинга:** Централизованное хранилище типов помогает быстрее обновлять типы.  
- **Снижение "шумного кода":** Отделение типов уменьшает визуальный "шум" в файлах реализации.  

---

### 📂 Рекомендуемая структура для файлов с типами

Структура файлов с типами зависит от размера и сложности проекта. Вот несколько общих рекомендаций:

#### Простой проект

Для небольших или средних проектов можно складывать все типы в одну директорию, например: `types/`.

```
src/
├── components/
├── services/
├── types/
│   ├── common.d.ts
│   ├── api.d.ts
│   └── index.d.ts
```

#### Сложный проект

Для крупных проектов лучше организовать типы внутри разделов или модулей, чтобы поддерживать модульность и контекстуальную целостность.

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.scss
│   │   └── types.d.ts
│   └── ...
├── services/
│   ├── auth/
│   │   ├── auth.api.ts
│   │   └── types.d.ts
│   ├── notifications/
│   │   ├── notifications.api.ts
│   │   └── types.d.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── types.d.ts
├── types/
│   ├── common.d.ts
│   ├── api.d.ts
│   └── constants.d.ts
```

> **Совет:** Старайтесь хранить типы, которые используются только в одном модуле (или файле), рядом с ним. Общие типы следует размещать в централизованной директории `types/`.

---

### 🖋️ Общие рекомендации по реализации

#### 1. Используйте расширение `.d.ts` для файлов, содержащих только типы

Файлы, которые содержат исключительно типы, должны быть именованы с расширением `.d.ts`. Это помогает другим разработчикам сразу понять назначение файла.

```typescript
// src/types/api.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

---

#### 2. Экспортируйте типы для повторного использования

Если типы используются в нескольких модулях, обязательно экспортируйте их из централизованных файлов.

```typescript
// src/types/common.d.ts
export type ID = string;

export interface Pagination {
  page: number;
  perPage: number;
  totalCount: number;
}

// src/types/index.d.ts
export * from "./common";
export * from "./api";
export * from "./constants";
```

Теперь в любом файле проекта вы можете импортировать необходимые типы из одного источника:

```typescript
import { ID, ApiResponse, Pagination } from "../types";
```

---

#### 3. Используйте неймспейсы для группировки типов (опционально)

Когда типы имеют схожую природу или относятся к одной сущности, можно использовать неймспейсы:

```typescript
// src/types/api.d.ts
export namespace API {
  export interface User {
    id: string;
    name: string;
    email: string;
  }

  export interface Post {
    id: string;
    title: string;
    content: string;
  }
}
```

Импорт и использование:

```typescript
import { API } from "../types";

const user: API.User = { id: "123", name: "Alice", email: "alice@example.com" };
```

> **Когда использовать неймспейсы:** Если типы имеют явную связь и часто группируются вместе. Например, раздел `API` выше.

---

#### 4. Размещайте типы рядом с реализацией — но только в их контексте

Если типы используются узко в одном компоненте или модуле, храните их локально рядом с этим файлом:

```typescript
// src/components/Button/types.d.ts
export interface ButtonProps {
  label: string;
  onClick: () => void;
}

// src/components/Button/Button.tsx
import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

> Это помогает избежать засорения глобального пространства типами, которые не используются широко.

---

### 🚫 Пример плохой практики: Плохая структура типов

```typescript
// src/components/Button/Button.tsx
const Button: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

> **Почему это плохо:**
> - Типы инлайнятся прямо в интерфейсе компонента, затрудняя повторное использование.
> - Такое решение плохо масштабируется, особенно при усложнении логики компонента.

---

#### 5. Используйте соглашения об именовании

Именуйте файлы с типами так, чтобы их назначение было понятно:

- `types.d.ts` — если типы локальны для модуля (например, `Button/types.d.ts`).
- `common.d.ts` — для общих типов (например, `ID`, `Pagination`).
- `api.d.ts` — для типов, связанных с API.
- `constants.d.ts` — для перечислений и постоянных значений.

---

### ✅ Пример организации типизированного API

#### Структура файлов:

```
src/
├── services/
│   ├── auth/
│   │   ├── auth.api.ts
│   │   ├── types.d.ts
│   │   └── index.ts
│   ├── notifications/
│   │   ├── notifications.api.ts
│   │   ├── types.d.ts
```

#### Реализация:

```typescript
// src/services/auth/types.d.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}
```

```typescript
// src/services/auth/auth.api.ts
import { LoginRequest, LoginResponse } from "./types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}
```

Импорт и использование типизированного API:

```typescript
import { login } from "../services/auth/auth.api";

async function handleLogin() {
  const result = await login({ email: "test@example.com", password: "123456" });
  console.log(result.user.name); // TypeScript подскажет доступные поля
}
```

---

### ❗️ Частые ошибки при организации файлов с типами

1. **Смешение типов с реализацией.**  
   Все типы должны быть отделены, чтобы их можно было переиспользовать.

2. **Избыточная детализация.**  
   Не нужно создавать файл `types.d.ts` для каждого компонента, если он простой (например, кнопка). Достаточно определить пропсы прямо рядом с компонентом.

3. **Глобализация всех типов.**  
   Общие типы должны быть централизованы, но типы, специфичные для логики, храните локально.

---

### 💡 Резюме

- Централизуйте общие типы (`types/`) и локализуйте частные типы (рядом с компонентами или модулями).
- Используйте соглашения об именовании для однозначности и простой навигации.
- Отделяйте типы от реализации, избегая инлайн-типизации.
- В больших проектах типы должны быть организованы по модулям или фичам.
