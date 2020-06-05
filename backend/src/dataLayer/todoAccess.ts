import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";

const tableName = process.env.TODO_TABLE;
const indexName = process.env.INDEX_NAME;
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

  async updateTodo(params: any): Promise<DocumentClient.UpdateItemOutput> {
    const { Key, ExpressionAttributeValues } = params;
    const updateResult = await this.docClient
      .update({
        TableName: tableName,
        Key,
        UpdateExpression: "set #n=:n, dueDate=:t, done=:d",
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues,
        ReturnValues: "UPDATED_NEW",
      })
      .promise();
    return updateResult;
  }

  async listTodos(userId: string): Promise<DocumentClient.QueryOutput> {
    const queryResult = await this.docClient
      .query({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    return queryResult;
  }
  async deleteTodo(Key: {
    todoId: string;
    userId: string;
  }): Promise<DocumentClient.DeleteItemOutput> {
    const deleteResult = await this.docClient
      .delete({
        TableName: tableName,
        Key,
      })
      .promise();
    return deleteResult;
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
