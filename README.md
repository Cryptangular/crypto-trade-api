# Crypto Trade API

Backend service for the Crypto Trade platform, built with NestJS.
Crypto Trade is a trading platform clone where users can browse market data, analyze charts, maintain a watchlist of favorite pairs, and execute test trades with virtual funds.

The platform runs on top of Binance Spot Testnet — a fully functional Binance test environment that provides virtual funds upon registration. All data is virtual — no real money is involved.

## Team

| Name              | Role                         | Github                                          |
| ----------------- | ---------------------------- | ----------------------------------------------- |
| Aleksei Drob      | Fullstack Engineer           | [aliakseidrob](https://github.com/aliakseidrob) |
| Alexandr Zhdanko  | Fullstack Engineer           | [Zhdko](https://github.com/Zhdko)               |
| Anatoliy Rubankov | Fullstack Engineer           | [anatolirub](https://github.com/anatolirub)     |
| Hanna Surmach     | Mentor and World's Best Boss | [khasekai](https://github.com/khasekai)         |
| Raman Kamarou     | Our secret weapon            | [PoMaKoM](https://github.com/PoMaKoM)           |

## Scripts

| Script                | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `npm run build`       | Compiles the NestJS application into the `dist/` directory.      |
| `npm run start`       | Starts the application in standard mode.                         |
| `npm run start:dev`   | Starts the application in watch mode for local development.      |
| `npm run start:debug` | Starts the application in debug mode with file watching enabled. |
| `npm run start:prod`  | Runs the compiled production build from `dist/main`.             |
| `npm run lint`        | Runs Biome checks across the codebase.                           |
| `npm run lint:fix`    | Runs Biome checks and applies automatic fixes.                   |
| `npm run format`      | Formats the project with Biome.                                  |
| `npm test`            | Runs tests with Vitest.                                          |
| `npm run test:run`    | Runs tests once without watch mode.                              |
| `npm run test:watch`  | Runs tests in watch mode.                                        |
| `npm run test:cov`    | Runs tests and generates a coverage report.                      |
| `npm run test:debug`  | Runs tests in debug mode with the Node inspector enabled.        |
| `npm run test:e2e`    | Runs end-to-end tests using `vitest-e2e.config.ts`.              |
| `npm run prepare`     | Sets up Husky Git hooks.                                         |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app locally

```bash
npm run start:dev
```

By default, the application is typically available at `http://localhost:3000/` unless overridden in the bootstrap code or environment configuration.

## Development workflow

- Use `npm run start:dev` for local development.
- Use `npm run build` to verify the project compiles successfully.
- Run `npm run lint` and `npm run format` before committing changes.
- Run `npm test` or `npm run test:run` for regular test execution.
- Run `npm run test:cov` to inspect test coverage.

## Build

Create a production build with:

```bash
npm run build
```

The build output is generated in the `dist/` directory.

To run the compiled application:

```bash
npm run start:prod
```

## Technologies

| Software   | Version |
| ---------- | ------- |
| NestJS     | 11.x    |
| TypeScript | 5.7.x   |
| Vitest     | 4.1.x   |
| Biome      | 2.4.x   |
| Husky      | 9.1.x   |

|

## Code quality

This project uses:

- Biome for linting and formatting.
- Vitest for unit and end-to-end testing.
- Husky and lint-staged for Git hooks and pre-commit checks.

Recommended local check before pushing changes:

```bash
npm run lint && npm run test:run
```
