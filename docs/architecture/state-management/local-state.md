---
sidebar_position: 2
---

# Локальное состояние компонентов

Локальное состояние — это состояние, управление которым полностью сосредоточено в одном компоненте, и оно не доступно за его пределами. В React локальное состояние создается с использованием хука `useState` или более сложных хуков, таких как `useReducer`.

**Когда использовать локальное состояние:**
- Данные связаны только с текущим компонентом (например, форма, модальное окно).
- Данные не нужно передавать в большое количество компонентов или сохранять после уничтожения компонента.
- Простая логика управления состоянием.

> Локальное состояние подходит идеально для частного и временного использования, в то время как централизованное хранилище используется для глобальных данных, разделяемых между фичами.

---

### 🛠 Основные правила работы с локальным состоянием:

1. **Ограничивайте использование локального состояния только текущим компонентом**, не пытайтесь распространять его на смежные компоненты через пропсы. Если состояние должно охватывать несколько компонентов, рассмотрите `useContext` или централизованное хранилище.
   
2. **Не превышайте сложность логики в локальном состоянии**. Для сложного и взаимосвязанного состояния используйте `useReducer` или сторонние библиотеки.

3. **Избегайте глубоких деревьев пропсов**. Если дочерним элементам нужно состояние, передавайте функции (например, колбэки) вместо передачи всего объекта состояния.

---

### ✅ Пример хорошей практики:

Пример управления состоянием через `useState` для формы обратной связи:

```tsx
// components/FeedbackForm.tsx
import React, { useState } from "react";

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", feedback);
    setIsSubmitted(true);
  };

  return (
    <div>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Thank you for your feedback!</p>
      )}
    </div>
  );
};

export default FeedbackForm;
```

**Почему это хорошо:**
1. Используется локальное состояние, управляемое только этим компонентом.
2. Состояние компактно и понятно.
3. Вся логика (отслеживание текста и отправка формы) сосредоточена внутри одного компонента.

---

### ❌ Пример плохой практики:

```tsx
// Плохое управление состоянием, усложняющее код
const FeedbackForm: React.FC = () => {
  const [state, setState] = useState<any>({
    feedback: "",
    isSubmitted: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", state.feedback);
    setState({ ...state, isSubmitted: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({ ...state, feedback: e.target.value });
  };

  return (
    <div>
      {!state.isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={state.feedback}
            onChange={handleChange}
            placeholder="Enter your feedback..."
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Thank you for your feedback!</p>
      )}
    </div>
  );
};
```

**Почему это плохо:**
1. Неоправданное использование сложной структуры состояния с вложенностью.
2. Лишнее дублирование вызова `setState` с частичным обновлением.
3. Переусложнение кода, уменьшающее читаемость и увеличивающее вероятность ошибок.

---

### 🧰 Пример использования `useReducer` для сложной логики

Когда состояние становится сложным (например, если одна переменная изменяет другие переменные), лучше использовать хук `useReducer`. Это масштабируемый и предсказуемый подход.

Пример сложной формы с несколькими возможными действиями:

```tsx
import React, { useReducer } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Action =
  | { type: "UPDATE_FIELD"; field: string; value: string }
  | { type: "RESET" };

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unknown action type");
  }
}

const ContactForm: React.FC = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: "UPDATE_FIELD", field: e.target.name, value: e.target.value });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <form>
      <label>
        Name:
        <input name="name" value={state.name} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input name="email" value={state.email} onChange={handleChange} />
      </label>
      <label>
        Message:
        <textarea name="message" value={state.message} onChange={handleChange} />
      </label>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export default ContactForm;
```

**Почему это хорошо:**
1. Вся логика работы с состоянием выносится в редьюсер.
2. Сведение состояния к единственному источнику правды.
3. Код становится очевидным и читаемым, даже при увеличении сложности.

---

### Сравнение `useState` и `useReducer`:

| **Критерий**                 | `useState`                                   | `useReducer`                               |
|------------------------------|----------------------------------------------|-------------------------------------------|
| **Простота**                  | Легкий для понимания, используется для простых случаев | Требует больше кода, чем `useState`       |
| **Сложность состояния**       | Подходит для 1-2 управляемых переменных      | Подходит для сложного состояния           |
| **Масштабируемость логики**   | Сложно масштабировать при увеличении сложности состояния | Легко поддерживать и масштабировать      |

---

### 💡 Рекомендации по использованию локального состояния:

1. **Избегайте избыточного локального состояния**: Если одно и то же состояние используется в нескольких компонентах, лучше использовать контекст или централизованное хранилище.
   
2. **Минимизируйте обновления состояния**: Старайтесь не хранить лишнее в локальном состоянии. Например, вместо хранения нескольких аудиофайлов храните только их идентификаторы.

3. **Делегируйте общие состояния вверх по дереву**: Если разные компоненты работают с одним и тем же состоянием, возможно, его лучше вынести в родительский компонент.

4. **Пользуйтесь инструментами линтинга**: `eslint-plugin-react-hooks` помогает убедиться, что вы корректно используете зависимости хуков.

---

### 🎯 Выводы:

- Локальное состояние упрощает управление, если данные используются только компонентом или его дочерними элементами.
- Для простых данных используйте `useState`. Если логика сложная, предпочтительнее `useReducer`.
- Правильное управление локальным состоянием делает компонент компактным, понятным и модульным, что соответствует лучшим практикам архитектуры.