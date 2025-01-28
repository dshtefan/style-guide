---
sidebar_position: 3
---

# Защита API-точек

Безопасность при работе с API — важный аспект фронтенд-разработки. Хотя основная ответственность за безопасность API лежит на серверной части, frontend может играть критическую роль в обеспечении защиты данных. Понимание правильного взаимодействия с API-точками является необходимым инструментом для предотвращения уязвимостей.

---

### Основные угрозы взаимодействия с API 🔐

1. **Перехват данных (Man-in-the-Middle):** Запросы или ответы могут быть перехвачены злоумышленниками в процессе передачи.
2. **Утечка токенов авторизации:** Хранение токенов в небезопасных местах (например, `localStorage`) может привести к компрометации данных.
3. **Избыточное количество прав доступа:** Направление запросов с широкими правами может открывать доступ к ресурсам, которым пользователь не должен обладать.
4. **Инъекции:** Например, передача вредоносных данных в теле запроса.

---

### Основные рекомендации по защите API с фронтенда 🛡️


#### 1. Храните токены безопасно

Часто для авторизации используются токены (например, JWT). Frontend-разработчики должны знать, где хранить такие данные в браузере.

**Рекомендуемое место:**  
- `HttpOnly Secure Cookies` (устанавливаются сервером): это самый безопасный способ.

**Нерекомендуемое место:**  
- `localStorage`: токены могут быть доступны с помощью XSS-атаки.
- `sessionStorage`: аналогично `localStorage`, но токен пропадает после перезагрузки страницы.

**Пример правильной передачи токенов:**
```typescript
// Установите cookie на сервере с такими атрибутами:
res.cookie("ACCESS_TOKEN", "your_secure_token", {
  httpOnly: true,
  secure: true, // Только для HTTPS
  sameSite: "Strict", // Ограничение доступа для межсайтовых запросов
});
```

Для доступа к защищённым API используйте токен из cookies (на сервере). Ваш фронтенд не должен явно передавать токен.

---

#### 2. Минимизируйте передачу чувствительных данных

Ограничьте данные, отправляемые через запросы и сохраняемые в браузере. Frontend-должен отправлять только необходимую информацию, чтобы минимизировать возможные уязвимости.

**Плохая практика:**
Отправка всех пользовательских данных:
```typescript
const user = {
  id: 123,
  name: "John Doe",
  password: "mypassword123",
};

fetch("/api/user/data", {
  method: "POST",
  body: JSON.stringify(user),
});
```

**Хорошая практика:**
Отправляйте только минимально необходимый набор данных:
```typescript
const user = {
  id: 123,
  name: "John Doe",
};

fetch("/api/user/data", {
  method: "POST",
  body: JSON.stringify(user),
});
```

---

#### 3. Используйте CORS правильно

CORS (Cross-Origin Resource Sharing) конфигурация контролирует, откуда браузер может отправлять запросы. Хотя конфигурация CORS — задача сервера, фронтенд-разработчикам важно понимать, что запросы необходимо отправлять с корректным происхождением (origin).

**Пример корректной настройки запроса:**
```typescript
const fetchData = async () => {
  const response = await fetch("https://api.example.com/data", {
    credentials: "include", // Передача cookies
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(data);
};
```

---

#### 4. Валидация данных изменения

Для обеспечения безопасности клиентской части приложения проверяйте, что введённые пользователем данные соответствуют ожиданиям.

**Плохая практика:**
Использование непроверенного пользовательского ввода в запросах.
```typescript
const updateUser = async (userData: any) => {
  await fetch("/api/user/update", {
    method: "POST",
    body: JSON.stringify(userData), // Без проверки
  });
};
```

---

#### 5. Обновляйте библиотеки и зависимости

Небезопасные или устаревшие библиотеки для работы с запросами (например, устаревший `axios`) могут стать источником уязвимостей.

**Советы:**
- Регулярно проверяйте уязвимости через `npm audit` или `yarn audit`.
- Обновляйте библиотеки клиента (например, React, axios) сразу после выхода новых мажорных версий.

---

### Пример: Реализация защищённого API-взаимодействия

Ниже приведён пример, который учитывает все рекомендации:

```typescript
import DOMPurify from "dompurify";
import * as yup from "yup";

const apiUrl = "https://api.example.com";

const UserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

const fetchWithCsrf = async (endpoint: string, data: any) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))?.split("=")[1];
    
  const sanitizedData = {
    ...data,
    name: DOMPurify.sanitize(data.name), // Санитизация пользовательских данных
  };

  return await fetch(`${apiUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "",
    },
    body: JSON.stringify(sanitizedData),
  });
};

const updateUser = async (userData: any) => {
  try {
    await UserSchema.validate(userData);
    const response = await fetchWithCsrf("/user/update", userData);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error);
  }
};
```

---

### Выводы 📌
 
1. ✅ Храните токены в `HttpOnly Secure Cookies`.  
2. ✅ Ограничивайте объём передаваемых данных, чтобы снизить риск утечек.  
3. ✅ Проверяйте пользовательские данные перед запросами. Используйте библиотеки вроде `yup` или `zod`.  
4. ✅ Настройте CORS и должным образом добавляйте `credentials` в запросы.  
5. ✅ Регулярно обновляйте зависимости, чтобы избежать связанных с ними уязвимостей.  
