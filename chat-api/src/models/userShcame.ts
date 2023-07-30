import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export interface IAuth extends Document {
  _id?: ObjectId;
  firstName: string;
  lastName?: string;
  userName: String;
  age: number;
  email: String;
  role: "user" | "admin";
  password: string;
  passwordConfirm: string;
  img?: object;
  createdAt: Number;
  contact?: [
    {
      idRef: String;
      id?: String;
      userName: String;
      active?: boolean;
    }
  ];
  correctPassword(password: string, hashedPassword: string): boolean;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

const userShcema = new mongoose.Schema<IAuth>({
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  role: {
    type: String,
    //enum=עובד רק על סטרינג, מאפשר להגדיר איזה ערכים השדה יכול לקבל
    enum: {
      values: ["user", "admin"],
      message: "role must inclue admin or user",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    //מוודא שהסיסמא לא תוצג ברספון
    select: false,
  },
  passwordConfirm: {
    type: String,
    select: false,
    required: [true, "please confirm your passeword"],
    validate: {
      validator: function (this: IAuth, el: string): boolean {
        return el === this.password;
      },
      // provide a default value of undefined
      msg: "password are not same",
    },
  },
  img: Object,
  createdAt: {
    type: Number,
    default: Date.now,
  },
  contact: [
    {
      idRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userName: String,
      active: Boolean,
    },
  ],
});

userShcema.pre("save", async function (next) {
  //עובד רק אם הסיסמא שונתה
  if (!this.isModified("password")) return next();

  //אם שונתה הסיסמא אז תצפין אותה
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = "";
  next();
});

userShcema.methods.correctPassword = async function (
  password: string,
  userPassword: string
) {
  return await bcrypt.compare(password, userPassword);
};

userShcema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

export const User = mongoose.model<IAuth>("User", userShcema);
