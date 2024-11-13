# Указываем базовый образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если он есть)
COPY package.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем остальные файлы проекта
COPY . .

# Устанавливаем переменные окружения
ENV NODE_ENV=production

# Открываем порт (например, 4000, если ваш сервер использует этот порт)
EXPOSE 4000

# Запускаем сервер
CMD ["node", "index.js"]
