---
sidebar_position: 2
---

# Паттерны проектирования

Использование проверенных паттернов проектирования помогает создавать гибкую и легко поддерживаемую архитектуру приложения. В этом подразделе рассматриваются основные паттерны, применяемые в проектах на React с использованием TypeScript и SCSS.

## Модульность

**Принципы модульного подхода** заключаются в разбиении приложения на независимые, переиспользуемые и изолированные модули. Каждый модуль отвечает за определенную функциональность и может быть легко интегрирован или заменен без влияния на другие части приложения.

**Рекомендации по модульности:**
- **Разделяйте ответственность:** Каждый модуль должен иметь четко определенную ответственность.
- **Избегайте жестких зависимостей:** Используйте инъекцию зависимостей и абстракции для минимизации связности между модулями.
- **Переиспользуемость:** Разрабатывайте модули таким образом, чтобы их можно было использовать в разных частях приложения или в других проектах.

**Примеры разбиения кода на модули:**

```typescript title="/features/authentication/authenticationSlice.ts"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
```

```typescript title="/features/dashboard/dashboardSlice.ts"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  widgets: Widget[];
}

const initialState: DashboardState = {
  widgets: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget(state, action: PayloadAction<Widget>) {
      state.widgets.push(action.payload);
    },
    removeWidget(state, action: PayloadAction<string>) {
      state.widgets = state.widgets.filter(widget => widget.id !== action.payload);
    },
  },
});

export const { addWidget, removeWidget } = dashboardSlice.actions;
export default dashboardSlice.reducer;
```

## Single Responsibility Principle (Принцип единственной ответственности)

**Принцип единственной ответственности (SRP)** гласит, что каждый модуль или класс должен отвечать лишь за одну конкретную задачу или аспект функциональности. Это упрощает тестирование, чтение и поддержку кода.

**Примеры применения SRP в компонентах:**

**Неправильный пример (несколько ответственностей в одном компоненте):**

```tsx title="/components/UserProfile.tsx"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('/api/user')
      .then(response => setUser(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleLogout = () => {
    axios.post('/api/logout')
      .then(() => {
        // редирект или обновление состояния
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
```

**Правильный пример (разделение обязанностей):**

```tsx title="/components/UserProfile.tsx"
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/authentication/authenticationSlice';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.authentication.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
```

```tsx title="/hooks/useFetchUser.ts"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../features/authentication/authenticationSlice';

const useFetchUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        dispatch(login(response.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { loading };
};

export default useFetchUser;
```

**Преимущества SRP:**
- **Упрощение тестирования:** Модули с одной ответственностью легче тестировать.
- **Улучшение читабельности:** Проще понимать назначение каждого модуля.
- **Повышение переиспользуемости:** Модули можно легко использовать в других частях приложения.

## Другие паттерны (например, Container/Presentational)

**Паттерн Container/Presentational** разделяет компоненты на контейнерные (управляющие логикой и состоянием) и презентационные (отвечающие за отображение).

**Описание паттерна:**
- **Container-компоненты:**
  - Управляют состоянием и побочными эффектами.
  - Подключаются к хранилищу состояния (например, Redux).
  - Передают данные и обработчики событий в презентационные компоненты.
- **Presentational-компоненты:**
  - Отвечают только за отображение UI.
  - Не имеют собственной логики управления состоянием.
  - Получают данные и функции через пропсы.

**Пример использования Container/Presentational:**

```tsx title="/containers/UserContainer.tsx"
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserProfile from '../components/UserProfile';
import { fetchUser } from '../features/authentication/authenticationSlice';
import { RootState } from '../store';

const UserContainer: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authentication.user);
  const loading = useSelector((state: RootState) => state.authentication.loading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <UserProfile user={user} />;
};

export default UserContainer;
```

```tsx title="/components/UserProfile.tsx"
import React from 'react';

interface UserProfileProps {
  user: User | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return <div>No user data.</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;
```

**Преимущества паттерна Container/Presentational:**
- **Разделение обязанностей:** Разделяет логику управления состоянием и отображение UI.
- **Повышение переиспользуемости:** Presentational-компоненты легче переиспользовать в разных контекстах.
- **Упрощение тестирования:** Отделение логики и UI облегчает написание тестов.
