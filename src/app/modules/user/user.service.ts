import { IUser } from "./user.interface";
import { User } from "./user.model";

// create a user
const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  const user = await User.create({
    name,
    email,
  });
  return user;
};


// get all userServices
const getAllUsers = async () => {
  const users = await User.find({}) 

  return users
}


export const userServices = {
  createUser,
  getAllUsers
};
