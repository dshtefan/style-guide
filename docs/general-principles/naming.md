---
sidebar_position: 2
---

# Именование

В этом разделе рассматриваются конвенции именования и правила использования различных стилей.

## Конвенции для переменных, функций и компонентов

### Примеры именования в различных контекстах

**Переменные:**
  - Используйте **существительные** и **описательные названия**, отражающие содержание.
    ```tsx
    const userList = [];
    const isLoading = true;
    ```

**Функции:**
  - Используйте **глаголы** или **глагольные фразы**, описывающие действие.
    ```tsx
    function fetchUserData() {
      // логика функции
    }

    const calculateTotal = (items) => {
      // логика функции
    };
    ```

**Компоненты:**
  - Используйте **PascalCase** для именования React компонентов.
    ```tsx
    const UserProfile = () => {
      // компонент
    };

    export default UserProfile;
    ```

## Использование camelCase, PascalCase и snake_case

### Когда применять каждую конвенцию

- **camelCase:** Используется для **переменных** и **функций**.
    ```tsx
    const userName = "John Doe";
    function getUserName() {
      // функция
    }
    ```

- **PascalCase:** Используется для **React-компонентов**, **классов** и **типов**.
    ```tsx
    class UserService {
      // класс
    }

    type UserType = {
      name: string;
      age: number;
    };

    const UserCard = () => {
      // компонент
    };
    ```

- **snake_case:** Используется для **файлов** или **констант**.
    ```tsx
    const API_KEY = "your-api-key";

    // Файл: user_profile.tsx
    ```

### Примеры правильного и неправильного именования

**Неправильное именование:**
```tsx
const User_name = "John Doe"; // Использование snake_case для переменной
function GetUserName() { // PascalCase для функции
  // функция
}

const userprofile = () => { // camelCase для компонента
  // компонент
};
```

**Правильное именование:**
```tsx
const userName = "John Doe"; // camelCase для переменной

function getUserName() { // camelCase для функции
  // функция
}

const UserProfile = () => { // PascalCase для компонента
  // компонент
};
```
