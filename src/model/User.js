import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String },
  location: { type: String },
  socialOnly: { type: Boolean, default: false, required: true },
  avatarUrl: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
  return this.password;
});

const User = mongoose.model("User", userSchema);

export default User;
