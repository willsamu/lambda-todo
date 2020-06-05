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
