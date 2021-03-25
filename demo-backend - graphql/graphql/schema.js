const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Post
{
    id:ID!
    title:String!
    content:String!
    creator:User!
    createdAt:String!
}

type User
{
    id:ID!
    email:String!
    name:String!
    password:String!
    status:String!
    posts:[Post!]!
}

input UserInputData
{
    email:String!
    name:String!
    password:String!
}

input PostInputData
{
    title:String!
    content:String!
}

type UserData
{
    userId:Int!
    token:String!
}

type PostsOutputData
{
    posts:[Post!]!
    totalItems:Int!
}

type RootMutation
{
    signUp(userInput:UserInputData):User!
    addPost(postInput:PostInputData):Post!
    updatePost(id:Int!,postInput:PostInputData):Post!
    deletePost(id:Int!):Boolean
    updateStatus(status:String!):User!
}

type RootQuery{
    getUser:User!
    getPost(id:Int!):Post!
    getPosts(page:Int!):PostsOutputData
    login(email:String!,password:String!): UserData!
}

schema {
    query:RootQuery
    mutation: RootMutation
  }

`);