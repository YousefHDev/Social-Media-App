import * as dbservice from '../../../DB/db.service.js'
import { postmodel } from "../../../DB/model/post.model.js";


export const postlist =async (parent, args) => {
    const posts = await dbservice.find({model:postmodel , populate:[{path:'createBy'}]})
    return {message : "Done" , statusCode:200 , data : posts}
  }