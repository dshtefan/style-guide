---
sidebar_position: 3
---

# Оптимизация контента

**Оптимизация контента** делает ваш фронтенд быстрее, легче и эффективнее для пользователя. Основная цель — сократить размер загружаемых ресурсов и улучшить рендеринг страницы. В этом разделе мы рассмотрим лучшие практики и как применять их с использованием **Vite**.

---

### Почему это важно? 🌟

1. **Повышение производительности:** Быстрее загружающиеся страницы снижают показатель отказов и делают UX приятнее.
2. **SEO:** Google учитывает скорость загрузки при ранжировании сайтов.
3. **Доступность для мобильных пользователей:** Меньший вес контента — экономия трафика и времени.
4. **Экономия серверных ресурсов** (например, снижение нагрузки на хостинг).

---

### Основные аспекты оптимизации контента 📦

#### 1. Оптимизация изображений

Изображения, как правило, занимают больше всего места в загрузке страницы. Уменьшение их веса достигается через сжатие, использование современных форматов и ленивую загрузку.

**Хорошая практика:**
- Используйте форматы **WebP** или **AVIF** вместо устаревших **JPEG/PNG**.
- Активируйте **lazy loading** для изображений, чтобы не загружать их до появления в видимой области (viewport).

**Пример с `react` и `loading="lazy"`:**

```tsx
<img
  src="/images/example.webp"
  alt="Описание изображения"
  width="600"
  height="400"
  loading="lazy"
/>
```

🙅 **Плохая практика:** Использовать изображения слишком большого размера или неподходящих форматов:

```html
<img src="/images/large-image.jpg" alt="Несжатое изображение" />
```

**Подключение в Vite:**
С помощью плагина [vite-imagetools](https://github.com/JonasKruckenberg/imagetools), вы можете удобно обрабатывать изображения.

```bash
npm install -D @vitejs/plugin-vue imagetools
```

Добавьте этот плагин в `vite.config.ts` для автоматического создания оптимизированных версий изображений:

```ts
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [imagetools()],
  build: {
    assetsInlineLimit: 0, // Избегаем встраивания больших изображений в JS/CSS.
  },
});
```

Теперь вы можете указать параметры оптимизации прямо в пути к файлу:

```tsx
<img src="/images/example.jpg?format=webp&width=600" alt="Пример изображения" />
```

---

#### 2. Использование ленивой загрузки

Используйте ленивую загрузку для тяжелых элементов (компоненты, изображения, видео).

**Пример в React:**
Для компонентов, которые не отображаются сразу, используйте **React.lazy**:

```tsx
import React, { Suspense } from "react";

const Comments = React.lazy(() => import('./Comments'));

const App = () => (
  <div>
    <h1>Статья</h1>
    <Suspense fallback={<div>Загрузка...</div>}>
      <Comments />
    </Suspense>
  </div>
);
```

🙅 **Плохая практика:** Загружать все компоненты и ресурсы сразу, даже те, которые нужны только на вторичных экранах.

---

#### 3. Минификация и компрессия

Минификация удаляет лишние пробелы, комментарии и ненужные символы в ресурсах (`CSS`, `JS`, `HTML`). В Vite это работает из коробки!

**Пример настройки компрессии через Vite:**
Подключите плагин [vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression) для автоматического сжатия ресурсов (например, **Gzip**, **Brotli**).

```bash
npm install -D vite-plugin-compression
```

```ts
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [compression()],
});
```

---

#### 4. Оптимизация шрифтов

Шрифты могут замедлять загрузку страницы. Уменьшите их размер и настройте отображение.

1. Используйте шрифты в формате **WOFF2**.
2. Настройте `font-display: swap`, чтобы отображать системные шрифты, пока основной шрифт загружается.

**SCSS пример:**

```scss
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto.woff2') format('woff2');
  font-display: swap;
}

body {
  font-family: 'Roboto', sans-serif;
}
```

---

#### 5. Используйте CDN для больших ресурсов

Некоторые ресурсы, такие как изображения или видео, лучше хранить в **CDN** (Content Delivery Network).

**Пример с Vite:**
Вы можете настроить импорт внешних ресурсов через плагин, например [vite-plugin-cdn-import](https://github.com/originjs/vite-plugin-cdn-import):

```bash
npm install -D vite-plugin-cdn-import
```

Добавьте в `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import cdnImport from 'vite-plugin-cdn-import';

export default defineConfig({
  plugins: [
    cdnImport({
      modules: [
        {
          name: 'react',
          var: 'React',
          path: 'https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js',
        },
        {
          name: 'react-dom',
          var: 'ReactDOM',
          path: 'https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js',
        },
      ],
    }),
  ],
});
```

---

### Инструменты для проверки и улучшения 🚀

- **[Google Lighthouse](https://developers.google.com/web/tools/lighthouse)**  
  Проверяет производительность, SEO, а также скорость загрузки и рендеринга.
  
- **[Vite's build analyzer](https://github.com/vitejs/vite)**  
  Включите `--report` для подробного анализа бандла после сборки:

  ```bash
  vite build --report
  ```

- **[imagemin](https://github.com/imagemin/imagemin)**  
  Инструмент для оптимизации изображений перед добавлением их в проект.

---

### Общие ошибки 🚨

1. **Использование неподходящих форматов изображений.**  
   → Пример: PNG для фотографий вместо WebP.

2. **Неоптимизированные шрифты.**  
   → Все начертания загружаются, даже если используются только два.

3. **Отсутствие ленивой загрузки.**  
   → Все ресурсы загружаются сразу, замедляя страницу.

4. **Пренебрежение сжатием.**  
   → Сервер возвращает текстовые файлы без Gzip или Brotli.

---

### Выводы 🔑

1. **Используйте современные форматы — WebP и WOFF2.**  
2. **Лениво загружайте контент, чтобы быстрее загрузилась **Above The Fold** секция.**  
3. **Минифицируйте ресурсы на этапе сборки.**  
4. **Используйте плагины в Vite для сжатия и анализа бандла.**  
5. **Перенесите тяжелые элементы в CDN.**
