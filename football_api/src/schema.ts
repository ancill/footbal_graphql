export const typeDefs = /* GraphQL */ `
  type Mutation {
    createDraft(authorEmail: String!, data: PostCreateInput!): Post
    deletePost(id: Int!): Post
    incrementPostViewCount(id: Int!): Post
    signupUser(data: UserCreateInput!): User!
    togglePublishPost(id: Int!): Post
    addProfileForUser(bio: String, userUniqueInput: UserUniqueInput): Profile
  }

  type Post {
    author: User
    content: String
    createdAt: DateTime!
    id: Int!
    published: Boolean!
    title: String!
    updatedAt: DateTime!
    viewCount: Int!
  }

  input PostCreateInput {
    content: String
    title: String!
  }

  input PostOrderByUpdatedAtInput {
    updatedAt: SortOrder!
  }

  type Query {
    allUsers: [User!]!
    draftsByUser(userUniqueInput: UserUniqueInput!): [Post]
    feed(
      orderBy: PostOrderByUpdatedAtInput
      searchString: String
      skip: Int
      take: Int
    ): [Post!]!
    postById(id: Int): Post
  }

  enum SortOrder {
    asc
    desc
  }

  type User {
    email: String!
    id: Int!
    name: String
    posts: [Post!]!
    profile: Profile
  }

  input UserCreateInput {
    email: String!
    name: String
    posts: [PostCreateInput!]
  }

  input UserUniqueInput {
    email: String
    id: Int
  }

  type Profile {
    id: ID!
    bio: String
    user: User
  }

  scalar DateTime
`
