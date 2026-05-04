import { roleTypes } from "../../DB/model/User.model.js";
import { changeRoles } from "./user.service.js";



export const endpoint= {
    changeRoles :[roleTypes.admin , roleTypes.user]
}