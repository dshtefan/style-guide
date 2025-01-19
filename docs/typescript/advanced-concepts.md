---
sidebar_position: 3
---

# Продвинутые концепции

Данный раздел посвящён более сложным аспектам TypeScript. Эти инструменты и подходы помогут писать масштабируемый, безопасный и легко поддерживаемый код.

---

### Дженерики

Дженерики (Generics) позволяют создавать переиспользуемые и гибкие структуры, которые работают с любым типом, сохраняя типовую безопасность.

#### Базовое использование
Дженерики позволяют параметризовать типы. Они особенно полезны в функциях, классах и интерфейсах.

**Пример: Дженерик в функции**
```typescript
function identity<T>(value: T): T {
  return value;
}

const result1 = identity<string>("Example"); // Явно указали тип
const result2 = identity(42); // Вывод типа через TypeScript
```

**Пример: Дженерик в интерфейсе**
```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

const userResponse: ApiResponse<{ id: string; name: string }> = {
  data: { id: "123", name: "John" },
  status: 200,
};
```

#### Ограничения

Вы можете ограничить дженерик, чтобы он работал только с определёнными типами или структурами.

**Пример: Ограничение через `extends`:**
```typescript
function logProperty<T extends { id: string }>(obj: T): void {
  console.log(obj.id);
}

logProperty({ id: "abc123", name: "Test" }); // ❌ Работает
logProperty({ name: "Test" }); // ❌ Ошибка: отсутствует свойство `id`
```

#### Паттерны использования
- ✅ Логика работы с коллекциями: массивы, мапы
- ✅ Типизация ответов API
- ✅ Переиспользуемые структуры данных

**Плохая практика:**
- Использовать дженерики без необходимости.
```typescript
// Плохо. Нет реальной потребности в параметре `T`.
function log<T>(value: T): void {
  console.log(value);
}
```

---

### Type Guards

Type Guards (Защита типов) — это методы или ключевые конструкции TypeScript, помогающие проверять и уточнять типы данных во время исполнения.

#### Встроенные Guards

TypeScript поддерживает автоматическое уточнение типов через условные конструкции.

**Пример: Проверка типа через `typeof`**
```typescript
function printId(id: string | number): void {
  if (typeof id === 'string') {
    console.log(`ID в строке: ${id.toUpperCase()}`);
  } else {
    console.log(`Числовой ID: ${id}`);
  }
}
```

#### Пользовательские Guards

Вы можете объявлять функции, возвращающие `val is Type`, чтобы создавать свои собственные проверки.

**Пример: Пользовательский Guard**
```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function handlePet(pet: Fish | Bird): void {
  if (isFish(pet)) {
    pet.swim(); // Тип теперь `Fish`
  } else {
    pet.fly(); // Тип теперь `Bird`
  }
}
```

#### Сужение типов

TypeScript позволяет уточнять типы данных внутри блоков.

**Пример: Через `in`**
```typescript
type Admin = { role: "admin"; permissions: string[] };
type User = { role: "user"; email: string };

function handleRole(person: Admin | User): void {
  if ("permissions" in person) {
    console.log(`Admin permissions: ${person.permissions}`);
  } else {
    console.log(`User email: ${person.email}`);
  }
}
```

**Плохая практика:**
- Пренебрежение проверкой типов при работе с union:
```typescript
function processValue(value: string | number): void {
  console.log(value.toUpperCase()); // Ошибка, так как `value` может быть number.
}
```

---

### Декораторы

Декораторы позволяют добавлять дополнительную функциональность к классам, методам или свойствам. Это мощная, но сложная концепция.

> ⚠️ Декораторы — это экспериментальная возможность. Следует внимательно учитывать поддержку браузеров и настройку проекта.

#### Классовые декораторы

Классовые декораторы добавляют поведение всему классу.

**Пример: Логирование класса**
```typescript
function LogClass(target: Function) {
  console.log(`Класс: ${target.name}`);
}

@LogClass
class Example {
  constructor() {
    console.log("Example instance created");
  }
}
```

#### Методы

Декораторы методов могут расширять (или заменять) поведение метода.

**Пример: Тайминг выполнения метода**
```typescript
function LogExecutionTime(
  target: Object, 
  propertyKey: string, 
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.time(propertyKey);
    const result = originalMethod.apply(this, args);
    console.timeEnd(propertyKey);
    return result;
  };
}

class Task {
  @LogExecutionTime
  run() {
    console.log("Task running...");
  }
}

const task = new Task();
task.run(); // Вывод: Task running..., Время выполнения
```

#### Свойства

Декораторы свойств позволяют изменить или проанализировать их поведение.

**Пример: Декоратор для настройки значений**
```typescript
function DefaultValue(value: any) {
  return function (target: Object, propertyKey: string): void {
    let _value = value;

    Object.defineProperty(target, propertyKey, {
      get: () => _value,
      set: (newValue) => {
        console.log(`Установка значения ${propertyKey}: ${newValue}`);
        _value = newValue;
      },
    });
  };
}

class Config {
  @DefaultValue("default value")
  public setting!: string; // `!` означает, что значение будет установлено позже.
}

const config = new Config();
console.log(config.setting); // Вывод: default value
config.setting = "new value"; // Лог: Установка значения setting: new value
```

---

### Практические рекомендации

1. ✅ **Дженерики**:
   - Используйте для создания переиспользуемого, гибкого кода.
   - Ограничивайте `T`, если это требуется, для обеспечения безопасности типов.

2. ✅ **Type Guards**:
   - Уточняйте типы с помощью встроенных конструкций или пользовательских Guards.
   - Избегайте работы с union без проверок.

3. ✅ **Декораторы**:
   - Применяйте только там, где это обеспечивает явную выгоду и упрощает архитектуру.
   - Аккуратно внедряйте декораторы для методов и свойств, чтобы не усложнять код.
