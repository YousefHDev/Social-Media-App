import { roleTypes } from "../../DB/model/User.model.js";


export const endpoint = {
    createPost : [roleTypes.user],
    freezePost : [roleTypes.user,roleTypes.admin],
    likePost : [roleTypes.user,roleTypes.admin]


}