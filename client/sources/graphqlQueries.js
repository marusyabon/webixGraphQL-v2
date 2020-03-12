const bookData = `
    _id
    coverPhoto,
    bookTitle,
    numberOfPages,
    authorName,
    publishingHouse,
    countryOfPublication,
    genres,
    availableCopies,
    yearOfPublication,
    isFiles,
    viewedTimes,
    orderedTimes
`;

const addBookQuery = `mutation($input: BookInput) {
    addBook(input: $input) {
      ${bookData}
    }
}`

const updateBookQuery = `mutation($bookID: ID!, $input: BookInput) {
    updateBook(bookID: $bookID, input: $input)
}`

const getBookQuery = `query($bookID: ID!) {
    getBook(bookID: $bookID) {
        ${bookData}
    }
}`;

const getAllBooksQuery = `query {
    getAllBooks {
        ${bookData}
    }
}`;

const deleteBookQuery = `mutation($bookID: ID!) {
    deleteBook(bookID: $bookID)
}`;

export {getBookQuery, getAllBooksQuery, addBookQuery, updateBookQuery, deleteBookQuery};
