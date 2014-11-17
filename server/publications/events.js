Meteor.publish('eventtypes', function() {
	return EventTypes.find();
});
