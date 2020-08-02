const Event = require("../../models/events");
const User = require("../../models/users");

const { dateToString } = require("../../helpers/date.js");

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
    return transformEvent(event);
  } catch (error) {
    throw err;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    const listOfEvents = events.map((event) => {
      return transformEvent(event);
    });
    return listOfEvents;
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

module.exports = {
  //   user,
  //   events,
  //   singleEvent,
  transformEvent,
  transformBooking,
};
