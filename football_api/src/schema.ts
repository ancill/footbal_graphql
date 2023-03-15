export const typeDefs = /* GraphQL */ `
  type Competition {
    id: ID!
    name: String!
    code: String!
    areaName: String!
  }

  type Team {
    id: ID!
    name: String!
    tla: String!
    shortName: String!
    areaName: String!
    address: String
    players: [Player]
    coach: Coach
  }

  type Player {
    id: ID!
    name: String!
    position: String!
    dateOfBirth: String!
    nationality: String!
  }

  type Coach {
    id: ID!
    name: String!
    dateOfBirth: String
    nationality: String
  }

  type Query {
    players(leagueCode: String!, teamName: String): [Player]
    team(name: String!, withPlayers: Boolean = false): Team
  }

  type Mutation {
    importLeague(leagueCode: String!): Competition
  }

  scalar DateTime
`
