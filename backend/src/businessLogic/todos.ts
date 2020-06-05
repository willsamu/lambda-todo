import { v4 as uuid } from "uuid";

import TodoAccess from "../dataLayer/todoAccess";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { createLogger } from "../utils/logger";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const TodoAccessClient = new TodoAccess();
const logger = createLogger("Todos...");

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

export const updateTodo = async (
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string,
) => {
  logger.info("Updating todo...", { userId, todoId, updateTodoRequest });
  const { name, dueDate, done } = updateTodoRequest;
  const updateParams: Object = {
    Key: { userId, todoId },
    ExpressionAttributeValues: {
      ":n": name,
      ":t": dueDate,
      ":d": done,
    },
  };
  const result = await TodoAccessClient.updateTodo(updateParams);
  return result;
};

export const deleteTodo = async (todoId: string, userId: string) => {
  logger.info("Deleting todo", { userId, todoId });
  const result = await TodoAccessClient.deleteTodo({ userId, todoId });
  logger.info("Deleted Todo: ", { result });
  return result;
};

export const listTodos = async (userId: string) => {
  console.log(`JWT Token recieved: ${userId}`);
  logger.info(`Trying to list todos for user ${userId}..`);
  const listTodos = await TodoAccessClient.listTodos(userId);
  logger.info("Recieved:", { ...listTodos });
  return listTodos;
};
