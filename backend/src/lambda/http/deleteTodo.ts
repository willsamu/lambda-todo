import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../utils";
import { deleteTodo } from "../../businessLogic/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const result = await deleteTodo(todoId, userId);

    if (result)
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
