
import mongoose, { Schema, Types, model } from "mongoose";

const postSchema = new Schema({
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
  comments: [{ type: Types.ObjectId, ref: 'Comments' }],
  tags: [{ type: Types.ObjectId, ref: 'User' }],
  createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Types.ObjectId, ref: 'User' },
  deletedBy: { type: Types.ObjectId, ref: 'User' },
  isDeleted: Date
}, { timestamps: true , toJSON:{virtuals:true} , toObject:{virtuals:true} });
postSchema.virtual('comment', {
  localField:'_id',
  foreignField:'postId',
  ref:'Comment'
})
export const postmodel = mongoose.models.Post || model("Post", postSchema);
