import {buildSchema} from 'graphql';

const schema = buildSchema(`
    scalar Date

    type Query {
        getAllBooks: [Book]
        getBook(bookID: ID): Book
    }

    type Book {
        _id: ID
        coverPhoto: String
        bookTitle: String
        numberOfPages: Int
        authorName: String
        publishingHouse: String
	    countryOfPublication: String
        genres: String
        availableCopies: Int
        yearOfPublication: Date
        isFiles: Boolean
        viewedTimes: Int
        orderedTimes: Int
    }

    input BookInput {
        coverPhoto: String
        bookTitle: String
        numberOfPages: Int
        authorName: String
        publishingHouse: String
	    countryOfPublication: String
        genres: String
        availableCopies: Int
        yearOfPublication: Date
    }

    type Mutation {
        addBook(input: BookInput): Book
        updateBook(bookID: ID!, input: BookInput): Boolean
        deleteBook(bookID: ID!): Boolean
    }
`);

export default schema;
