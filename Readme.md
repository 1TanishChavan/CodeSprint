# Setup:

## Setup with Docker :

<details>

<summary>Setup with Docker</summary>

- Put your Gemini API and JWT key in "docker-compose.yml"

- For 1st time setup run below command

```
docker-compose up --build
```

- After that for running again run

```
docker-compose up db frontend backend
```

- User login email and password :
  - Admin :
    - Email : "admin@gmail.com"
    - Password : "1234"
  - Creator :
    - Email : "jane@gmail.com"
    - Password : "1234"
  - Solver :
    - Email : "john@gmail.com"
    - Password : "1234"

</details>

## Setup without Docker :

<details>
<summary>Setup without Docker</summary>

### Setup Backend:

```
cd backend
npm i
```

### Setup Database:

- postgres database

* Create .env file in backend folder like .env.sample
* Run this command

```
cd backend
db:setup
```

### Setup Frontend:

```
cd frontend
npm i
```

# Run Application

terminal 1

```
cd frontend
npm run start
```

terminal 2

```
cd backend
npm run dev
```

</details>
