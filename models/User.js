import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  providerName: String,
  providerId: String,
  profile: mongoose.Schema.Types.Mixed,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  username: String,
  phoneNumber: String,
  profilePicture: String,
  providers: [providerSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
