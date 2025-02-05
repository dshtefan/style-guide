---
sidebar_position: 3
---

# Документирование кода

Документирование кода — это процесс написания комментариев, описаний функций, параметров и методов, который помогает не только текущей команде разработчиков, но и будущим сотрудникам быстрее разобраться в коде и архитектуре. Хорошая документация делает проект понятным, поддерживаемым и легко масштабируемым.

---

### Основные принципы хорошей документации 🌟

1. **Пишите документацию для людей.**  
   Документация должна быть написана так, чтобы её было легко читать.

2. **Не дублируйте информацию.**  
   Документируйте только то, что действительно нужно, избегайте очевидных вещей.

3. **Используйте стандартные подходы.**  
   Всегда применяйте общий стиль и формат для всей команды. Например, TSDoc для TypeScript.

4. **Обновляйте документацию вместе с кодом.**  
   Стареющая документация опаснее, чем её отсутствие.

---

### Что документировать? 🧩

1. **Компоненты React.**  
   - Описание назначения компонента.
   - Параметры (props) и их значения.
   - Основные сценарии использования.

2. **Функции и методы.**  
   - Назначение функции.
   - Типы входных данных и возвращаемого значения.
   - Ошибки, которые может выбрасывать функция.

3. **Архитектурные решения.**  
   - Как организованы папки и модули.
   - Как связаны основные части системы.

4. **Стили (SCSS).**  
   - Где находятся общие стили.
   - Какие принципы используются (например, BEM, CSS-модули).

---

### Структура документации для кода

**Пример с компонентами React:**
```tsx
/**
 * Компонент Button.
 * - Используется для отображения кнопки с разными типами стилей.
 *
 * @param props.type Тип кнопки (`primary` | `secondary`) для выбора стилевого оформления.
 * @param props.onClick Обработчик клика.
 * @returns JSX элемент кнопки.
 */
const Button: React.FC<{
  type: 'primary' | 'secondary';
  onClick: () => void;
}> = ({ type, onClick, children }) => {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
```

🙅 **Плохая практика:**
```tsx
// Компонент для кнопки. Делает клик.
const Button = ({ type, onClick, children }) => {
  return (
    <button className={`button ${type}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

---

**Пример документации функций:**
```typescript
/**
 * Функция для расчёта окончательной цены товара с учётом налога.
 *
 * @param price Цена товара в формате number.
 * @param tax Ставка налога (например, 0.2 для 20%).
 * @returns Итоговая цена товара с налогом.
 *
 * @example
 * // Пример использования:
 * const total = calculatePriceWithTax(100, 0.2);
 * console.log(total); // 120
 */
const calculatePriceWithTax = (price: number, tax: number): number => {
  return price + price * tax;
};
```

🙅 **Плохая практика:**
```typescript
// Возвращает общую стоимость.
const calculatePriceWithTax = (price: number, tax: number): number => {
  return price + price * tax;
};
```

---

**Пример документации архитектуры:**
```markdown
# Структура папок

\```
src/
├── components/       // Реиспользуемые UI-компоненты
├── pages/            // Страницы приложения
├── context/          // Контекст и провайдеры
├── hooks/            // Кастомные React-хуки
├── services/         // Логика работы с API
├── utils/            // Утилиты и вспомогательные функции
├── styles/           // Стили приложения
└── App.tsx           // Корневой компонент приложения
\```

## Принципы организации приложения:
- Каждая страница находится в папке `pages/` и представляет собой корневой компонент страницы.
- Компоненты в папке `components/` являются реиспользуемыми и не зависят от конкретной страницы.
- Все сетевые запросы находятся в папке `services/` и инкапсулируют бизнес-логику.
- В папке `context/` лежат файлы для работы с React Context API.
- Для глобальных стилей используйте SCSS (модули).
```

---

**Пример для SCSS модулей (BEM):**
```scss
/**
 * SCSS для компонента Card
 *
 * Базовые классы:
 * - card: Контейнер карточки.
 * - card__title: Заголовок карточки.
 * - card__content: Контент карточки.
 *
 * Модификаторы:
 * - card--highlighted: Карточка с выделением.
 */
.card {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &--highlighted {
    border-color: #007bff;
    background-color: #f0f8ff;
  }

  &__title {
    font-size: 18px;
    font-weight: bold;
  }

  &__content {
    font-size: 14px;
    margin-top: 8px;
  }
}
```


### Общие ошибки 🚨

1. **Комментарии ради комментариев.**  
   → Переизбыток очевидных комментариев только раздражает.

2. **Документирование плохо написанного кода.**  
   → Лучше сначала отрефакторить код, а затем документировать.

3. **Отсутствие регулярного обновления документации.**  
   → Устаревшая документация вводит в заблуждение.

4. **Смешение разных стилей комментариев.**  
   → Непоследовательность делает документацию трудно читаемой.

---

### Советы по улучшению документации ✨

1. ✅ Документируйте только те части, которые важны для понимания.  
2. ✅ Используйте единый стиль документирования в пределах команды.  
3. ✅ Фокусируйтесь на читаемости и логичности кода перед документированием.  
4. ✅ Проверяйте, соответствует ли документация реальному состоянию кода после изменений.  
5. ✅ Делайте примеры использования, чтобы облегчить тестирование или интеграцию для других разработчиков.