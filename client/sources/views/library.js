import {JetView} from 'webix-jet';
import BookCard from './bookCard';
import {getAllBooksQuery, deleteBook} from '../graphqlQueries/books';

export default class Library extends JetView {
	config() {
		const header = {
			type: 'header',
			template: '<i class="fas fa-book"></i> List of books',
			css: 'center page_header'
		};

		const addBookBtn = {
			view: 'button',
			value: 'Add book',
			type: 'form',
			width: 100,
			click: () => {
				this.addBook();
			}
		};

		const dtable = {
			view: 'datatable',
			id: 'dtLibrary',
			select: true,
			columns: [
				{
					id: 'id',
					hidden: true,
				},
				{
					id: 'bookTitle',
					sort: 'text',
					fillspace: 1,
					header: ['Title', {content: 'textFilter'}]
				},
				{
					id: 'authorName',
					sort: 'text',
					fillspace: 1,
					header: ['Author', {content: 'textFilter'}]
				},
				{
					id: 'genres',
					sort: 'text',
					width: 80,
					css: 'center',
					header: ['Genres', {content: 'selectFilter'}]
				},
				{
					id: 'countryOfPublication',
					sort: 'text',
					width: 80,
					css: 'center',
					header: ['Country', {content: 'selectFilter'}]
				},
				{
					id: 'yearOfPublication',
					sort: 'date',
					width: 80,
					css: 'center',
					format: (val) => {
						if (val) {
							return new Date(val).getFullYear()
						}
						return '-'
					},
					header: ['Year', {content: 'dateRangeFilter'}]
				},
				{
					id: 'availableCopies',
					width: 80,
					css: 'center',
					header: 'Available'
				},
				{
					id: 'viewCol',
					header: 'View',
					css: 'center',
					width: 50,
					template: '<i class="fas fa-eye"></i>'
				},
				{
					id: 'removeCol',
					header: 'Remove',
					css: 'center',
					width: 70,
					template: '<i class="fas fa-trash"></i>'
				}
			],
			onClick: {
				'fa-eye': (e, id) => {
					this.showBookCard(id);
				},
				'fa-trash': (e, id) => {
					this.removeBook(id);
				}
			},
			url: getAllBooksQuery
		};

		const footer = {
			cols: [
				{},
				addBookBtn,
				{}
			]
		}

		return {
			rows: [header, dtable, footer]
		};
	}

	async init() {
		this.grid = $$('dtLibrary');
		this._bookCard = this.ui(BookCard);
	}

	showBookCard(id) {
		const book = this.grid.getItem(id);
		this._bookCard.showPopup(book);
	}

	removeBook(id) {
		const book = this.grid.getItem(id);
		deleteBook(book._id).then(() => {
			this.grid.remove(id);
		});
		return false;
	}

	addBook() {
		this._bookCard.showPopup();
	}
}