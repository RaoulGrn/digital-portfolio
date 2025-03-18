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


## Demo pics

### Landing Page

<img src="https://github.com/user-attachments/assets/a593972a-aecd-44c2-9379-525eea4a9ecf" width="100%" alt="Landing Page">
<img src="https://github.com/user-attachments/assets/23d1d363-c3cc-4239-9911-6aa7120cecd8" width="30%" alt="Login Page Desktop">
<img src="https://github.com/user-attachments/assets/bd07453d-0182-4e52-a6e4-ca20a93b8182" width="30%" alt="Login Page Mobile">

### Login Page

<img src="https://github.com/user-attachments/assets/c1873685-f69e-4d07-ae8e-dc476e4ef874" width="100%" alt="Sign Up Page Continued Desktop">
<img src="https://github.com/user-attachments/assets/12b8ba62-7a53-41a9-a0a4-ac52cdeead60" width="30%" alt="Sign Up Page Continued Mobile">

### Sign Up Page

<img src="https://github.com/user-attachments/assets/fdfd6e64-a176-41e1-9523-b4a6d766d41d" width="100%" alt="Sign Up Confirmation Desktop">
<img src="https://github.com/user-attachments/assets/d0858ef3-6263-418f-bc52-c920938a8286" width="30%" alt="Sign Up Confirmation Mobile">

### Projects Page

<img src="https://github.com/user-attachments/assets/36e1e2ab-28eb-4e43-9ef2-81abc2fc4077" width="100%" alt="Projects Page Desktop">
<img src="https://github.com/user-attachments/assets/7fe22c01-09de-4197-a600-25a829c4aeb7" width="100%" alt="Projects Page Mobile">
<img src="https://github.com/user-attachments/assets/93f03292-4333-4537-b591-5d5c3d6aa95e" width="100%" alt="Project Details Desktop">
<img src="https://github.com/user-attachments/assets/bc96655c-519c-436c-b7f7-f6c3c8473be5" width="100%" alt="Project Details Mobile">
<img src="https://github.com/user-attachments/assets/2aa61367-892f-4af3-98f6-83663ce39358" width="100%" alt="Add Project Desktop">
<img src="https://github.com/user-attachments/assets/f3696561-5187-4332-ad99-c1e6cc766f02" width="30%" alt="Add Project Mobile">
<img src="https://github.com/user-attachments/assets/d55e63ac-b19e-4ef6-9a54-2dca48c243e5" width="30%" alt="Edit Project Desktop">
<img src="https://github.com/user-attachments/assets/a530da79-23c1-4b72-8794-91e31ae6c3a4" width="30%" alt="Edit Project Mobile">
<img src="https://github.com/user-attachments/assets/0523e537-ffc2-4a09-b861-f99e93ee9875" width="30%" alt="Delete Project Confirmation Desktop">
<img src="https://github.com/user-attachments/assets/cd085e83-1912-4ed4-a096-22907d9541b9" width="30%" alt="Delete Project Confirmation Mobile">
<img src="https://github.com/user-attachments/assets/bd2cb781-72b0-4ce8-a4cf-156a89417e41" width="30%" alt="Project Image Fullscreen">

### Edit Profile Page

<img src="https://github.com/user-attachments/assets/523f738e-d574-47c3-a36e-1b8ee0261322" width="100%" alt="Edit Profile Desktop">
<img src="https://github.com/user-attachments/assets/69c6290e-9e36-4780-a72f-977ea87d5958" width="30%" alt="Edit Profile Mobile">

### Discover Page

<img src="https://github.com/user-attachments/assets/62d90adf-a2f9-4148-a1f1-700dc9b008a1" width="100%" alt="Discover Page Desktop">
<img src="https://github.com/user-attachments/assets/6b7e5818-6639-4146-a9e4-c0e75b9ad0bb" width="100%" alt="Discover Page Mobile">
<img src="https://github.com/user-attachments/assets/e8564f10-6e4c-416b-b989-c2b66a9ac6e1" width="30%" alt="Discover Page Continued">

### Other User's Project Page

<img src="https://github.com/user-attachments/assets/70e9c512-c07d-4a9f-b9aa-940501028a99" width="80%" alt="Other User's Project Page Desktop">
<img src="https://github.com/user-attachments/assets/920cbc29-2ba1-4d03-b70c-9dde732dc501" width="80%" alt="Other User's Project Page Mobile">
<img src="https://github.com/user-attachments/assets/0ecc4d6f-3c54-4486-b41c-2db6d92927a9" width="30%" alt="Other User's Project Details Desktop">
<img src="https://github.com/user-attachments/assets/8a12cce1-20fb-43f0-976b-07f647774992" width="30%" alt="Other User's Project Details Mobile">
<img src="https://github.com/user-attachments/assets/530aa98d-5a5a-4b0a-95e5-0c72cfc7906c" width="30%" alt="Other User's Project Image Fullscreen">




