import { gql } from 'apollo-server';

const typeDefs = gql`
  type Repository {
    name: String
    size: Int
    owner: Owner
  }

  type Owner {
    login: String
  }

  type RepositoryDetails {
    name: String
    size: Int
    owner: Owner
    isPrivate: Boolean
    numberOfFiles: Int
    ymlFileContent: String
    activeWebhooks: [Webhook]
    error: String
  }

  type Webhook {
    id: Int
    name: String
  }

  type Query {
    repositories: [Repository]
    repositoryDetails(names: [String!]!): [RepositoryDetails]
  }
`;

export default typeDefs;
