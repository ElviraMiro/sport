Meteor.publish("federationsInSport", function(sId) {
	var federations = Federations.find({sportId: sId}).fetch(),
		admins = [],
		contacts = [];
	for (var i=0; i<federations.length; i++) {
		if (federations.admins) {
			admins = admins.concat(federations[i].admins);
		}
		if (federations.contacts) {
			contacts = contacts.concat(federations[i].contacts);
		}
	}
	return [
		Sports.find({_id: sId}),
		Federations.find({sportId: sId}),
		Meteor.users.find({$or: [{_id: {$in: admins}}, {userId: {$in: contacts}}]}),
		UserProfiles.find({$or: [{userId: {$in: admins}}, {userId: {$in: contacts}}]}),
		Avatars.find({$or: [{"metadata.owner": {$in: admins}}, {'metadata.owner': {$in: contacts}}]}),
		Regions.find()
	]
});