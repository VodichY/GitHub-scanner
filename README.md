# GitHub Scanner

GitHub Scanner is a tool designed to scan and fetch detailed information about GitHub repositories. It uses Apollo Server and GraphQL to provide an API for retrieving repository data including files, webhooks, and more.

## Features
- Fetch basic repository details such as name, size, and owner.
- Retrieve detailed repository information including visibility, number of files, YAML file content, and active webhooks.

## Installation

To install the necessary dependencies, run:

`npm install`

## Building the Project

To build the project, use the following command:

`npm run build`

This command compiles the TypeScript code into JavaScript and outputs it in the dist directory.

## Running the Server

To start the server, use the following command:

`npm start`

This command starts the Apollo Server and listens for incoming GraphQL queries.

## Usage

After starting the server, you can use GraphQL Playground or any GraphQL client to query the API. The server will be available at http://localhost:4000 by default.

### Authentication

To interact with the GitHub API, you need to provide a GitHub token. This token should be included in the Authorization header of your GraphQL requests. Here's an example of how to include the token in your requests using GraphQL Playground:

1. Open GraphQL Playground.
2. Click on the "HTTP HEADERS" tab.
3. Add the following JSON object with your GitHub token:
  
{
  "Authorization": "token YOUR_GITHUB_TOKEN"
  }


## Example Queries

- Example query to fetch basic repository details:

```graphql
query {
  repositories {
    name
    size
    owner {
      login
    }
  }
}
```

- Example query to fetch detailed repository information:

```graphql
query {
  repositoryDetails(names: ["owner1/repo1", "owner2/repo2"]) {
    name
    size
    owner {
      login
    }
    isPrivate
    numberOfFiles
    ymlFileContent
    activeWebhooks {
      id
      name
    }
    error
  }
}
```
