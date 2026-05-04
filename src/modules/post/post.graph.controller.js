import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import * as postQueryServices from'./service/postQueryServices.js'
import * as likemutationServices from'./service/post.mutation.services.js'
import * as postTypes from './types/post.types.js'


export const query = {
    postList: {
        type: postTypes.onePostResponse,
        resolve :postQueryServices.postlist
        
    },
    
};

export const mutation = {
    type:postTypes.likelist,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        authorization: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve:likemutationServices.likePost
};
