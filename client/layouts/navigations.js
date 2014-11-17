Template.topnav.helpers({
	isAdmin: function() {
		var user = Meteor.user();
		if (user) {
			if (Roles.userIsInRole(user, "admin", Roles.GLOBAL_GROUP)) {
				return true;
			}
		}
		return false;
	}
});
