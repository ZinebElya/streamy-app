
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";


// Cette interface définit les propriétés que les documents utilisateur devraient avoir dans la bdd.
export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  resetPasswordToken: string | undefined,
  resetPasswordExpires: Date | undefined
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


//Définition d'un nouveau schéma de données Mongoose appelé UserSchema.
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    cardName: {
      type: String,
    },
    cardNumber: {
      type: String,
    },
    expiry: {
      type: String,
    },
    cvv: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);


// fonction 'pre' sera appelée avant de sauvegarder un nouvel utilisateur dans la base de données.
//garantit que le mot de passe de l'utilisateur est sécurisé en le haschant avec bcrypt avant de le sauvegarder dans la bdd.
UserSchema.pre("save", async function (next: any): Promise<any> { 
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();  

  // Random additional data
  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});


// Used for logging in
//La méthode "comparePassword" permet de comparer le mot de passe entré par l'utilisateur avec le mot de passe stocké en base de données
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;
 
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;