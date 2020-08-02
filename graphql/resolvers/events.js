const Event = require("../../models/events");

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

      let createdEvent = transformEvent(event);
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      return err;
    }
  },
};
