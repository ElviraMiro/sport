Meteor.publish("group", function(gId) {
	var group = Groups.findOne(gId);
	return [
		Sports.find({_id: group.sportId}),
		Federations.find(group.federationId),
		Groups.find(gId),
		Meteor.users.find({$or: [
			{_id: {$in: group.adminIds}},
			{_id: {$in: group.userIds}}
		]}),
		UserProfiles.find({$or: [
			{_id: {$in: group.adminIds}},
			{_id: {$in: group.userIds}}
		]}),
		Avatars.find({$or: [
			{"metadata.owner": {$in: group.adminIds}},
			{"metadata.owner": {$in: group.userIds}}
		]}),
		Values.find({groupId: gId}),
		Qualifications.find({federationId: group.federationId})
	]
});