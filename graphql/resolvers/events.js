const Event = require("../../models/events");
const User = require("../../models/users");

const { transformEvent } = require("./merge");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find({});
      const listOfEvents = events.map((event) => {
        return transformEvent(event);
      });
      return listOfEvents;
    } catch (err) {
      return err;
    }
  },
  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User does not exists");
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
        creator: req.userId,
      });
      await event.save();

      let createdEvent = transformEvent(event);
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      return err;
    }
  },
};
