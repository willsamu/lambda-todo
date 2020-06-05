import { v4 as uuid } from "uuid";

import TodoAccess from "../dataLayer/todoAccess";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { createLogger } from "../utils/logger";

const TodoAccessClient = new TodoAccess();
const logger = createLogger("createTodo");
export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  jwtToken: String, //TODO: Replace by JWTtoken interface!
) => {
  logger.info("Create Todo Recieved Data: ", {
    ...createTodoRequest,
    jwtToken,
  });
  // const userId: string = getUserId(jwtToken);
  // FIXME: Mocked Data
  const userId: string = "1";

  const todoId: string = uuid();

  return await TodoAccessClient.createTodo({
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest,
    // ? Maybe add URL
  });
};

export const listTodos = async (
  jwtToken: string, //TODO: Replace by JWTtoken interface!
) => {
  // const userId: string = getUserId(jwtToken);
  console.log(`JWT Token recieved: ${jwtToken}`);
  // FIXME: Mocked Data
  const userId: string = "1";
  logger.info(`Trying to list todos for user ${userId}..`);
  const listTodos = await TodoAccessClient.listTodos(userId);
  logger.info("Recieved:", { ...listTodos });
  return listTodos;
};

// MIIDCzCCAfOgAwIBAgIJZ2gH1TllW1WcMA0GCSqGSIb3DQEBCwUAMCMxITAfBgNVBAMTGGxhbWJkYS10b2RvLmV1LmF1dGgwLmNvbTAeFw0yMDA2MDUxNDA2MzFaFw0zNDAyMTIxNDA2MzFaMCMxITAfBgNVBAMTGGxhbWJkYS10b2RvLmV1LmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ2fwjFBms4yPPzDVaVsioUG9tn9EN7P1DrXRkKhUAIKC3OwDwETL0WFfGqQMGAHs7lVvR8WeK8Xj0LD1g1py1CbRSawoxFYF1qplPWzFEUBS9P9tTNXQPQCEnkEsNH37MtE94zybYvhLYjLhSPfRWwf3bhDt4uwcXGe6Q8q7AKLBZj4PIXdh0GGqiATHN0lirje5DJnpyazoTxg5r336tGWxZUdjKa7ty2msKslpgfQcA3yUdToeHS8Fmxjt3qa2HTIiI3oJLM3c3pSWXJNYbHly9omtfScLrGu9Y1a8gYse2jCaM3FoQunErhdSrKB3kE9nduSDVnq0CAwEAAaNCMEAwDwYDVR0TAQHBAUwAwEBzAdBgNVHQ4EFgQUHS7iAEOUgJ5MXdZjCFQXEwL7bEwDgYDVR0PAQHBAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAFBNdzhZDdwh9eyp394MgAHjXkBpHsbdznRCIP40G6oP7gdsTTcKdXRmtKsRkSyG2mdnBiy5kOUYCt698JI3VO7XfDwFxnvs1Ae7hmy85sDU7JU9kFoH12BjC11jY0Op5EitfpYmbBbcotJLrOL1AZ9jM3mEViNrfpgyoNGdzZaEYpi77zA6wdpCJnkm8BBjCXTQ3kQD1fRmSgMFWM8vBI7nDszqbrNHSbKWCxjfkZHrKv1jiwGMzrVVsc5YDtwgcr06bCVqMAYavb10sY1eqjvD9MCRC1S43AMAhZU7fonvgZTXG4NGHDdJHIIv4mXo0TS9Yj6JXMh39
