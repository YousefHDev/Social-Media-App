import { postmodel } from "../../../DB/model/post.model.js";
import * as dbService from '../../../DB/db.service.js';

export const likePost = async (parent, args) => {
    const { postId, authorization } = args;
    console.log({ postId, authorization });

    // Example: Find posts (you can add your logic here)
    const posts = await dbService.find({ model: postmodel });

    return { message: "Done", statusCode: 200, data: posts };
};