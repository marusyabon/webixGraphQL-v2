import { JetView } from "webix-jet";
import {getAllBooks} from '../graphqlQueries';

export default class bookTops extends JetView {
	config() {

		return {
			cols: [
				{
					view: 'list',
					width: 250,
					select: true,
					data: [
						{
							id: 'showOldestBooks',
							value: 'Oldest books'
						},
						{
							id: 'showNewestBooks',
							value: 'Newest books'
						},
						{
							id: 'showMostPagesBooks',
							value: 'Most pages books'
						},
						{
							id: 'showBooksWithLongNames',
							value: 'Books with longest names'
						},
						{
							id: 'showAuthorsWithMostBooks',
							value: 'Authors with most books'
						}
					],
					on: {
						onItemClick: (id) => {
							switch(id) {
								case 'showOldestBooks':
									this.showOldestBooks();
									break;
								case 'showNewestBooks':
									this.showNewestBooks();
									break;
								case 'showMostPagesBooks':
									this.showMostPagesBooks();
									break;
								case 'showBooksWithLongNames':
									this.showBooksWithLongNames();
									break;
								case 'showAuthorsWithMostBooks':
									this.showAuthorsWithMostBooks();
									break;
							}
						}
					}
				},
				{
					id: 'booksTop',
					view: 'datatable',
					hidden: true
				}
			]
		};
	}

	async init() {
		this.grid = $$('booksTop');
		let booksArr = await getAllBooks();
		
		booksArr = booksArr.map((el) => {
			el.yearOfPublication = new Date(el.yearOfPublication);
			return el;
		});
		this.booksArr = booksArr;

		this.defaultConfig = [
			{
				id: 'bookTitle',
				sort: 'text',
				fillspace: 1,
				header: 'Title'
			},
			{
				id: 'authorName',
				sort: 'text',
				fillspace: 1,
				header: 'Author'
			},
			{
				id: 'genres',
				sort: 'text',
				width: 80,
				css: 'center',
				header: 'Genres'
			},
			{
				id: 'countryOfPublication',
				sort: 'text',
				width: 80,
				css: 'center',
				header: 'Country'
			},
			{
				id: 'yearOfPublication',
				sort: 'date',
				width: 80,
				css: 'center',
				format: webix.Date.dateToStr("%Y"),
				header: 'Year'
			},
			{
				id: 'numberOfPages',
				header: 'Pages',
				width: 60
			}
		];
	}

	showOldestBooks() {
		let data = [...this.booksArr];
		data.sort((a, b) => {
			return a.yearOfPublication - b.yearOfPublication;
		});
		this.showResults(data, this.defaultConfig);
	}

	showNewestBooks() {
		let data = [...this.booksArr];
		data.sort((a, b) => b.yearOfPublication - a.yearOfPublication);
		this.showResults(data, this.defaultConfig);
	}

	showMostPagesBooks() {
		let data = [...this.booksArr];
		data.sort((a, b) =>  b.numberOfPages - a.numberOfPages);
		this.showResults(data, this.defaultConfig);
	}

	showBooksWithLongNames() {
		let data = [...this.booksArr];
		data.sort((a, b) => b.bookTitle.length - a.bookTitle.length);
		this.showResults(data, this.defaultConfig);
	}

	showAuthorsWithMostBooks() {
		let authors = [];
		this.booksArr.forEach((el) => {
			const index = authors.findIndex(author => author.name == el.authorName);
			if (index === -1) {
				authors.push({name: el.authorName, booksCount: 1});
			}
			else {
				authors[index].booksCount++;
			}
		});

		authors = authors.sort((a, b) => b.booksCount - a.booksCount);

		const columns = [
			{
				id: 'name',
				header: 'Name',
				fillspace: 1
			},
			{
				id: 'booksCount',
				header: 'Books count',
				fillspace: 1
			}
		];
		this.showResults(authors, columns);
	}

	showResults(data, columns) {
		this.grid.define('columns', columns);
		this.grid.refreshColumns();
		data = data.slice(0, 10);
		this.grid.clearAll();
		this.grid.parse(data);
		this.grid.show();
	}
}