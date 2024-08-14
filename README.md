### Digital Portofolio - Backend 

```Welcome to Your Digital Portfolio Management Application! This platform allows digital artists to manage and showcase their best creative work with ease. Whether you're a designer, artist, or digital creator, our platform offers a user-friendly interface to manage and display your portfolio.```
  
## Key Technologies and Dependencies

- MongoDB (via Mongoose v8.5.2): A NoSQL database for storing application data.
- Passport (v0.7.0): Authentication middleware for Node.js.
- JWT (@nestjs/jwt v10.2.0): JSON Web Token for secure authentication.
- Cloudinary (v2.4.0): Cloud service for image and video management.
- class-validator (v0.14.1) and class-transformer (v0.5.1): For DTO (Data Transfer Object) validation and transformation.

## Development Tools

- NestJS (v10.0.0): A progressive Node.js framework for building efficient and scalable server-side applications.
- TypeScript (v5.1.3): Typed superset of JavaScript that compiles to plain JavaScript.
- ESLint (v8.42.0): Tool for identifying and reporting on patterns in JavaScript/TypeScript.
- Jest (v29.7.0): JavaScript Testing Framework with a focus on simplicity.
- Prettier (v3.0.0): An opinionated code formatter.
- Postman (v11.8.0) - Software application that allows developers to test, document, and share APIs

## Installation


```bash
git clone
$ npm install
```
- Create .env file in root folder and write your credentials for cloudinary, your MONGODB connection string and your Jwt secret like in the picture
- https://cloudinary.com/ - it's free to make a starter account
  
<img src="https://github.com/user-attachments/assets/3a02d045-a8d6-43be-9e44-1fdf13d22b9e" width="50%">

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


