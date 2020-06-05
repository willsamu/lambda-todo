import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";

class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODO_TABLE,
  ) {}

  async createTodo(todoInput: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todoInput,
      })
      .promise();
    return todoInput;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new AWS.DynamoDB.DocumentClient();
}

export default TodoAccess;
