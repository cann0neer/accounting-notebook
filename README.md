# Accounting notebook API

RESTful API emulated the financial transactions logic (debit and credit).

## Features
* Write/Read locks for transactions
* In-memory storage as persistence
* Single financial account


## How To Install
```bash
npm install
```

## Getting Started
```bash
npm start
```

API is available on the base url - /api.
All endpoints:
* GET /
* GET /transactions
* GET /transactions/:id
* POST /transactions
```
