Template.registerHelper('moment', function(date, format) {
	if (format == "full") {
		moment.locale('uk');
		return moment(date).format("dd, DD MMMM YYYY");
	}
});