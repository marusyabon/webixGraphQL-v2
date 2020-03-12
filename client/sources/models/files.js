import {URL} from '../consts';

class FilesModel {
	constructor() {
		this._url = `${URL}/files/`;
	}

	getDataFromServer() {
		return webix.ajax().get(this._url);
	}
	
	getItems(id) {
		return webix.ajax().get(`${this._url}${id}`);	
	}

	addItem(data) {
		return webix.ajax().post(this._url, data);
	}

	updateItem(data) {
		return webix.ajax().put(this._url, data);
	}

	downloadItem(id) {
		return webix.ajax().response('blob').get(`${this._url}download/${id}`);	
	}

	removeItem(id) {
		return webix.ajax().del(`${this._url}${id}`);
	}
}

export default new FilesModel();