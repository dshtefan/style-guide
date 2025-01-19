---
sidebar_position: 1
---

# Мемоизация

Мемоизация — это процесс кэширования результатов вычислений или компонентов, чтобы избежать их повторного выполнения, если входные данные не изменились. В React она используется для оптимизации обновлений компонента, снижения нагрузки на процессор и улучшения производительности.

React предоставляет два основных инструмента для мемоизации:
1. **`useMemo`** — мемоизация вычислений.
2. **`React.memo`** — мемоизация компонентов.

---

### 🧠 Когда использовать мемоизацию?

1. **Избегание повторных тяжелых вычислений.**
   - Если функция или выражение выполняют сложные действия (например, сортировку, фильтрацию), то можно использовать `useMemo`, чтобы результат вычислялся один раз, пока зависимости остаются неизменными.

2. **Оптимизация ререндеринга.**
   - `React.memo` предотвращает повторный рендер компонента, если переданные в него `props` не изменились.

3. **В сочетании с хуками, такими как `useCallback`.**
   - `useCallback` используется в мемоизации функций, а `useMemo` — для мемоизации значений.

---

### Примеры использования `useMemo`

#### Мемоизация тяжелых вычислений

**Плохая практика:**

В этом примере функция `calculate` вызывается на каждом ререндеринге.

```tsx
const MyComponent = ({ items }: { items: number[] }) => {
  const heavyCalculation = () => {
    console.log("Calculating...");
    return items.reduce((acc, item) => acc + item, 0);
  };

  const total = heavyCalculation(); // ❌ Вычисления выполняются на каждом ререндере.

  return <div>Total: {total}</div>;
};
```

**Хорошая практика:**

Используем `useMemo`, чтобы мемоизировать результат вычислений.

```tsx
import React, { useMemo } from "react";

const MyComponent = ({ items }: { items: number[] }) => {
  const total = useMemo(() => {
    console.log("Calculating...");
    return items.reduce((acc, item) => acc + item, 0);
  }, [items]); // ✅ Пересчитываем только если изменился `items`.

  return <div>Total: {total}</div>;
};
```

**Почему это хорошо?**
- Функция `calculate` больше не вызывается на каждом ререндеринге, что экономит ресурсы.
- Вычисления происходят только тогда, когда массив `items` изменяется.

---

### Примеры использования `React.memo`

#### Мемоизация компонента для предотвращения повторного рендера

**Плохая практика:**

Компонент `Child` всегда рендерится, даже если пропсы не изменились.

```tsx
const Child = ({ value }: { value: number }) => {
  console.log("Child render");
  return <div>{value}</div>;
};

const Parent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      <Child value={42} /> {/* ❌ Перерисовывается на каждом ререндере Родителя */}
    </div>
  );
};
```

**Хорошая практика:**

Используем `React.memo`, чтобы предотвратить лишние рендеры `Child`.

```tsx
import React from "react";

const Child = React.memo(({ value }: { value: number }) => {
  console.log("Child render");
  return <div>{value}</div>;
});

const Parent = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
      <Child value={42} /> {/* ✅ Рендерится только один раз */}
    </div>
  );
};
```

**Почему это хорошо?**
- `React.memo` предотвращает вызов функции рендера компонента `Child`, если его пропсы (`value`) не изменились.

---

### 🛑 Неправильное использование мемоизации

Иногда желание оптимизировать приводит к избыточной мемоизации, что усложняет код, а в редких случаях может ухудшить производительность (из-за работы механизма сравнения зависимостей).

**Пример избыточного использования:**

```tsx
const MyComponent = ({ value }: { value: string }) => {
  const memoizedValue = useMemo(() => value.toUpperCase(), [value]); // ❌ Простое преобразование — нет смысла мемоизировать

  return <div>{memoizedValue}</div>;
};
```

**Лучше просто использовать:**

```tsx
const MyComponent = ({ value }: { value: string }) => {
  return <div>{value.toUpperCase()}</div>; // ✅ Простой вызов без мемоизации
};
```

---

### 🔄 Пример комбинирования `useMemo` и `useCallback`

Часто мемоизацию хуков можно эффективно сочетать, например, с функциями.

```tsx
import React, { useMemo, useCallback, useState } from "react";

const App = () => {
  const [list, setList] = useState([1, 2, 3]);
  const [filter, setFilter] = useState(0);

  const filteredList = useMemo(() => {
    console.log("Filtering list...");
    return list.filter((item) => item > filter);
  }, [list, filter]);

  const addItem = useCallback(() => {
    setList((prevList) => [...prevList, prevList.length + 1]);
  }, []);

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <input
        type="number"
        value={filter}
        onChange={(e) => setFilter(Number(e.target.value))}
      />
      <ul>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
```

**Почему это полезно?**
- `filteredList` мемоизируется, и вычисления фильтрации выполняются только при изменении списка или фильтра.
- `addItem` мемоизируется, и функция вызывается без лишних перерисовок.

---

### 🌟 Когда можно не использовать мемоизацию?

1. Если операции в компоненте достаточно быстрые.
2. Если компонент рендерится редко и только при значительных изменениях.
3. Если стоимость добавления памяти (для хранения мемоизированных данных) превышает пользу от оптимизации.

---

### 🚀 Резюме

- Используйте **`useMemo`** для мемоизации значений, которые требуют тяжелых вычислений.
- Используйте **`React.memo`** для предотвращения ненужных рендеров компонентов с неизменными `props`.
- Не мемоизируйте то, что не нуждается в оптимизации. Правильная оценка необходимости мемоизации — ключ к разработке производительного приложения.