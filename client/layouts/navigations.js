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

Template.topnav.rendered = function() {
	$('.leftnav').first().sidebar('attach events', '.toggleLeftnav');
	$('.toggleLeftnav').removeClass('disabled');
	$('.leftnav').first().sidebar('attach events', '.leftnav .item', 'hide');
};

Template.leftnav.helpers({
	isLogin: function() {
		if (!Meteor.user()) {
			return "hidden";
		} else {
			return "";
		}
	},
	isAdmin: function() {
		return "hidden";
	}
});

Template.leftnav.events({
	'click .logout': function(e, t) {
		Meteor.logout();
	}
})
