import { GraphQLObjectType , GraphQLSchema , GraphQLString } from 'graphql'
import * as postGraphController from './post/post.graph.controller.js'

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "SocialAppQuery",
      description: "main application query",
      fields: {
        ...postGraphController.query
      }
    })
  });