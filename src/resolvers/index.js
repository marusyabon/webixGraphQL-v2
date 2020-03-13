import mongoose from 'mongoose';
import {GraphQLScalarType} from 'graphql';
import {Kind} from 'graphql/language';
import {atob} from 'atob';
import path from 'path';
import fs from 'fs';

import Book from '../models/books';
import File from '../models/files';

const resolvers = {
    getAllBooks: async () => {
        const books = await Book.find({}).lean();
        return books;
    },

    getBook: async ({bookID}) => {
        const id = mongoose.Types.ObjectId(bookID);

        const data = await Book.aggregate([
            {$match: {_id: id}},
            {$lookup: {
                from: 'files',
                localField: '_id',
                foreignField: 'bookId',
                as: 'files'
            }
            }
        ]);
        return data[0];
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

    uploadFile: async ({input}) => {
        const file = atob(input.upload);
        const _path = path.resolve(`src/data/${input.fileType}`);
        const url = `${_path}/${input.upload_fullpath}`;

        fs.writeFile(url, file, (err) => {
            if (!err) {
                const fileObj = new File({
                    name: input.upload_fullpath,
                    url: _path,
                    bookId: input.bookId,
                    dataType: input.fileType
                });

                fileObj.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return true;
            }

            console.log(err);
            return false;
        });
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
