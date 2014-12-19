Meteor.publish('myAccount', function() {
	return Meteor.users.find(this.userId);
});

Meteor.publish("userProfile", function(uId) {
	return UserProfiles.find({userId: uId});
});

Meteor.publish("userAvatar", function(uId) {
	return Avatars.find({"metadata.owner": uId});
});