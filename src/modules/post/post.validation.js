import joi from 'joi'
import { generalfields } from '../../middleware/validation.middleware.js';


export const createPost = joi.object({
    content: joi.string().min(2).max(50000).trim(),
    file: joi.array().items(generalfields?.file || joi.object({})) // Ensure `file` is valid
}).or('content', 'file');


export const updatePost = joi.object({
    postId : generalfields.id.required(),
    content: joi.string().min(2).max(50000).trim(),
    file: joi.array().items(generalfields?.file || joi.object({})) // Ensure `file` is valid
}).or('content', 'file');


export const freezePost = joi.object({
    postId : generalfields.id.required(),
}).required()

export const unfreezePost = joi.object({
    postId : generalfields.id.required(),
}).required()

export const likePost = joi.object({
    action : joi.string().valid('like' , 'unlike'),
    postId : generalfields.id.required(),
}).required()

