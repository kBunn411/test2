import { Schema, model, models } from 'mongoose';

// Define the User Schema with profile-related fields
const UserSchema = new Schema({
    chefID: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    // added fields

    bio: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    favoriteCuisine: {
        type: String,
        default: '',
    },
    age: {
        type: Number,
        default: 0,
    },
    socialMedia: {
        yelp: {
            type: String,
            default: '',
        },
        facebook: {
            type: String,
            default: '',
        },
        instagram: {
            type: String,
            default: '',
        },
    },
});

// Create or use the existing User model
const User = models?.User || model('User', UserSchema);

export default User;
