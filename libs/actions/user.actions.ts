"user server";

import User from "@/libs/models/user.model"
import {connect} from "@/libs/db"

export async function CreateUser(user:any) {
    try {
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    }

    catch (error){
        console.log(error)

    }
    
}