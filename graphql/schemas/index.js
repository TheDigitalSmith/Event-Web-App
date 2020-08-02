const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Event {
    _id: ID!
    title: String!
    description:String!
    price:Float!
    date:String!
    creator: User!
}

type User {
    _id:ID!
    email: String!
    password: String
    createdEvents:[Event!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!

}

type Booking {
    _id: ID!
    event:Event!
    user: User!
    createdAt:String!
    updatedAt:String!
}

input EventCreateInput {
    title: String!
    description:String!
    price:Float!
    date:String!
}

input UserCreateInput{
    email: String!
    password:String!
}

type RootQuery{
    events: [Event!]!
    login(email:String!, password:String!):AuthData!
    bookings: [Booking!]!
}

type RootMutation{
    createEvent(eventInput: EventCreateInput ): Event
    createUser(userInput: UserCreateInput):User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId:ID!): Event!
}

schema{
    query: RootQuery
    mutation: RootMutation
}
`);
