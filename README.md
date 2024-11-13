
# Support Vertera

Проект **Support Vertera** - это система управления тикетами и поддержкой, реализованная на Node.js с использованием GraphQL на серверной стороне и React на клиентской стороне.

## Содержание

- [Описание](#описание)
- [Технологии](#технологии)
- [Требования](#требования)
- [Установка](#установка)
- [Запуск](#запуск)
- [Конфигурация](#конфигурация)
- [Работа с Docker](#работа-с-docker)
- [Создание дампа базы данных](#создание-дампа-базы-данных)

## Описание

Проект предоставляет функционал для управления тикетами, включает панель администратора и кураторов, а также поддерживает авторизацию пользователей и управление разрешениями. Интерфейс выполнен на React, а API на GraphQL.

## Технологии

- **Backend**: Node.js, GraphQL, MySQL
- **Frontend**: React, React Router
- **Docker**: для контейнеризации приложения и базы данных
- **Docker Compose**: для управления мультиконтейнерным приложением

## Требования

- Docker >= 20.10
- Docker Compose >= 1.29
- Node.js >= 14 (для локальной разработки)

## Установка

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/your-repo/support-vertera.git
   cd support-vertera
   ```

2. Создайте `.env` файлы в директориях `backend` и `frontend` с нужными переменными окружения.

### Пример `.env` файла для backend

Файл `backend/.env`:

```env
DB_HOST=mysql
DB_USER=help_vertera
DB_PASSWORD=your_password
DB_NAME=vertera
MYSQL_ROOT_PASSWORD=your_root_password
```

Файл `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8058
```

## Запуск

1. Соберите и запустите проект с помощью Docker Compose:

   ```bash
   docker-compose up -d
   ```

2. После запуска:

   - **Backend** будет доступен по адресу `http://localhost:8058`
   - **Frontend** будет доступен по адресу `http://localhost:8057`

## Конфигурация

В проекте используются два `.env` файла для настройки:

- `backend/.env` для сервиса MySQL и API
- `frontend/.env` для переменных окружения клиентской части

Параметры для MySQL должны быть заданы в `backend/.env`, а адрес API для фронтенда - в `frontend/.env`.

## Работа с Docker

- **Запуск контейнеров**:

  ```bash
  docker-compose up -d
  ```

- **Остановка контейнеров**:

  ```bash
  docker-compose down
  ```

- **Просмотр логов**:

  ```bash
  docker-compose logs -f
  ```

## Создание дампа базы данных

Для создания дампа базы данных MySQL используйте следующую команду:

```bash
docker exec -it mysql_container_name mysqldump -u root -p vertera > vertera_dump.sql
```

Замените `mysql_container_name` на имя контейнера с MySQL.

## Структура проекта

- **backend**: Серверная часть, реализованная на Node.js и GraphQL
- **frontend**: Клиентская часть на React
- **docker-compose.yml**: Файл для управления контейнерами

## Лицензия

Этот проект лицензирован на условиях MIT License.
