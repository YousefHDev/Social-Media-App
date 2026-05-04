import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { oneUserResponse } from "../../user/user.types.js";
import { ImageType } from "../../../utilies/app.types.share.js";


export const imageType = 
    new GraphQLObjectType({
        name: "ImageType",
        fields: {
            secure_url: { type: GraphQLString },
            public_id: { type: GraphQLString },
        },
    })


export const onePostResponse = new GraphQLObjectType({
    name: "onePostResponse",
    fields: {
        _id: { type: GraphQLID },
        content: { type: GraphQLString },
        attachments: {
            type: new GraphQLList(ImageType)
        },
        likes: { type: new GraphQLList(GraphQLID) },
        tags: { type: new GraphQLList(GraphQLID) },
        createdBy: { type: oneUserResponse },
        updatedBy: { type: GraphQLID },
        deletedBy: { type: GraphQLID },
        isDeleted: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        createdAt: { type: GraphQLString }
    },
});

export const postlist = new GraphQLObjectType({
    name: "postListResponse",
    fields: {
      message: { type: GraphQLString },
      statusCode: { type: GraphQLInt },
      data: {
        type: new GraphQLList(onePostResponse)
      }
    }
  })

  export const likelist = new GraphQLObjectType({
    name: "likeListResponse",
    fields: {
      message: { type: GraphQLString },
      statusCode: { type: GraphQLInt },
      data: {
        type: onePostResponse
      }
    }
  })
  