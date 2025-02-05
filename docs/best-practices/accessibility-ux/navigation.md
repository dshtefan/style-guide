---
sidebar_position: 3
---

# Клавиатурная навигация

Обеспечение полной функциональности и доступности сайта через клавиатуру — важнейший аспект разработки. Клавиатурная навигация позволяет пользователям с ограниченными возможностями, а также тем, кто предпочитает не использовать мышь, эффективно взаимодействовать с интерфейсом.

---

### Важность поддержки клавиатурной навигации 🔑

1. **Доступность (Accessibility):** Пользователи, использующие вспомогательные технологии (например, экранные чтецы), полагаются на клавиатуру.
2. **Юзабилити:** Клавиатурная доступность улучшает общий пользовательский опыт, делая интерфейс более интуитивным.
3. **Соответствие стандартам:** Поддержка клавиатурной навигации необходима для соблюдения стандартов WCAG (Web Content Accessibility Guidelines).

---

### Основные рекомендации для клавиатурной навигации 🧭

#### 1. Используйте корректный порядок табуляции

Клавиша **Tab** используется для перемещения по фокусируемым элементам. Порядок перехода должен быть логичным и соответствовать визуальному представлению на странице.

**Плохая практика:** Неправильный порядок по табуляции.
```html
<div>
  <input type="text" placeholder="Имя" />
  <button>Отправить</button>
  <input type="email" placeholder="Email" />
</div>
```
Пользователь перейдёт сначала на кнопку, потом вернётся к полю "Email", что нелогично.

**Хорошая практика:** Элементы расположены в логическом порядке.
```html
<div>
  <input type="text" placeholder="Имя" />
  <input type="email" placeholder="Email" />
  <button>Отправить</button>
</div>
```

> **Совет:** Логика табуляции устанавливается порядком элементов в DOM. Старайтесь избегать ручной настройки `tabindex`, если это не критично необходимо.

---

#### 2. Используйте атрибут `tabindex` осознанно

Атрибут `tabindex` позволяет управлять порядком табуляции. Однако злоупотребление этим атрибутом может навредить навигации.

- `tabindex="0"` — элемент добавляется в естественный поток табуляции.
- `tabindex="-1"` — элемент удаляется из последовательности табуляции, но остаётся доступным для скриптов.
- Положительные значения `tabindex` изменяют порядок, но их следует избегать, чтобы не ломать естественный поток.

**Плохая практика:** 
Неестественный порядок из-за положительного `tabindex`.

```html
<div>
  <button tabindex="2">Кнопка 1</button>
  <button tabindex="3">Кнопка 2</button>
  <button tabindex="1">Кнопка 3</button>
</div>
```

**Хорошая практика:** Используйте `tabindex="0"` только на необходимых элементах, например, на кастомных интерактивных компонентах.

```html
<div role="button" tabindex="0" onclick="handleClick()">
  Кастомная кнопка
</div>
```

---

#### 3. Обеспечьте видимость фокуса

Пользователь должен чётко видеть, какой элемент находится в фокусе при навигации клавиатурой. Это достигается с помощью CSS-псевдокласса `:focus`.

**Плохая практика:** Фокус не стилизован.

```css
button {
  outline: none; /* Фокус полностью убран */
}
```

**Хорошая практика:** Стилизуйте фокус для улучшения видимости. Не убирайте `outline`, если не добавляете альтернативу!

```css
button:focus {
  outline: 2px solid #007BFF;
  outline-offset: 2px;
}
```

> **Совет:** Для видимости фокуса на кастомных элементах используйте комбинацию `tabindex` и управляемой стилизации.

---

#### 4. Работайте с кастомными компонентами

Кастомные компоненты, построенные с использованием `<div>` или `<span>`, не имеют встроенной доступности. Не забудьте добавить поддержку клавиша **Enter** и **Space** для взаимодействия.

**Плохая практика:** Нерабочая клавиатурная навигация.

```tsx
const CustomButton: React.FC = () => (
  <div onClick={() => alert("Кликнули!")}>Кнопка</div>
);
```

**Хорошая практика:** Добавление `role` и поддержки клавиш.

```tsx
const CustomButton: React.FC = () => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => alert("Кликнули!")}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        alert("Активировано клавишей Enter или Space!");
      }
    }}
  >
    Кнопка
  </div>
);
```

---

#### 5. Работайте с модальными окнами

Модальные окна требуют особого внимания. При открытии:
1. Сконцентрируйтесь на первом интерактивном элементе модального окна.
2. Скрывайте содержимое страницы под ним с помощью `aria-hidden`.
3. Обеспечьте закрытие модального окна при нажатии **Escape**.

**Пример:**

```tsx
const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <h2>Модальное окно</h2>
      <button onClick={onClose}>Закрыть</button>
    </div>
  );
};
```

---

### Выводы 📌

1. ✅ Убедитесь, что последовательность табуляции соответствует визуальному порядку.  
2. ✅ Обеспечьте стильные и видимые состояния фокуса для всех элементов.  
3. ✅ Реализуйте поддержку клавиш **Enter** и **Space** для кастомных интерактивных элементов.  
4. ✅ Следите за доступностью модальных окон и скрытием неактивного контента.  
5. ✅ Регулярно тестируйте навигацию клавиатурой для всех интерактивных элементов.  
