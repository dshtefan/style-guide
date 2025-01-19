---
sidebar_position: 1
---

# Централизованное хранилище

**Централизованное хранилище (State Management)** — это единственный источник правды для состояния приложения. Оно используется для хранения и управления данными, которые делятся между несколькими компонентами, остаются в синхронизации и обновляются централизованно.

---

### 🛠 Когда использовать централизованное хранилище?

- У вас есть **глобальные данные**, которые используются в разных частях приложения (например, данные текущего пользователя, токены авторизации, настройки).
- Ваше приложение содержит **сложное состояние** (например, взаимодействие между фичами, кэширование API-вызовов, обработка ошибок).
- Состояние нужно **централизованно изменять** различными модулями или компонентами.
- Вы используете серверное кэширование (например, с React Query).

Если состояние используется только внутри одного компонента или небольшого поддерева, вы можете ограничиться локальным хранилищем (разберем в следующем пункте).

---

### Основные библиотеки для централизованного хранилища

1. **Redux**: Самая популярная библиотека для централизованного хранилища.
2. **Zustand**: Легковесная и лаконичная альтернатива Redux.

---

### 📖 Примеры и лучшие практики с использованием Redux

Redux — это библиотека, которая предоставляет шаблон предсказуемого управления состоянием с помощью единого централизованного хранилища. Здесь мы разберем пример, основанный на TypeScript.

---

#### 1️⃣ Установка Redux и связанных инструментов:

Для интеграции Redux с React и TypeScript установите необходимые зависимости:

```bash
npm install @reduxjs/toolkit react-redux
npm install -D @types/react-redux
```

---

#### 2️⃣ Создание слайса: 

Слайсы (slices) содержат логику для управления отдельной частью состояния.

```tsx
// features/counter/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1; // Immer позволяет работать с мутирующим синтаксисом
    },
    decrement(state) {
      state.value -= 1;
    },
    reset(state) {
      state.value = 0;
    },
    setToValue(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, reset, setToValue } = counterSlice.actions;
export default counterSlice.reducer;
```

---

#### 3️⃣ Настройка стора:

Создайте и настройте глобальный стор.

```tsx
// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Типизация для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

#### 4️⃣ Подключение Redux к React:

Оборачиваем корневой компонент провайдером `Provider`.

```tsx
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

---

#### 5️⃣ Использование хранилища в компоненте:

Интеграция через хуки `useSelector` и `useDispatch`.

```tsx
// features/counter/Counter.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { increment, decrement, reset, setToValue } from "./counterSlice";

export const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <button onClick={() => dispatch(setToValue(50))}>Set to 50</button>
    </div>
  );
};
```

---

### ✅ Пример хорошей практики:

- Создание всех **слайсов в пределах своей фичи** в папке `features`.
- Исполнение экшенов через типизированную функцию `dispatch`.
  
**Структура:**
```
src/
├── app/
│   ├── store.ts          // Настройки глобального хранилища
├── features/
│   ├── counter/          // Фича "Счетчик"
│   │   ├── Counter.tsx   // UI-компонент счетчика
│   │   ├── counterSlice.ts // Логика состояния
│   │   └── index.ts      // Точка экспорта фичи
```

---

### ❌ Пример плохой практики:

```tsx
// Компонент с вшитой всей логикой состояния
import React, { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
};
```

**Почему это плохо:**
1. Состояние не централизовано, его нельзя синхронизировать между компонентами.
2. Нельзя организовать внешний доступ к состоянию из других частей приложения.
3. Невозможно протестировать бизнес-логику отдельно от компонента.

---

### Советы и идиомы централизованного состояния:

1. **Никогда не храните компонентное состояние в Redux**, если оно используется только в пределах одного компонента. Локальный `useState` здесь лучше.
2. Разбивайте хранилище по модулям с помощью слайсов или локализованных стора.
3. Используйте `@reduxjs/toolkit` для уменьшения шаблонного кода. Он упрощает работу с reducer, action и middleware.
4. Используйте мемоизированные селекторы (через `reselect`), чтобы избежать избыточных перерисовок.

---

### 🎯 Выводы:
1. Централизованное хранилище организует предсказуемое управление данными в приложении.
2. Redux предоставляет четчивый и масштабируемый API, особенно при использовании `@reduxjs/toolkit`.
3. Декомпозиция состояния по фичам и фокусирование только на глобальных данных — ключ к хорошей архитектуре.