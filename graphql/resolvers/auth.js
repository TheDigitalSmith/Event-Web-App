const User = require("../../models/users");
const { events } = require("./merge");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

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
  login: async (args) => {
    try {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new Error("Invalid Credentials");
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error("Invalid Credentials");
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.TOKEN,
        { expiresIn: "1h" }
      );

      return {
        userId: user._id,
        token: token,
        tokenExpiration: 1,
      };
    } catch (err) {
      return err;
    }
  },
};
