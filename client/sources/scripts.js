function toggleElement (condition, element) {
	if (condition) {
		element.show();
	}
	else {
		element.hide();
	}
}

webix.protoUI({
	name: 'activeList',
	defaults: {
		autoheight: true,
		borderless: true,
		type: {
			height: 30
		}
	}
}, webix.ui.list);

export {toggleElement};