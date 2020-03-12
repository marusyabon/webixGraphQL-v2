import 'babel-polyfill';
import './styles/app.css';
import {JetApp, EmptyRouter, HashRouter } from 'webix-jet';

export default class MyApp extends JetApp{
	constructor(config) {
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: '/index'
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => {
		const app = new MyApp();
		app.render();

		app.attachEvent("app:error:resolve", (name, error) => {
			window.console.error(error);
		});
	});
}

global.log = function () {
	try {
		return console.log.apply(console, arguments);
	} catch (_error) { }
};