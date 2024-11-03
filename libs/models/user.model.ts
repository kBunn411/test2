import { Schema, model, models } from "mongoose";
import { unique } from "next/dist/build/utils";

const UserSchema = new Schema({
    chefID:{
        type: Number,
        required: true,
        unique: true,
    },

    firstName:{
        type: String,
        required: true,
        
    },

    lastName:{
        type: String,
        required: true,
        
    },


    email:{
        type: String,
        required: true,
        unique: true,
    },

    username:{
        type: String,
        required: true,
        unique: true,
    },

    password:{
        type: String,
        required: true,
        unique: true,
    },

    numbers: {
        type: [Number]
      },


})

const User = models?.User || model("User",UserSchema);

export default User;