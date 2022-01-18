# Compass Wallet

Api de gestão de carteira criptomoedas desenvolvida durante o período de treinamento de Shadows. A API permite criar, remover, consultar, depositar e sacar valores de uma carteira, assim como realizar transferências para outras carteiras e consultar essas transações.

[![GitHub issues](https://img.shields.io/github/issues/JuniorZilles/compass-wallet-typeorm.svg)](https://GitHub.com/JuniorZilles/compass-wallet-typeorm/issues/)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/JuniorZilles/compass-wallet-typeorm.svg)](https://GitHub.com/JuniorZilles/compass-wallet-typeorm/pull/)
[![GitHub contributors](https://img.shields.io/github/contributors/JuniorZilles/compass-wallet-typeorm.svg)](https://GitHub.com/JuniorZilles/compass-wallet-typeorm/graphs/contributors/)
[![GitHub license](https://img.shields.io/github/license/JuniorZilles/compass-wallet-typeorm.svg)](https://github.com/JuniorZilles/compass-wallet-typeorm/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/JuniorZilles/compass-wallet-typeorm.svg)](https://GitHub.com/JuniorZilles/compass-wallet-typeorm/releases/)


## Info

<p align="center">
   <img src="http://img.shields.io/static/v1?label=Node&message=16.12.0&color=green&style=for-the-badge&logo=node.js"/>
   <img src="http://img.shields.io/static/v1?label=NestJS&message=4.17.1&color=ed2945&style=for-the-badge&logo=nestjs"/>
   <img src="http://img.shields.io/static/v1?label=eslint&message=8.6.0&color=4B32C3&style=for-the-badge&logo=eslint"/>
   <img src="http://img.shields.io/static/v1?label=Typescript&message=4.5.4&color=blue&style=for-the-badge&logo=typescript"/>
   <img src="http://img.shields.io/static/v1?label=Postgres&message=14.1&color=blue&style=for-the-badge&logo=postgreSQL"/>
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=yellow&style=for-the-badge"/>
</p>

## Summary

[Resources](#resources)

[Example for .ENV and .ENV.TEST](#example-for-.env-and-.env.test)

[Instaling](#instaling)

[Running the app](#running-the-app)

[Test](#test)

[Running with docker-compose](#running-with-docker-compose)

[Routes](#routes)

[License](#license)

## RESOURCES

- Node.JS v.16.12.0
- PostgreSQL v.14.1
- Dependencies:
    - @nestjs/common v.8.2.5
    - @nestjs/config v.1.1.6
    - @nestjs/core v.8.2.5
    - @nestjs/mapped-types *
    - @nestjs/platform-express v.8.2.5
    - @nestjs/swagger v.5.1.5
    - @nestjs/typeorm v.8.0.2
    - axios v.0.24.0
    - class-transformer v.0.5.1
    - class-validator v.0.13.2
    - moment v.2.29.1
    - nestjs-typeorm-paginate v.3.1.3
    - pg v.8.7.1
    - reflect-metadata v.0.1.13
    - rimraf v.3.0.2
    - rxjs v.7.5.2
    - swagger-ui-express v.4.3.0
    - typeorm v.0.2.41
- Development dependencies:
    - @nestjs/cli v.8.1.8
    - @nestjs/schematics v.8.0.5
    - @nestjs/testing v.8.2.5
    - @types/chance v.1.1.3
    - @types/express v.4.17.13
    - @types/jest v.27.4.0
    - @types/node v.17.0.8
    - @types/supertest v.2.0.11
    - @types/uuid v.8.3.4
    - @typescript-eslint/eslint-plugin v.5.9.1
    - @typescript-eslint/parser v.5.9.1
    - chance v.1.1.8
    - eslint v.8.6.0
    - eslint-config-airbnb-typescript v.16.1.0
    - eslint-config-prettier v.8.3.0
    - eslint-plugin-import v.2.25.4
    - eslint-plugin-prettier v.4.0.0
    - jest v.27.4.7
    - prettier v.2.5.1
    - source-map-support v.0.5.21
    - supertest v.6.2.1
    - ts-jest v.27.1.2
    - ts-loader v.9.2.6
    - ts-node v.10.4.0
    - tsconfig-paths v.3.12.0
    - typescript v.4.5.4
    - uuid v.8.3.2

## Example for .ENV and .ENV.TEST

```
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=postgres
TYPEORM_DATABASE=compass_wallet
TYPEORM_PORT=5432
TYPEORM_ENTITIES=src/**/*.entity.ts
TYPEORM_ENTITIES_DIR=src/api/entities
TYPEORM_MIGRATIONS=src/migrations/**/*.ts
TYPEORM_MIGRATIONS_DIR=src/migrations
COIN_API_URL=https://economia.awesomeapi.com.br/json/last/{coin}
```

## Requirements

[Node.js](https://nodejs.org/en/)

[PostgreSQL](https://www.postgresql.org/)

## Installation

```bash
# install packages
$ npm install
```

## Running the app

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
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running with docker-compose

```bash
# build services
docker-compose up -d
```

if you are running locally it should be found on `localhost:3000`
## Routes

1. docs
   - http://localhost:3000/docs-api

2. wallet
    - POST http://localhost:3000/api/v1/wallet
    - GET http://localhost:3000/api/v1/wallet
    - GET http://localhost:3000/api/v1/wallet/:address
    - PUT http://localhost:3000/api/v1/wallet/:address
    - DELETE http://localhost:3000/api/v1/wallet/:address

3. transaction
    - POST http://localhost:3000/api/v1/wallet/:address/transaction
    - GET http://localhost:3000/api/v1/wallet/:address/transaction


## License

The [MIT License]() (MIT)

Copyright :copyright: 2022 - Compass Wallet