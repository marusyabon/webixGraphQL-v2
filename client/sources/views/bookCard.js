import {JetView} from 'webix-jet';
import {DUMMYCOVER} from '../consts';
import {toggleElement} from '../scripts'; 
import {addBook, updateBook, getAllBooksQuery, getBook} from '../graphqlQueries/books';
import {saveFile} from '../graphqlQueries/files';

export default class BookCard extends JetView {
	config() {

		const bookCover = {
			localId: 'bookCover',
			width: 120,
			height: 180,
			css: 'book_cover',
			template: (_url) => {
				return `<div style="background-image: url(${_url})" ></div>`;
			}
		};

		const bookCard = {
			localId: 'bookCardLibrarian',
			view: 'form',
			borderless: true,
			elements: [
				{ view: 'text', label: 'Title', labelWidth: 130, width: 310, labelAlign: 'right', name: 'bookTitle' },
				{ view: 'text', label: 'Author', labelWidth: 130, width: 310, labelAlign: 'right', name: 'authorName' },
				{ view: 'combo', label: 'Genres', labelWidth: 130, value: "111", width: 310, labelAlign: 'right', name: 'genres', options: [
					'', 'Fiction', 'Fantasy', 'Thriller', 'Horror', 'Mystery', 'Historical', 'Westerns', 'Family', 'Dark comedy'
				]},
				{ view: 'text', label: 'Country', labelWidth: 130, width: 310, labelAlign: 'right', name: 'countryOfPublication' },
				{ view: 'text', label: 'Publishing house', labelWidth: 130, width: 310, labelAlign: 'right', name: 'publishingHouse' },
				{ view: 'text', label: 'Available copies', labelWidth: 130, width: 310, labelAlign: 'right', name: 'availableCopies' },
				{ view: 'text', label: 'Pages', labelWidth: 130, width: 310, labelAlign: 'right', name: 'numberOfPages' },
				{ view: 'datepicker', label: 'Year of publication', labelWidth: 130, width: 310, labelAlign: 'right', type: 'year', format: '%Y', name: 'yearOfPublication' },
				{ view: 'text', label: 'Cover photo', labelWidth: 130, width: 310, labelAlign: 'right', name: 'coverPhoto' }
			]
		};

		const addTextFile = {
			view: 'uploader',
			label: '<i class="fas fa-file-upload"></i> Upload text file',
			localId: 'bookFiles',
			type: 'htmlbutton',
			autosend: false,
			width: 150,
			accept: 'text/plain, application/pdf, .doc, .docx',
			link: 'filesList'
		};

		const filesList = {
			view: 'list',
			type: 'uploader',
			id: 'filesList',
			autoheight:true, 
			borderless:true
		};

		const availableTextFiles = {
			view: 'activeList',
			localId: 'availableTextFiles',
			autoheight: true,
			template: '#name# <span class="list_button"></span>'
		};

		const saveBtn = {
			view: 'button',
			type: 'form',
			label: 'Save',
			width: 80,
			click: () => {
				this.saveForm();
			}
		};

		return {
			view: 'popup',
			position: 'center',
			maxHeight: 550,
			body: {
				view: 'scrollview',
				body: {
					rows: [
						bookCover, 
						bookCard,
						{
							view: 'template',
							template: 'Files',
							autoheight: true,
							css: 'center'
						},
						{height: 2},
						availableTextFiles,
						filesList,
						{height: 15},
						{ 
							localId: 'addingFilesButtons',
							margin: 10,
							cols: [ {}, addTextFile, {} ] 
						},
						{height: 1},
						{
							paddingY: 10,
							paddingX: 15,
							margin: 10,
							borderless: true,
							cols: [{}, saveBtn, {}]
						}
					]
				}				
			}
		};
	}

	init() {
		this.form = this.$$('bookCardLibrarian');
		this.dtLibrary = $$('dtLibrary');
	}

	showPopup(book) {
		this.clearForm();
		this.isNew = book ? false : true;
		this.bookId = book ? book._id : '';
		toggleElement(!this.isNew, this.$$('bookCover'));
		toggleElement(!this.isNew, this.$$('addingFilesButtons'));

		if (!this.isNew) {
			getBook(book._id).then((data) => {
				this.form.setValues(data);
				this.$$('bookCover').setValues(data.coverPhoto || DUMMYCOVER);
				this.$$('availableTextFiles').parse(data.files);
			});					
		}		

		this.getRoot().show();	
	}

	saveForm() {
		const data = this.form.getValues();

		data.numberOfPages = Number.parseInt(data.numberOfPages);
		data.availableCopies = Number.parseInt(data.availableCopies);

		if (this.form.validate()) {
			if (this.isNew) {
				addBook(data).then(() => {
					this.dtLibrary.clearAll();
					this.dtLibrary.load(getAllBooksQuery);
					this.hideWindow();
				});
			}
			else {
				const book = {...data};

				delete book._id;
				delete book.isFiles;
				delete book.viewedTimes;
				delete book.orderedTimes;

				updateBook(data._id, book).then(() => {
					this.dtLibrary.clearAll();
					this.dtLibrary.load(getAllBooksQuery);
					this.hideWindow();
				});
			}

			const uploadedFile = this.$$('bookFiles').files.data.pull;
			const fileInput = Object.values(uploadedFile)[0];

			const file = {
				upload: fileInput.file,
				upload_fullpath: fileInput.name,
				bookId: this.bookId,
				fileType: 'text'
			};

			saveFile(file);
		}		
	}

	hideWindow() {
		this.clearForm();
		this.getRoot().hide();
	}

	clearForm (){
		this.form.clearValidation();
		this.form.clear();
		this.$$('bookFiles').files.clearAll();
		this.$$('availableTextFiles').clearAll();
	}
}