import { Document, Model, model, Types, Schema, Query } from 'mongoose'

// Schema
const CompanySchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

// DO NOT export this
interface ICompanySchema extends Document {
  name: string;
}

// DO NOT export
interface ICompanyBase extends ICompanySchema {
  fullName: string;
  getGender(): string;
}

// Export this for strong typing
export interface ICompany extends ICompanyBase {
  company: ICompany["_id"];
}

// Static methods
CompanySchema.statics.findMyCompany = async function(id) {
  return this.findById(id).populate("company").exec()
}

// For model
export interface ICompanyModel extends Model<ICompany> {
  findMyCompany(id: string): Promise<ICompany_populated>
}

// Query middlewares
CompanySchema.post<Query<ICompany>>("findOneAndUpdate", async function(doc) {
  await updateCompanyReference(doc);
});

// Default export
export default model<ICompany, ICompanyModel>("Company", CompanySchema)