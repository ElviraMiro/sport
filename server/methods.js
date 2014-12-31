Meteor.methods({
    "getEvents": function(start, end) {
        // Get only events from one document of the Calendars collection
        // events is a field of the Calendars collection document
        var events = [],
            userGroups = userIsUserInGroups(Meteor.userId());
        console.log(start, end);
        Events.find({$and: [{startedAt: {$gte: start}}, {startedAt: {$lte: end}}, {finishedAt: {$gte: start}}, {finishedAt: {$lte: end}}], $or: [{userIds: Meteor.userId()}, {adminIds: Meteor.userId()}, {groupIds: {$in: userGroups}}]}).forEach(function(event) {
            var type = EventTypes.findOne(event.eventTypeId),
                location = Locations.findOne(event.locationId);
            eventDetails = {
                id: event._id,
                title: type.title,
                start: event.startedAt,
                end: event.finishedAt,
                editable: false,
                color: "green"
            };
            events.push(eventDetails);
        });
        console.log("EVENTS: ", events);
        return events;
    }
});