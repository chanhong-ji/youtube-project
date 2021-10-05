import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  location: { type: String },
  socialOnly: { type: Boolean, default: false, required: true },
  avatarUrl: String,
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
  return this.password;
});

const User = mongoose.model("User", userSchema);

export default User;
