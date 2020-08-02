const User = require("../../models/users");
const { events } = require("./merge");

const bcrypt = require("bcryptjs");

module.exports = {
  users: async () => {
    try {
      const users = await User.find({});
      const listOfUsers = users.map((user) => {
        return {
          ...user._doc,
          createdEvents: events.bind(this, user._doc.createdEvents),
        };
      });
      return listOfUsers;
    } catch (err) {
      return err;
    }
  },
  createUser: async (args) => {
    try {
      const userExist = await User.findOne({ email: args.userInput.email });
      if (userExist) {
        throw new Error("User exists");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = await User.create({
        email: args.userInput.email,
        password: hashedPassword,
      });
      user.password = null;
      return user;
    } catch (err) {
      return err;
    }
  },
};
