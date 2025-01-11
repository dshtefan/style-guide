---
sidebar_position: 1
---

# Форматирование кода

В этом подразделе рассмотрены рекомендации по отступам, максимальной длине строк и разделению кода на логические блоки.

## Отступы и выравнивание

### Рекомендации по использованию пробелов или табуляции

**Использование пробелов:**
- **Преимущества:**
  - Обеспечивает единообразие отображения кода в разных редакторах и IDE.
  - Позволяет точно контролировать количество пробелов.
- **Рекомендации:**
  - Используйте 2 пробела для отступов в JavaScript/TypeScript и 4 пробела для SCSS.
  - Избегайте смешивания пробелов и табуляции в одном проекте.

**Пример настройки в `.editorconfig`:**
```ini
# .editorconfig
[*]
indent_style = space
indent_size = 2

[*.scss]
indent_size = 4
```

### Пример правильного и неправильного выравнивания

**Неправильное выравнивание:**
```typescript
function fetchData() {
\tconst url = "https://api.example.com/data";
\tif (url) {
\t\tconsole.log("Fetching data from", url);
\t}
}
```

:::info

В markdown не отображаются пробелы, поэтому в этом блоке кода они отображены как `\t`.

:::

**Правильное выравнивание (использование пробелов):**
```typescript
function fetchData() {
  const url = "https://api.example.com/data";
  if (url) {
    console.log("Fetching data from", url);
  }
}
```

## Максимальная длина строки

### Установка максимально допустимой длины строки

**Рекомендации:**
- Максимальная длина строки должна составлять **100 символов** для улучшения читаемости и предотвращения горизонтальной прокрутки.
- Для сложных выражений или строк, где это необходимо, допустимо увеличение до **120-140 символов**.

### Примеры перелома строк для улучшения читаемости

**Неправильный пример (слишком длинная строка):**
```typescript
const fetchData = () => {
  return axios.get("https://api.example.com/data?param1=value1&param2=value2&param3=value3&param4=value4")
    .then(response => response.data)
    .catch(error => console.error(error));
};
```

**Правильный пример (перелом строки для улучшения читаемости):**
```typescript
const fetchData = () => {
  return axios
    .get("https://api.example.com/data", {
      params: {
        param1: "value1",
        param2: "value2",
        param3: "value3",
        param4: "value4",
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};
```

## Разделение кода на логические блоки

### Использование пустых строк для логического разделения

**Рекомендации:**
- Разделяйте код на логические блоки с помощью одной пустой строки.
- Не используйте более двух пустых строк подряд.
- Группируйте связанные функции и компоненты вместе, разделяя их от других блоков кода.

### Примеры структурирования кода

**Неправильное структурирование (без разделения логических блоков):**
```tsx
import React from "react";
import axios from "axios";

const fetchData = () => {
  return axios.get("/api/data");
};
const processData = (data) => {
  return data.map(item => item.value);
};
const MyComponent = () => {
  // компонент
};
export default MyComponent;
```

**Правильное структурирование (с разделением логических блоков):**
```tsx
import React from "react";
import axios from "axios";

// Функции для работы с API
const fetchData = () => {
  return axios.get("/api/data");
};

const processData = (data) => {
  return data.map((item) => item.value);
};

// Компонент
const MyComponent = () => {
  // компонент
};

export default MyComponent;
```