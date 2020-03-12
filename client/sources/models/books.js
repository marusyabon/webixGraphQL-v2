import fetchData from '../fetchData';
import {getBookQuery, getAllBooksQuery, addBookQuery, updateBookQuery, deleteBookQuery} from '../graphqlQueries';

class BooksModel {
	constructor() {
		this._data = [];
	}

	async getDataFromServer() {
		const data = await fetchData(getAllBooksQuery);
		return data;
	}

	async getBook(bookID) {
		const data = await fetchData(getBookQuery, {bookID});
		return data;
	}

	async addItem(input) {
		const data = await fetchData(addBookQuery, {input});
		return data;
	}

	async updateItem(bookID, input) {
		const data = await fetchData(updateBookQuery, {bookID, input});
		return data;
	}

	async removeItem(bookID) {
		const data = await fetchData(deleteBookQuery, {bookID});
		return data;
	}
}

export default new BooksModel();