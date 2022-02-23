import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  location: { type: String },
  socialOnly: { type: Boolean, default: false, required: true },
  avatarUrl: {
    type: String,
    default:
      "https://ji-wetubeee.s3.ap-northeast-2.amazonaws.com/images/c4e9edf61e383aa65b24f246de2c8810",
    required: true,
  },
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
