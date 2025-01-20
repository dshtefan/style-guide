---
sidebar_position: 2
---

# CSRF защита

**CSRF (Cross-Site Request Forgery)** — это атака, при которой злоумышленник заставляет пользователя выполнить нежелательные действия на сайте, где он аутентифицирован. Примером может быть выполнение мошеннического запроса на изменение данных или отправка вредоносного POST-запроса от имени пользователя.

Этот раздел содержит рекомендации и примеры, которые помогут защитить ваше приложение на React и TypeScript от атак CSRF.

---

### Основные механизмы защиты от CSRF 🔒

1. **Использование CSRF-токенов**.
2. **Валидация источника запроса**.
3. **Меры предосторожности для методов HTTP**.
4. **Заголовки CORS и SameSite cookies**.

---

### Что такое CSRF-токен? 🎟️

CSRF-токен — это уникальный, временный ключ, который генерируется для пользователя на стороне сервера и добавляется к каждому защищённому запросу. Сервер отклоняет запросы без действительного токена.

---

### Использование CSRF-токенов

CSRF-токен обычно передаётся сервером при загрузке страницы или во время входа пользователя. Его необходимо добавить ко всем POST, PUT, DELETE-запросам.

**Пример: Генерация и использование CSRF-токена**

1. **Сторона сервера (Node.js/Express):**
   Сервер генерирует токен и добавляет его в HTML-страницу или выдаёт через API.

```typescript
import csurf from "csurf";
import express from "express";

const app = express();
const csrfProtection = csurf({ cookie: true });

// Генерация токена
app.get("/form", csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken()); // Передаётся в cookie
  res.send({ csrfToken: req.csrfToken() }); // Или предоставляется через API
});
```

2. **Сторона клиента (React c fetch):**
   Клиент добавляет CSRF-токен в заголовки каждого запроса.

```typescript
const postData = async (endpoint: string, data: any) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "", // Передача токена с запросом
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
```

**Плохая практика:**
Не передавать CSRF-токен в чувствительных запросах.

```typescript
// Плохо: отсутствие токена делает запрос уязвимым
fetch("/api/data", { method: "POST", body: JSON.stringify(data) });
```

---

### Валидация источника запроса

Используйте Referer или Origin заголовки для проверки, что запрос пришёл из доверенного источника.

**Пример: Проверка Origin заголовка на сервере (Node.js):**
```typescript
app.use((req, res, next) => {
  const allowedOrigins = ["https://yourdomain.com"];
  const originHeader = req.headers.origin || req.headers.referer;

  if (originHeader && !allowedOrigins.some((origin) => originHeader.startsWith(origin))) {
    res.status(403).send("CSRF protection: Unauthorized origin");
  } else {
    next();
  }
});
```

**Плохая практика:**
Игнорирование проверки источника запроса.

---

### Использование CORS и SameSite Cookies для защиты

CORS (Cross-Origin Resource Sharing) и настройка `SameSite` атрибута у cookies добавляют дополнительный уровень защиты.

1. **CORS-заголовки:**  
   Убедитесь, что ваши API-эндпоинты принимают запросы только с доверенных доменов.

**Пример настройки CORS:**
```typescript
import cors from "cors";

app.use(cors({
  origin: "https://yourdomain.com", // Доверенный домен
  credentials: true, // Передача cookies
}));
```

2. **SameSite Cookies:**  
   Установите атрибуты `SameSite` и `Secure`, чтобы ограничить использование cookies.

**Пример: Установка cookies с атрибутами (Node.js):**
```typescript
res.cookie("SESSION_ID", "secure_session_id", {
  httpOnly: true,
  secure: true, // Только через HTTPS
  sameSite: "Strict", // Cookie доступны только для запросов с того же сайта
});
```

**Плохая практика:**
- Открытое разрешение CORS-настроек (`*` в `origin`).
- Отсутствие `SameSite` или неправильная его конфигурация.

---

### Меры предосторожности для методов HTTP

CSRF-атаки обычно используют GET-запросы, так как браузеры могут их отправлять на сторонний сайт без взаимодействия с пользователем. Убедитесь, что важные действия (например, изменение данных) выполняются только через безопасные методы (POST, PUT, DELETE).

**Пример: Ограничение действий для GET-запросов**
```typescript
app.get("/delete-user", (req, res) => {
  res.status(405).send("GET method not allowed for this action");
});
```

**Хорошая практика:**
Для опасных действий требуйте POST-запрос с CSRF-токеном и дополнительной валидацией.

---

### Рекомендации для работы с CSRF в React

1. **Используйте менеджеры состояний или контексты для хранения CSRF-токенов.**  
   Например, добавьте CSRF-токен в `React Context` и подключайте его в компонентах.

2. **Не храните токены в локальном хранилище (LocalStorage или SessionStorage).**  
   Храните их в `HttpOnly cookies`, чтобы их нельзя было прочитать через JavaScript.

3. **Обновляйте токены при каждом обновлении сессии.**  
   Старые токены должны становиться недействительными.

---

### Выводы 📌

1. ✅ Используйте CSRF-токены для всех POST, PUT, DELETE-запросов.  
2. ✅ Проверяйте заголовки Referer и Origin для подтверждения источника запроса.  
3. ✅ Настройте CORS-заголовки и `SameSite Cookies` для ограничения доступа сторонних доменов.  
4. ✅ Избегайте использования GET-запросов для выполнения важных действий.  
5. ✅ Сохраняйте токены в безопасных местах, например, в cookies с флагом HttpOnly.