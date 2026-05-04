import mongoose, {Schema , Types, model } from "mongoose";
import { generateHash } from "../../utilies/security/hash.security.js";

export const genderTypes = {male : "male" , female : "female"}
export const providerTypes = {google : "google" , system : "system"}
export const roleTypes = { user: "user", admin: "admin", superAdmin:"superAdmin" };



const userSchema = new Schema(
  {
    //username: { type: String, required: true, minlength: 2, maxlength: 50, trim: true },
    firstName: { type: String, required: true, minlength: 2, maxlength: 50, trim: true },
    lastName: { type: String, required: true, minlength: 2, maxlength: 50, trim: true },
    email: { type: String, required: true, unique: true },
    confirmEmailOTP: String,
    tempEmail:String,
    tempEmailOTP:String,
    resetPasswordOTP: String,
    password: {
      type: String,
      required: function() {
          return this.provider === providerTypes.google ? false : true;
      }
  },
    phone: String,
    address: String,
    DOB: Date,
    image: {secure_url :String , public_id:String},
    coverImages: {secure_url :String , public_id:String},
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default: genderTypes.male,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: roleTypes.user,
    },
    confirmEmail: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    changeCredentialsTime: Date,
    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },
    viewers:[{
      userId:{ type: Types.ObjectId,ref:'User'},
      time:Date
    }],
    updateBy:{ type: Types.ObjectId,ref:'User'}
  },
  { timestamps: true,toObject:{virtuals:true} , toJSON:{virtuals:true} }
);

// userSchema.pre('validate' , function(next , doc){
//   console.log('pre validate');
//   next()
// })

// userSchema.pre('save' , function(next , doc){
//   console.log('post validate');
//   next()
// })


// userSchema.pre('save' , function(next , doc){
//   console.log({this : this});
//    this .password = generateHash({plainText : this.password})
//    next()
// })


// userSchema.pre('save' , function(next , doc){
//   console.log("pre Hock 2");
//   next()
// })


// userSchema.post('save' , function(doc , next){
//   console.log({this : this , doc});
//   // this .password = generateHash({plainText : this.password})
//   next()
// })

userSchema.pre('insertMany', function (next, docs) {
  console.log("pre hook 2");
  console.log({ this: this, docs });
  next();
});

userSchema.post('insertMany', async function (docs, next) {
  console.log({ this: this, docs });
  // await postModel.deleteMany({ createdBy: this._id })
  next();
});



userSchema.virtual('username').set(function (value) {
  console.log({ value });

  this.firstName = value.split(" ")[0];
  this.lastName = value.split(" ")[1] || ''; // Handle cases where there might not be a last name
}).get(function () {
  return this.firstName + " " + this.lastName;
});

export const usermodel = mongoose.model.User || model('User', userSchema)
export default usermodel
