export type Framework = "nestjs" | "springboot";
export interface BoilerplateConfig {
  framework: Framework;
  title: string;
  description: string;
  version: string;
  author: string;
  defaultPackages: string[];
  optionalPackages: {
    [feature: string]: string[];
  };
  folderResponsibilities: {
    [zone: string]: string;
  };
  fileTemplates: {
    [relativePath: string]: string;
  };
}

export const boilerplateConfigs: Record<Framework, BoilerplateConfig> = {
  nestjs: {
    framework: "nestjs",
    title: "NestJS Production Boilerplate",
    description:
      "Production-grade starter with full setup for APIs, services, jobs, APM/logs, testing, and security best practices.",
    version: "1.0.0",
    author: "Suresh Konakanchi",
    defaultPackages: [
      "@nestjs/core",
      "@nestjs/common",
      "@nestjs/platform-express",
      "reflect-metadata",
      "rxjs",
      "dotenv",
      "winston",
      "@nestjs/swagger",
      "helmet",
      "cookie-parser",
      "class-validator",
      "class-transformer",
      "compression",
      "@nestjs/config",
    ],
    optionalPackages: {
      orm: ["prisma"],
      security: ["@nestjs/jwt", "passport", "argon2", "bcrypt"],
      background: ["@nestjs/bullmq", "bullmq", "node-cron"],
      redis: ["ioredis", "@nestjs/cache-manager", "@nestjs/redis"],
      tracing: ["@opentelemetry/api", "@opentelemetry/sdk-node"],
      docs: ["@nestjs/swagger"],
    },
    folderResponsibilities: {
      "src/": "Main application source folder",
      "src/api/": "REST API modules with controller, service, DTO, module",
      "src/api/{module}/": "Contains controller, service, module, transform files",
      "src/api/{module}/dto/": "DTOs with validation and Swagger decorators",
      "src/background/": "Background jobs, Cron jobs and queue handlers",
      "src/background/queues/": "Queue definitions and processors",
      "src/background/crons/": "Cron job definitions",
      "src/background/queues/{queue}/": "Contains .events.ts, .module.ts, .service.ts, .processor.ts, .queue.ts",
      "src/service/": "Internal services like profanity-check, AI service etc.",
      "src/common/":
        "Shared DTOs, decorators, enums, filters, utils, exceptions",
      "src/config/": "Environment config and validation setup",
      "src/db/": "ORM-based database access modules",
      "src/interceptors/": "Custom interceptors for logging, caching, etc.",
      "src/middlewares/": "Middleware for cookies, trace-id, metrics",
      "src/logger/": "Custom logger based on Winston",
      "scripts/": "Docker scripts, APM/log config files, certs etc.",
      "test/": "Unit and e2e tests using jest",
    },
    fileTemplates: {
      "src/main.ts":
        "Bootstraps Nest app, CORS, Swagger, Helmet, interceptors, global pipes, ENV-based setup",
      "src/app.module.ts":
        "Registers all major modules (API, config, queues, cache, etc.)",
      "src/api/user/user.controller.ts": "// TODO: Define REST endpoints for user",
      "src/api/user/user.service.ts": "// Logic for user-related actions",
      "src/api/user/user.module.ts": "// Nest module for user",
      "src/api/user/user.transform.ts": "// Output transformation logic",
      "src/api/user/dto/sample.dto.ts": "// Class-validator + Swagger DTO",
      "src/background/queues/email/email-queue.events.ts": "// Events for email queue",
      "src/background/queues/email/email-queue.module.ts": "// Module registration",
      "src/background/queues/email/email-queue.service.ts": "// Worker-side service logic",
      "src/background/queues/email/email.processor.ts": "// BullMQ processor",
      "src/background/queues/email/email.queue.ts": "// Queue producer for email jobs",
      "src/config/env.config.ts": "Environment schema as TypeScript types",
      "src/config/env-config.module.ts": "Loads config using Joi & dotenv",
      "src/db/user/user.repository.ts":
        "Handles database interactions for users",
      "src/db/user/user-db.service.ts":
        "Handles database omits, object formations for users",
      "src/db/db.service.ts":
        "Database connection and Prisma client setup",
      "src/db/db.module.ts": "Database module for Prisma client",
      "src/interceptors/logging.interceptor.ts":
        "Logging interceptor for incoming requests",
      "src/interceptors/cache.interceptor.ts":
        "Caching interceptor for GET requests",
      "src/interceptors/transform.interceptor.ts":
        "Transform interceptor for outgoing responses",
      "src/interceptors/metrics.interceptor.ts":
        "Metrics interceptor for incoming requests",
      "src/interceptors/exception.interceptor.ts":
        "Exception interceptor for error handling",
      "src/logger/logger.service.ts": "Winston logger + circuit breaker setup",
      "src/logger/logger.module.ts": "Winston logger module",
      "docker-compose.yml":
        "Sets up Redis, DB, Prometheus, Grafana, Loki, Promtail, etc.",
        "README.md": "Starter instructions and feature coverage",
      ".gitignore": "Ignore dist, node_modules, env files",
      ".prettierrc": "Prettier formatting rules",
      ".editorconfig": "Cross-editor consistency rules",
      ".eslintrc.js": "Linting for TypeScript + Nest",
      ".eslintignore": "Ignore dist, node_modules, env files",
      "jest.config.ts": "Testing config for unit tests",
      "jest.e2e.config.ts": "Testing config for e2e tests",
      "tsconfig.json": "TypeScript config for Nest",
      "tsconfig.build.json": "TypeScript build config",
      ".env.example": "Example environment variables",
      "nest-cli.json": "Nest CLI config",
      "package.json": "NPM packages and scripts",
    },
  },

  springboot: {
    framework: "springboot",
    title: "Spring Boot Microservice Starter",
    description:
      "Starter template for microservices using Spring Boot with queues, security, APM/logging, and background jobs.",
    version: "1.0.0",
    author: "Suresh Konakanchi",
    defaultPackages: [
      "spring-boot-starter-web",
      "spring-boot-starter-security",
      "spring-boot-starter-data-jpa",
      "spring-boot-starter-actuator",
    ],
    optionalPackages: {
      queue: ["spring-kafka", "lettuce", "spring-boot-starter-amqp"],
      db: ["postgresql", "mysql"],
      logging: ["logback", "opentracing", "micrometer", "prometheus"],
    },
    folderResponsibilities: {
      "main/java/java/com/example/app/controller/": "All REST endpoints",
      "main/java/java/com/example/app/service/": "Business logic layer",
      "main/java/java/com/example/app/repository/": "Database access layer",
      "main/java/java/com/example/app/config/": "Security, CORS, Swagger config",
      "main/java/java/com/example/app/dto/": "Data transfer objects",
      "main/java/java/com/example/app/exception/": "Custom exceptions and handlers",
      "main/java/java/com/example/app/aspect/": "AOP-based interceptors/loggers",
      "main/resources/": "application.properties, DB schema",
    },
    fileTemplates: {
      "main/java/java/com/example/app/Application.java": "Bootstraps Spring Boot app",
      "main/resources/application.properties": "Port, DB, cache, tracing setup",
      "main/java/java/com/example/app/config/SecurityConfig.java":
        "Security config (JWT/Auth/CORS)",
    },
  },
};
