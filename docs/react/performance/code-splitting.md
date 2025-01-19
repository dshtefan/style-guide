---
sidebar_position: 2
---

# Code Splitting

**Code Splitting** — это техника разделения приложения на отдельные части (chunks), которые загружаются браузером по мере необходимости. Это помогает:
- Уменьшить размер первоначального бандла, улучшая время загрузки страницы.
- Загружать только ту часть приложения, которая используется.

---

### 🎯 Когда использовать Code Splitting?

- Приложение состоит из большого количества страниц или маршрутов.
- В приложении есть тяжёлые компоненты (например, графики, редакторы, или сложные визуальные эффекты).
- Некоторые модули используются редко или только при определённых действиях пользователя.

---

### Основные подходы Code Splitting

React поддерживает несколько стратегий Code Splitting:

1. **Разделение по маршрутам (Route-based Splitting):**  
   Загружайте содержимое страницы только тогда, когда она требуется.

2. **Разделение компонентов (Component-based Splitting):**  
   Загружайте тяжёлые компоненты по мере необходимости.

3. **Динамическое использование модулей:**  
   Используйте `import()` для загрузки кода по вызову.

---

### ✅ Пример хорошего кода: Разделение по маршрутам

Для разделения по маршрутам с использованием `React.lazy`:

```tsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Ленивая загрузка страниц
const HomePage = lazy(() => import("./pages/HomePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
```

**Почему это хорошо:**
- Код каждой страницы загружается только при переходе на соответствующий маршрут.
- Уменьшается размер JavaScript, необходимого для первоначальной загрузки.

---

### ✅ Пример хорошего кода: Ленивая загрузка компонента

Если есть тяжёлый компонент, который используется только в определённый момент (например, модальное окно), его можно загрузить лениво.

```tsx
import React, { Suspense, lazy, useState } from "react";

// Ленивая загрузка модального компонента
const LazyModal = lazy(() => import("./components/Modal"));

const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>

      <Suspense fallback={<div>Loading modal...</div>}>
        {isModalOpen && <LazyModal onClose={() => setModalOpen(false)} />}
      </Suspense>
    </div>
  );
};

export default App;
```

**Почему это хорошо:**
- Компонент `Modal` загружается только при необходимости, что снижает нагрузку при первоначальной загрузке страницы.

---

### ✅ Динамическая загрузка с помощью `import()`

Иногда может быть полезно загрузить модуль только тогда, когда он нужен.

```tsx
const loadChartLibrary = async () => {
  const { Chart } = await import("chart.js");
  return Chart;
};

const App: React.FC = () => {
  const handleLoadChart = async () => {
    const Chart = await loadChartLibrary();
    console.log("Chart.js loaded:", Chart);
  };

  return <button onClick={handleLoadChart}>Load Chart.js</button>;
};
```

**Почему это хорошо:**
- Легковесные инструменты, такие как графики или аналитические библиотеки, можно загружать только тогда, когда пользователь взаимодействует с функционалом.

---

### ❌ Пример плохой практики: Один большой бандл

Все компоненты и маршруты загружаются сразу, вне зависимости от того, используется их функциональность или нет.

```tsx
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

**Почему это плохо:**
- Загружается сразу весь код всех маршрутов (даже если они не используются), что увеличивает размер первоначального JS-файла и замедляет загрузку приложения.

---

### Советы по внедрению Code Splitting

1. **Используйте React.lazy с Suspense.**  
   Всегда предоставляйте `fallback`, чтобы отобразить загрузочный индикатор, пока компонент или страница загружается.

2. **Старайтесь загружать тяжёлые библиотеки динамически.**  
   Например, библиотеки для графиков, визуализации, или PDF-генерации редко нужны сразу при открытии страницы.

3. **Оптимизируйте точки входа.**  
   Разделяйте код не только по маршрутам, но и по функциональным зонам (например, логику авторизации, админ-панели).

---

### 🚀 Резюме

- Code Splitting улучшает пользовательский опыт за счёт уменьшения первоначального бандла.
- Используйте `React.lazy` и `Suspense` для маршрутов и тяжёлых компонентов.
- Загрузка по требованию (dynamic import) оптимизирует использование тяжёлых библиотек и модулей.
- Анализируйте и тестируйте чанк-структуру вашего приложения для повышения эффективности.