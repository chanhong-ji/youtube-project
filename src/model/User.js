import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxlength: 320 },
  name: { type: String, required: true, minlength: 4, maxlength: 16 },
  password: { type: String },
  location: { type: String, maxlength: 30 },
  socialOnly: { type: Boolean, default: false, required: true },
  avatarUrl: { type: String },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
    return this.password;
  }
});

const User = mongoose.model("User", userSchema);

export default User;
