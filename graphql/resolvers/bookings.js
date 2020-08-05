const Booking = require("../../models/bookings");
const Event = require("../../models/events");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      const bookings = await Booking.find({ user: req.userId });
      const listOfBookings = bookings.map((booking) => {
        return transformBooking(booking);
      });
      return listOfBookings;
    } catch (err) {
      return err;
    }
  },
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }
      const eventExist = await Event.findById(args.eventId);
      if (!eventExist) {
        throw new Error("Event not found");
      }
      const booking = await Booking.create({
        user: req.userId,
        event: eventExist,
      });

      return transformBooking(booking);
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

      const event = transformEvent(booking.event);

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
