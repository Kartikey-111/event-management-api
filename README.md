# 🎉 Event Management REST API

A RESTful API to manage events and user registrations built using **Node.js**, **Express**, and **PostgreSQL**.

## 🚀 Features
- Create & view events
- Register users (with duplicate & capacity checks)
- Cancel registrations
- View upcoming events (sorted)
- Get event statistics (total/remaining/percentage)

## 📦 Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/your-username/event-management-api.git
cd event-management-api
npm install
```

### 2. Configure Environment
Update `.env` with your PostgreSQL config:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=eventdb
```

### 3. Create Tables
Run `db/schema.sql` in your PostgreSQL client (e.g., pgAdmin):
```sql

```

### 4. Run the Server
```bash
npm start
```

## 🛠️ API Endpoints

### ➕ Create Event
```http
POST /api/v1/events
```
**Body**:
```json
{
  "title": "Tech Conference",
  "datetime": "2025-07-30T15:00:00.000Z",
  "location": "Delhi",
  "capacity": 500
}
```

### 👥 Register for Event
```http
POST /api/v1/events/:id/register
```
**Body**:
```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

### ❌ Cancel Registration
```http
DELETE /api/v1/events/:id/cancel
```
**Body**:
```json
{
  "email": "alice@example.com"
}
```

### 📋 Get Event Details
```http
GET /api/v1/events/:id
```
Returns full event + registered users

### 📅 Upcoming Events
```http
GET /api/v1/events/upcoming
```
Returns sorted upcoming events

### 📊 Event Stats
```http
GET /api/v1/events/stats/:id
```
Returns:
```json
{
  "total": 120,
  "remaining": 380,
  "percentage": "24.00"
}
```

## 🧠 Validations
- No duplicate registrations
- Cannot register for past events
- Max 1000 capacity per event
- Clean error messages

---

### 👨‍💻 Author
- Kartikey Mishra
- Built as part of a backend internship challenge
