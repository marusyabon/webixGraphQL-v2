import mongoose from 'mongoose';

const {Schema} = mongoose;

const BooksSchema = new Schema({
    coverPhoto: String,
    bookTitle: String,
    numberOfPages: Number,
    authorName: String,
    publishingHouse: String,
    countryOfPublication: String,
    genres: String,
    availableCopies: Number,
    yearOfPublication: Date,
    isFiles: Boolean,
    viewedTimes: {type: Number, default: 0},
    orderedTimes: {type: Number, default: 0}
});

BooksSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Book = mongoose.model('Book', BooksSchema);

export default Book;
