import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true
    },
    publicId: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    college: {
      type: String,
      trim: true,
      default: "Campus Community"
    },
    bio: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    avatar: {
      type: imageSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default mongoose.model("User", userSchema);
