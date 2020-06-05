import { v4 as uuid } from "uuid";

import TodoAccess from "../dataLayer/todoAccess";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { createLogger } from "../utils/logger";

const TodoAccessClient = new TodoAccess();
const logger = createLogger("createTodo");
export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  userId: string,
) => {
  logger.info("Create Todo Recieved Data: ", {
    ...createTodoRequest,
    userId,
  });

  const todoId: string = uuid();
  return await TodoAccessClient.createTodo({
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest,
  });
};

export const listTodos = async (userId: string) => {
  console.log(`JWT Token recieved: ${userId}`);
  logger.info(`Trying to list todos for user ${userId}..`);
  const listTodos = await TodoAccessClient.listTodos(userId);
  logger.info("Recieved:", { ...listTodos });
  return listTodos;
};
