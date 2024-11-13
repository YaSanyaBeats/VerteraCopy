# Указываем базовый образ Node.js
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем проект
RUN npm run build

# Используем nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем собранные файлы из предыдущего образа в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
