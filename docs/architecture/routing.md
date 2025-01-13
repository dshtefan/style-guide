---
sidebar_position: 5
---


# Маршрутизация

Маршрутизация отвечает за навигацию между различными страницами или представлениями в приложении. Использование правильной структуры маршрутов и реализация защищенных маршрутов способствует лучшей организации приложения и обеспечению безопасности.

## Структура маршрутов

**Организация маршрутов в приложении** должна быть логичной и отражать структуру функциональных модулей. Четкая структура маршрутов облегчает навигацию и поддержку кода.

**Пример конфигурации маршрутов с React Router:**

```tsx
// App.tsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default App;
```

**Преимущества четкой структуры маршрутов:**
- **Упрощение навигации:** Легко определить, какой компонент отвечает за какой маршрут.
- **Масштабируемость:** Легко добавлять новые маршруты без нарушения существующей структуры.
- **Удобство поддержки:** Простота внесения изменений и отладки маршрутов.

## Защищенные маршруты

**Защищенные маршруты** предназначены для ограничения доступа к определенным частям приложения только для авторизованных пользователей. Это улучшает безопасность приложения и контролирует доступ к конфиденциальным данным.

**Реализация аутентификации для маршрутов:**

```tsx
// components/PrivateRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
```

```tsx
// App.tsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <Route path="/login" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default App;
```

**Преимущества защищенных маршрутов:**
- **Безопасность:** Предотвращает доступ неавторизованных пользователей к защищенным разделам приложения.
- **Удобство использования:** Автоматическая перенаправление на страницу входа при попытке доступа к защищенному маршруту.
- **Гибкость:** Легко настраивать различные уровни доступа для разных маршрутов.

**Пример защищенного маршрута:**

```tsx
// pages/DashboardPage.tsx
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1>Панель управления</h1>
      {/* Содержимое панели управления */}
    </div>
  );
};

export default DashboardPage;
```

**Объяснение:**
- **PrivateRoute** проверяет состояние аутентификации из глобального хранилища.
- **Если пользователь аутентифицирован**, рендерится защищенный компонент.
- **Если нет**, пользователь перенаправляется на страницу входа.
