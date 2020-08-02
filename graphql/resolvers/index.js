const bcrypt = require("bcryptjs");

const Event = require("../../models/events");
const User = require("../../models/users");

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    const userInfo = {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
    return userInfo;
  } catch (err) {
    throw err;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    const listOfEvents = events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return listOfEvents;
  } catch (err) {
    throw err;
  }
};

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
  events: async () => {
    try {
      const events = await Event.find({});
      const listOfEvents = events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
      return listOfEvents;
    } catch (err) {
      return err;
    }
  },
  createEvent: async (args) => {
    try {
      const creator = await User.findById("5f25ab76737b0b3170a1e3a8");
      if (!creator) {
        throw new Error("User does not exists");
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
        creator: "5f25ab76737b0b3170a1e3a8",
      });
      await event.save();

      creator.createdEvents.push(event);
      await creator.save();
      return event;
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
