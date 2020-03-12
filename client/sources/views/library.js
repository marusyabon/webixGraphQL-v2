import {JetView} from 'webix-jet';
import BookCard from './bookCard';
import booksModel from '../models/books';
import filesModel from '../models/files';

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
					id: 'ebook',
					header: ['eBook', {content:"selectFilter"}],
					width: 70,
					template: (obj) => {
						return obj.ebook==='yes' ? '<i class="fas fa-check"></i>' : ''
					}					
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
			}
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
		await this.getData();
		// await this.getFiles();
		// this.checkFiles();		

		this.grid.parse(this.booksArr);
		this._bookCard = this.ui(BookCard);
	}

	async getData() {	
		this.booksArr = [];

		try {
			const dbData = await booksModel.getDataFromServer();
			let booksArr = dbData.data.getAllBooks;
			booksArr = booksArr.map((el) => {
				el.year_of_publication ? new Date(el.year_of_publication) : '';
				return el;
			});
			this.booksArr = booksArr;
		} catch (err) {
			console.log(err)
		}
	}

	async getFiles() {
		const dbData = await filesModel.getDataFromServer();
		this.filesArr = dbData.json();						
	}

	checkFiles() {
		this.booksArr.forEach((book, i) => {
			const isFiles = this.filesArr.find((el) => el.book_id === book.id);
			
			if(isFiles) {
				this.booksArr[i].ebook = 'yes';
			}
			else {
				this.booksArr[i].ebook = 'no';
			}
		});
	}

	showBookCard(id) {
		const book = this.grid.getItem(id);
		this._bookCard.showPopup(book);
	}

	async removeBook(id) {
		const book = this.grid.getItem(id);
		const result = await booksModel.removeItem(book._id);
		if (result) {
			return this.grid.remove(id);
		}
		return false;		
	}

	addBook() {
		this._bookCard.showPopup();
	}
}