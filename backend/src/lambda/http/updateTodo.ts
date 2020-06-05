import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { getUserId } from "../utils";
import { updateTodo } from "../../businessLogic/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const result = await updateTodo(updatedTodo, todoId, userId);

    if (result)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      return {
        statusCode: 204,
        body: "",
      };

    return {
      statusCode: 409,
      body: "",
    };
  },
);

handler.use(
  cors({
    credentials: true,
  }),
);
