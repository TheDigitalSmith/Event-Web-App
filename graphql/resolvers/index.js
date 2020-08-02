const bcrypt = require("bcryptjs");

const Event = require("../../models/events");
const User = require("../../models/users");
const Booking = require("../../models/bookings");

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userInfo = {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
    return userInfo;
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    const eventInfo = {
      ...event._doc,
      creator: user.bind(this, event._doc.creator),
    };
    return eventInfo;
  } catch (error) {
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
  bookings: async () => {
    try {
      const bookings = await Booking.find({});
      const listOfBookings = bookings.map((booking) => {
        return {
          ...booking._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
      return listOfBookings;
    } catch (err) {
      return err;
    }
  },
  bookEvent: async (args) => {
    try {
      const eventExist = await Event.findById(args.eventId);
      if (!eventExist) {
        throw new Error("Event not found");
      }
      const booking = await Booking.create({
        user: "5f25ab76737b0b3170a1e3a8",
        event: eventExist,
      });

      return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
      };
    } catch (err) {
      return err;
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      if (!booking) {
        throw new Error("Booking not found");
      }

      const event = {
        ...booking._doc.event._doc,
        date: new Date(booking.event.date).toISOString(),
        creator: user.bind(this, booking.user),
      };

      const cancelBooking = await Booking.findByIdAndRemove(booking._id);
      if (!cancelBooking) {
        throw new Error("Failed to cancel Booking");
      } else {
        return event;
      }
    } catch (error) {
      return error;
    }
  },
};
