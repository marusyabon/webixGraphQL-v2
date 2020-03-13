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

const getAllBooksQuery = `GraphQL->{ 
    getAllBooks{ 
        ${bookData}
    }
}`;

function addBook (input) {
    return webix.proxy("GraphQL", `
        mutation addBook($input: BookInput){
            addBook(input: $input){
                ${bookData}
            }
        }`)
        .save({input})
}

function updateBook (bookID, input) {
    return webix.proxy("GraphQL", `
        mutation updateBook($bookID: ID!, $input: BookInput){
            updateBook(bookID: $bookID, input: $input)
        }`)
        .save({bookID, input})
}

function getBook (bookID) {
    return webix.proxy('GraphQL', `
        query($bookID: ID!) {
            getBook(bookID: $bookID) {
                ${bookData}
                files {
                    _id
                    name
                    url
                    bookId
                    dataType
                }
            }
        }
    `)
    .load({bookID})
};

function getAllBooks () {
    return webix.proxy('GraphQL', `
        query {
            getAllBooks {
                ${bookData}
            }
        }
    `)
    .load()
};

function deleteBook (bookID) {
    return webix.proxy('GraphQL', `
        mutation deleteBook($bookID: ID!) {
            deleteBook(bookID: $bookID)
            }
        `)
        .save({bookID});
}

export {bookData, getAllBooksQuery, getBook, getAllBooks, addBook, updateBook, deleteBook};
