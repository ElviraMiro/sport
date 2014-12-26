Meteor.publishComposite('eventsForUser', {
	find: function(uId) {
		var startWeek = moment(new Date()).startOf('week');
		startWeek = startWeek.add(-12, "h");
		//TODO: use userId
		return Events.find({startedAt: {$gte: startWeek.toDate()}}, {sort: {startedAt: 1}});
	},
	children: [
		{
			find: function(event) {
				return EventTypes.find({_id: event.eventTypeId});
			}
		},
		{
			find: function(event) {
				return Locations.find({_id: event.locationId});
			}
		}
	]
});
