EventTypes = new Meteor.Collection("eventtypes");

var EventTypeSchema = new SimpleSchema({
	title: {
		type: String,
		label: 'Вид події',
		max: 200
	}
});

EventTypes.attachSchema(EventTypeSchema);

Events = new Meteor.Collection("events");

var EventSchema = new SimpleSchema({
	eventTypeId: {
		type: String,
		label: 'Вид події',
		max: 50
	},
	locationId: {
		type: String,
		label: 'Місце проведення',
		max: 50
	},
	regionId: {
		type: String,
		label: 'Регіон/населений пункт',
		max: 50
	},
	description: {
		type: String,
		label: 'Опис події',
		max: 200,
		optional: true
	},
	groupIds: {
		type: [String]
	},
	adminIds: {
		type: [String],
		label: 'Адміністратори',
		optional: true
	},
	userIds: {
		type: [String],
		label: 'Учасники',
		optional: true
	}
});

Events.attachSchema(EventSchema);

EventGroups = new Meteor.Collection("eventgroups");

var EventGroupSchema = new SimpleSchema({
	title: {
		type: String,
		max: 200,
		label: "Опис"
	},
	eventTypeId: {
		type: String,
		label: 'Вид події',
		max: 50
	},
	eventIds: {
		type: [String],
		optional: true
	},
	locationId: {
		type: String,
		label: 'Місце проведення',
		max: 50
	},
	regionId: {
		type: String,
		label: 'Регіон/населений пункт',
		max: 50
	},
	federationIds: {
		type: [String]
	}
});

EventGroups.attachSchema(EventGroupSchema);