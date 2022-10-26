const { model, Schema } = require('mongoose');

//TODO
const userSchema = new Schema({
    email: { type: String, unique: true, minLength: [10, 'Your email must be at least 10 characters long']},
    username: { type: String, minLength: [4, 'Username must be at least 4 characters long']},
    hashedPassword: { type: String, required: true }
});

userSchema.index({ email : 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);

module.exports = User;