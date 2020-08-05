const Dataloader = require("dataloader");

const Event = require("../../models/events");
const User = require("../../models/users");

const { dateToString } = require("../../helpers/date.js");

const eventDataLoader = new Dataloader((eventIds) => {
  return events(eventIds);
});

const userDataLoader = new Dataloader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const user = async (userId) => {
  try {
    const user = await userDataLoader.load(userId.toString());
    const userInfo = {
      ...user._doc,
      createdEvents: eventDataLoader.load.bind(this, user._doc.createdEvents),
    };
    return userInfo;
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventDataLoader.load(eventId.toString());
    return event;
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
