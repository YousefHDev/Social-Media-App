import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { ImageType } from "../../utilies/app.types.share.js";

export const oneUserResponse = new GraphQLObjectType({
    name: "oneUserResponse",
    fields: {
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        image :{type : ImageType},
        confirmEmailOTP: { type: GraphQLString },
        tempEmail: { type: GraphQLString },
        tempEmailOTP: { type: GraphQLString },
        resetPasswordOTP: { type: GraphQLString },
        phone: { type: GraphQLString },
        address: { type: GraphQLString },
        DOB: { type: GraphQLString },
        coverImages: { type: new GraphQLList(ImageType) },

gender: {
    type: new GraphQLEnumType({
        name: "genderTypes",
        values: {
            male: { value: "male" },
            female: { value: "female" },
        },
    }),
},
role: {
    type: new GraphQLEnumType({
        name: "roleTypes",
        values: {
            admin: { value: "admin" },
            superAdmin: { value: "superAdmin" },
            user: { value: "user" },
        }
    }),
},
provider: {
    type: new GraphQLEnumType({
        name: "providerTypes",
        values: {
            system: { value: "system" },
            google: { value: "google" },
        },
    }),
},

confirmEmail: { type: GraphQLBoolean },
isDeleted: { type: GraphQLBoolean },
changeCredentialsTime: { type: GraphQLString },
    },
});