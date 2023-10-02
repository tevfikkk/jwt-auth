import {
    DocumentType,
    getModelForClass,
    index,
    modelOptions,
    pre,
    prop,
} from '@typegoose/typegoose'
import bcrypt from 'bcryptjs'

@index({ email: 1 })
@pre<User>('save', async function () {
    // Hash the password whether it has been changed or not
    if (!this || !this.isModified('password')) return

    // Hash password with costFactor of 12
    this.password = await bcrypt.hash(this.password, 12)
})
@modelOptions({
    schemaOptions: {
        // Automatically add createdAt and updatedAt fields
        timestamps: true,
    },
})

// Exporting the class to be used elsewhere
export class User {
    @prop()
    public name: string

    @prop({ unique: true, required: true })
    public email: string

    @prop({ required: true, minlength: 8, maxlength: 20, select: false })
    public password: string

    @prop({ default: 'user' })
    public role: string

    async comparePasswords(hashedPassword: string, candidatePassword: string) {
        return await bcrypt.compare(candidatePassword, hashedPassword)
    }
}

// Create the user model from the User class
export const userModel = getModelForClass(User)
