---
sidebar_position: 3
---

# Управление состоянием

В этом подразделе рассматриваются различные подходы и инструменты для управления состоянием.

## Контекст API

**Контекст API** предоставляет способ передавать данные через дерево компонентов без необходимости явно передавать пропсы на каждом уровне.

**Когда использовать Context API:**
- Для глобальных данных, таких как тема, язык интерфейса или аутентификационная информация.
- Когда требуется передавать данные многим компонентам на разных уровнях дерева компонентов.
- Для небольших и средних проектов, где использование сторонних библиотек может быть избыточным.

**Пример реализации Context API:**

```tsx title="/context/ThemeContext.tsx"
import React, { createContext, useState, ReactNode } from 'react';

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

```tsx title="/App.tsx"
import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Header />
      {/* Другие компоненты приложения */}
    </ThemeProvider>
  );
};

export default App;
```

```tsx title="/components/Header.tsx"
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className={`header ${theme}`}>
      <h1>Мое Приложение</h1>
      <button onClick={toggleTheme}>
        Переключить на {theme === 'light' ? 'темную' : 'светлую'} тему
      </button>
    </header>
  );
};

export default Header;
```

**Преимущества использования Context API:**
- **Удобство:** Легко передавать данные через дерево компонентов.
- **Минимизация проп-дриллинга:** Избегается необходимость передавать пропсы через несколько уровней компонентов.
- **Интеграция с React:** Встроенный инструмент, не требующий дополнительных зависимостей.

## Библиотеки управления состоянием (Redux, MobX и др.)

Для более сложных приложений может потребоваться использование специализированных библиотек для управления состоянием, таких как Redux или MobX.

**Рекомендации по выбору библиотеки:**
- **Redux:**
  - Подходит для больших и сложных приложений.
  - Обеспечивает предсказуемость состояния через иммутабельные редюсеры и однонаправленный поток данных.
  - Расширяем с помощью middleware (например, Redux Thunk, Redux Saga).
- **MobX:**
  - Подходит для приложений, требующих высокой производительности и гибкости.
  - Основан на реактивном программировании, автоматически отслеживает зависимости.
  - Меньше шаблонного кода по сравнению с Redux.

**Пример настройки и использования Redux:**

```typescript title="/store/index.ts"
import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from '../features/authentication/authenticationSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

```tsx title="/App.tsx"
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import UserContainer from './containers/UserContainer';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <UserContainer />
      {/* Другие контейнерные компоненты */}
    </Provider>
  );
};

export default App;
```

```typescript title="/eatures/authentication/authenticationSlice.ts"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    fetchUserFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, logout } = authenticationSlice.actions;

export const fetchUser = () => async (dispatch: any) => {
  dispatch(fetchUserStart());
  try {
    const response = await fetch('/api/user');
    const data: User = await response.json();
    dispatch(fetchUserSuccess(data));
  } catch (error) {
    dispatch(fetchUserFailure());
    console.error(error);
  }
};

export default authenticationSlice.reducer;
```

**Преимущества использования библиотек управления состоянием:**
- **Предсказуемость:** Ясно определенные сущности (акшены, редюсеры) облегчают отладку и тестирование.
- **Масштабируемость:** Легко управлять состоянием в больших приложениях.
- **Сообщество и поддержка:** Популярные библиотеки имеют большое сообщество и множество ресурсов.

## Сравнение подходов и лучшие практики

**Сравнение Context API и Redux:**

| **Критерий**            | **Context API**                                     | **Redux**                                            |
|-------------------------|-----------------------------------------------------|------------------------------------------------------|
| **Комплексность**       | Низкая                                              | Высокая                                              |
| **Код и настройка**     | Минимум кода, простая настройка                     | Требует больше кода и конфигурации                   |
| **Производительность**  | Может снижаться при частых обновлениях контекста    | Эффективное управление изменениям состояния          |
| **Отладка**             | Ограниченные инструменты                            | Богатые инструменты отладки                          |
| **Гибкость**            | Подходит для простых случаев                        | Подходит для сложных и масштабируемых приложений     |
| **Сообщество**          | Встроенный инструмент React                         | Большое сообщество и экосистема библиотек            |

**Лучшие практики:**
- Используйте **Context API** для простых, глобальных состояний, таких как тема или язык интерфейса.
- Применяйте **Redux** для управления сложным состоянием с множеством взаимозависимых данных и действий.
- Избегайте чрезмерного использования Context API для часто изменяющихся данных, чтобы избежать проблем с производительностью.
- Всегда придерживайтесь единообразия в выборе подхода управления состоянием по всему проекту.
