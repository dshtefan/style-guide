---
sidebar_position: 1
---

# Code Review процесс

**Code Review (код-ревью)** — это неотъемлемая часть процесса разработки, связанная с проверкой кода коллегами. Она помогает находить ошибки, поддерживать единый стиль кода, улучшать общий уровень команды и обеспечивать качество финального продукта. 

---

### Цели Code Review 🧩

1. **Обеспечение качества кода.**  
   Минимизировать баги, улучшить читаемость и структуру.

2. **Повышение уровня команды.**  
   Совместное обсуждение решений помогает разработчикам учиться.

3. **Соблюдение общих соглашений.**  
   Поддержание единого кодстайла и архитектуры.

4. **Обсуждение оптимальных решений.**  
   Вместе находить более продуманные подходы.

---

### Кто и как проводит Code Review? 👥

- **Автор кода (Author):** Должен подготовить код к проверке — написать понятный Pull Request, добавить описание и, при возможности, тесты.
- **Ревьюер (Reviewer):** Члены команды, которые проверяют код на соответствие требованиям. Это могут быть как менторы, так и коллеги на таком же уровне.
- **Технический лидер (Tech Lead):** Участвует в проверке при необходимости, чтобы обсудить архитектурные решения.

---

### Как подготовить код к Code Review 🛠️

1. **Создайте чистый и структурированный Pull Request.**  
   Убедитесь, что PR не содержит лишнего кода, отладочной информации или временных решений.

2. **Добавьте описание к PR.**  
   Чётко опишите, что сделано, зачем, и какие задачи решены. 

**Пример хорошего описания PR:**
```
### Что сделано:
- Добавлен компонент Button с двумя состояниями: Primary и Secondary.
- Написаны unit-тесты для каждого состояния.
- Добавлены соответствующие SCSS-правила.

### Решаемые задачи:
- [TASK-1234](https://tracker.example.com/TASK-1234): Реализовать базовый дизайн системы.

### Примечания:
- В будущем нужно обновить дизайн для состояния Disabled.
```

🙅 **Плохая практика:**  
Отсутствие описания или слишком общий текст. Например:
```
Добавлен компонент и немного исправлений.
```

3. **Разделите большие изменения.**  
   Если изменения слишком объёмны и затрагивают много файлов (>10–15 файлов), разбейте их на смысловые части.

4. **Запустите линтеры и тесты.**  
   Перед отправкой на ревью убедитесь, что код проходит линтинг (`eslint`, `stylelint`) и успешные тесты.

---

### Как проводить Code Review? 🔍

Ревьюеру необходимо придерживаться определённой структуры при проверке. Основные шаги:

1. **Понять контекст.**  
   Прочитайте описание PR, задавайте вопросы, если что-то непонятно.

2. **Оценить архитектуру изменений.**
   - Соответствует ли код существующей архитектуре?
   - Решает ли он заявленную проблему?

3. **Проверить читабельность кода.**
   - Ясно ли написаны функции?
   - Легко ли понять, что делает код без дополнительных пояснений?

   **Хорошая практика:**
   Писать функции с понятными названиями, которые отражают их назначение.

   ```typescript
   // Плохо
   const x = (a: number, b: number) => a + b * 2;

   // Хорошо
   const calculatePriceWithTax = (price: number, tax: number) => price + price * tax;
   ```

4. **Проверить тесты.**
   - Покрывают ли тесты ключевые сценарии? 
   - Следуют ли они принципу "один тест — один сценарий"?

   **Пример хорошего теста:**
   ```tsx
   it("renders the correct button label", () => {
     const { getByText } = render(<Button label="Click me!" />);
     expect(getByText("Click me!")).toBeInTheDocument();
   });
   ```

5. **Ищите уязвимости и ошибки.**
   - Есть ли обработка ошибок в коде?
   - Учитываются ли edge cases?

6. **Соблюдайте уважение.**  
   Если вы видите проблемы, старайтесь формулировать их конструктивно.

**Пример конструктивного подхода:**
```
❓ Почему здесь используется `any`? Можно ли заменить его на конкретный тип? Это улучшит читаемость и предотвратит потенциальные ошибки.
```

🙅 **Плохая практика:**  
Формулировать комментарии в грубой форме:
```
Использовать `any` - это ужасная практика. Исправь.
```

---

### Code Review Check-лист ✅

Перед завершением Code Review убедитесь, что выполнены следующие критерии:

1. Код:
   - [ ] Соответствует стандартам кодстайла (ESLint, Prettier).
   - [ ] Легко читается и понятен.
   - [ ] Имеет понятные функции и переменные.

2. Тесты:
   - [ ] Есть покрытие ключевых функций тестами.
   - [ ] Тесты проходят без ошибок.

3. Архитектура:
   - [ ] Изменения согласованы с общей архитектурой приложения.
   - [ ] Нет дублирования или излишней сложности.

4. Документация:
   - [ ] Код документирован, если это необходимо.
   - [ ] В дополнение к коду прилагаются шаги по тестированию изменений.

---

### Примеры хороших и плохих практик

#### Пример плохой структуры PR:
- Описание отсутствует.
- Код содержит временные решения, которые не удалены.
- Нет тестов.

#### Пример хорошо организованного PR:
- Чёткое описание.
- Код чистый, нет лишних изменений.
- Тесты покрывают все основные сценарии.
---

### Выводы 📌

1. ✅ Код-ревью — это командная работа, требующая уважительного подхода.  
2. ✅ Делайте описание PR максимально информативным.  
3. ✅ Проверяйте архитектуру, читаемость, тесты и кодстайл.  
4. ✅ Используйте чек-листы для системной проверки.  
5. ✅ Цель Code Review — не критиковать, а улучшать качество кода и поддерживать команду.