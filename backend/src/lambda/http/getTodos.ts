import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { listTodos } from "../../businessLogic/todos";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const logger = createLogger("getTodos");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Event: ", { event });
    const listTodosResult = await listTodos(getUserId(event));

    if (listTodosResult.Items.length !== 0)
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: listTodosResult.Items,
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
