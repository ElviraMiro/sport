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
		var roles = UserRoles.findOne(Meteor.userId());
		if (roles && roles.admin) {
			return "";
		}
		return "hidden";
	},
	groups: function() {
		return Groups.find({adminIds: Meteor.userId()});
	}
});

Template.leftnav.events({
	'click .logout': function(e, t) {
		Meteor.logout();
	}
})
