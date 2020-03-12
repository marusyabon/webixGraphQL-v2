import mongoose from 'mongoose';
import {GraphQLScalarType} from 'graphql';
import {Kind} from 'graphql/language';
import Book from '../models/books';

const resolvers = {
    getAllBooks: async () => {
        const books = await Book.find({}).lean();
        return books;
    },

    getBook: async ({bookID}) => {
        const id = mongoose.Types.ObjectId(bookID);
        const result = await Book.find(id).lean();
        return result[0];
    },

    addBook: async ({input}) => {
        const book = new Book(input);
        await book.save();
        return book;
    },

    updateBook: async ({bookID, input}) => {
        const id = mongoose.Types.ObjectId(bookID);

        const request = await Book.findOneAndUpdate(
            {_id: id},
            {...input},
            {
                fields: Object.keys(input),
                new: true
            }
        );

        if (request) {
            return true;
        }
        return false;
    },

    deleteBook: async ({bookID}) => {
        const id = mongoose.Types.ObjectId(bookID);
        const result = await Book.deleteOne({_id: id});

        if (result.n) {
            return true;
        }
        return false;
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.getTime();
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10);
            }
            return null;
        }
    })
};

export default resolvers;
