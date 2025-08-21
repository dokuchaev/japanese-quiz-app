# Быстрая настройка Formspree (5 минут)

## Шаг 1: Создание формы
1. Перейдите на https://formspree.io/
2. Нажмите "Get Started" или "Sign Up"
3. Войдите через Google/GitHub или создайте аккаунт

## Шаг 2: Получение Form ID
1. После входа нажмите "New Form"
2. Введите название: "Japanese Quiz Feedback"
3. Скопируйте Form ID (например: `xrgjqjqj`)

## Шаг 3: Настройка в коде
1. Откройте файл `src/components/ContactModalFormspree.jsx`
2. Найдите строку 28 и замените `YOUR_FORM_ID` на ваш Form ID:

```javascript
const response = await fetch('https://formspree.io/f/mzzvqlgn', {
```

## Шаг 4: Настройка уведомлений
1. В Formspree Dashboard найдите вашу форму
2. Перейдите в "Settings" → "Notifications"
3. Добавьте email: `dmitry.nsaa@gmail.com`

## Готово! 🎉
Теперь форма будет отправлять сообщения на ваш email.

## Тестирование
1. Откройте сайт
2. Нажмите кнопку "✉️ Обратная связь"
3. Заполните и отправьте тестовое сообщение
4. Проверьте email






