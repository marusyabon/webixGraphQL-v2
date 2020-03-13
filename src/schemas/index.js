import {buildSchema} from 'graphql';

const schema = buildSchema(`
    scalar Date
    scalar Upload

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
        files: [File]
    }

    type File {
        _id: ID
        name: String
        url: ID
        bookId: String
        dataType: String
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
        uploadFile(input: FileInput): Boolean
    }

    input FileInput {
        upload: String
        upload_fullpath: String
        bookId: String
        fileType: String
    }
`);

export default schema;
