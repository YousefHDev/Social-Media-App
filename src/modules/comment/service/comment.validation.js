import joi from 'joi';
import { generalfields } from '../../../middleware/validation.middleware.js';

export const createComment = joi.object().keys({
    postId:generalfields.id.required(),
    commentId:generalfields.id,
    content: joi.string()
        .min(2)
        .max(50000)
        .trim()
        .required(),
    file: joi.array()
        .items(generalfields.file)
        .max(2) 
}).or('content', 'file');

export const updateComment = joi.object().keys({
    postId:generalfields.id.required(),
    content: joi.string()
        .min(2)
        .max(50000)
        .trim()
        .required(),
    file: joi.array()
        .items(generalfields.file)
        .max(2) 
}).or('content', 'file');

export const freezeComment = joi.object().keys({
    postId:generalfields.id.required(),
    content: joi.string() 
}).required();