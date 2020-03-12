import {JetView, plugins} from 'webix-jet';

export default class TopView extends JetView{
	config(){

		const header = {
			type:'header', template:this.app.config.name, css:'webix_header app_header'
		};

		const menu = {
			id: 'top:menu',
			view:'menu', 
			css:'app_menu',
			width:180, layout:'y', select:true,
			template:'<span class="webix_icon #icon#"></span> #value# ',
			value: 'main',
			data:[
				{ value:'Library', id:'library',  icon:'fas fa-book-reader' },
				{ value:'Tops', id:'tops',  icon:'fas fa-list' }
			]
		};

		const ui = {
			type:'clean', paddingX:5, css:'app_layout', 
			cols:[
				{ paddingX:5, paddingY:10, rows: [ {css:'webix_shadow_medium', rows:[header, menu]} ]},
				{ view: 'resizer', width: 5 },
				{
					type: 'wide', paddingY: 10, paddingX: 5, rows: [
						{ $subview: true }
					]
				}				
			]
		};

		return ui;
	}
	init(){
		this.use(plugins.Menu, "top:menu");
	}
}