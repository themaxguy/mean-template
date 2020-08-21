import { Document, Model, model, Types, Schema, Query } from 'mongoose'
import { ICompany } from '../Company/CompanySchema'
import bcrypt from 'bcrypt'

export enum UserRoles {
  Standard,
  Admin,
}

// Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  role: {
    type: UserRoles,
    required: true
  }
})

// DO NOT export this
interface IUserSchema extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  role: UserRoles
  // leave the company field out
}

// Virtuals
UserSchema.virtual("fullName").get(function(this: IUserSchema) {
  return this.firstName + this.lastName
})

// DO NOT export
interface IUserBase extends IUserSchema {
  fullName: string;
}

// Export this for strong typing
export interface IUser extends IUserBase {
  company: ICompany["_id"];
}

// Export this for strong typing
export interface IUser_populated extends IUserBase {
  company: ICompany;
}

// Static methods
UserSchema.statics.findMyCompany = async function(id: string) {
  return this.findById(id).populate("company").exec()
}

UserSchema.statics.findByEmail = async function(email: string) {
  return this.findOne({ email})
}

// For model
export interface IUserModel extends Model<IUser> {
  findMyCompany(id: string): Promise<IUser_populated>,
  findByEmail(email: string): Promise<IUser>
}

// Document middlewares
UserSchema.pre<IUser>("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
});

// Query middlewares
// UserSchema.post<Query<IUser>>("findOneAndUpdate", async function(doc) {
//   await updateCompanyReference(doc);
// });


// Default export
export default model<IUser, IUserModel>("User", UserSchema)