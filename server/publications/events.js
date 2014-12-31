Meteor.publish('eventsForUser', function() {
	return [
		EventTypes.find({ownerId: this.userId}),
		Locations.find({ownerId: this.userId}),
	]
	/*Publish.relations(this, Events.find({startedAt: {$gte: startWeek}}, {sort: {startedAt: 1}}), function(id, doc) {
		doc.eventType = this.changeParentDoc(EventTypes.find(doc.eventTypeId), function(eventType) {
			console.log("EVENT TYPE: ", eventType);
			return eventType.title;
		});
		doc.location = this.changeParentDoc(Locations.find(doc.locationId), function(location) {
			return location.title;
		});
	});
	return this.ready();
	*/
});
