import { GraphQLObjectType, GraphQLString } from "graphql";

export const ImageType = new GraphQLObjectType({
    name: "ImageType",
    fields: {
        secure_url: { type: GraphQLString },
        public_id: { type: GraphQLString },
    },
});