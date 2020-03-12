import mongoose from 'mongoose';

const {Schema} = mongoose;

const FilesSchema = new Schema({
    name: String,
    size: String,
    url: String,
    bookId: {type: Schema.Types.ObjectId, ref: 'Book'},
    dataType: String
});

FilesSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const File = mongoose.model('File', FilesSchema);

export default File;
