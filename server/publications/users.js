Meteor.publish('myAccount', function() {
	return Meteor.users.find(this.userId);
});

Meteor.publish("userProfile", function(uId) {
	return UserProfiles.find({_id: uId});
});

Meteor.publish("userAvatar", function(uId) {
	return Avatars.find({"metadata.owner": uId});
});