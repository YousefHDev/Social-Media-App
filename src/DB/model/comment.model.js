
import mongoose, { Schema, Types, model } from "mongoose";

const CommentSchema = new Schema({
  content: {
    type: String,
    minlength: 2,
    maxlength: 50000,
    trim: true,
    required: function () {
      console.log(this);
      return this.attachments?.length ? false : true;
    }
  },
  attachments: [{ secure_url: String, public_id: String }],
  likes: [{ type: Types.ObjectId, ref: 'User' }],
  tags: [{ type: Types.ObjectId, ref: 'User' }],
  createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  postId: { type: Types.ObjectId, ref: 'post', required: true },
  commentId: { type: Types.ObjectId, ref: 'comment' },
  updatedBy: { type: Types.ObjectId, ref: 'User' },
  deletedBy: { type: Types.ObjectId, ref: 'User' },
  isDeleted: Date
}, { timestamps: true , toJSON:{virtuals:true} , toObject:{virtuals:true}});
CommentSchema.virtual('reply', {
    localField:'_id',
    foreignField:'commentId',
    ref:'Comment'
  })
export const Commentmodel = mongoose.models.Comment || model("comment", CommentSchema);
