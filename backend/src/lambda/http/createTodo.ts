import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
// import { getToken, getUserId } from "../auth/auth0Authorizer";
import { createTodo } from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  // const jwtToken: string = getToken(event.headers.Authorization);
  // FIXME: Mocked Data
  const jwtToken = "helloWorld";

  const newItem = await createTodo(newTodo, jwtToken);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
