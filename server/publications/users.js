Meteor.publish('myAccount', function() {
	return [UserProfiles.find({userId: this.userId}),
		Avatars.find({"metadata.owner": this.userId}),
		UserRoles.find(this.userId)];
});

Meteor.publish("userProfile", function(uId) {
	return UserProfiles.find({userId: uId});
});

Meteor.publish("userAvatar", function(uId) {
	return Avatars.find({"metadata.owner": uId});
});