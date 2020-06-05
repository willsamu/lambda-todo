import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { listTodos } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";

const logger = createLogger("getTodos");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Event: ", { event });
    // TODO: Get all TODO items for a current user

    // const jwtToken: string = getToken(event.headers.Authorization);
    // FIXME: Mocked Data
    const jwtToken = "helloWorld";

    const listTodosResult = await listTodos(jwtToken);
    if (listTodosResult.Items.length !== 0)
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...listTodosResult,
        }),
      };

    return {
      statusCode: 404,
      body: "",
    };
  },
);

handler.use(
  cors({
    credentials: true,
  }),
);
