Session.set("selectedSportId", null);
Session.set("selectedRegion", null);

Template.info.helpers({
	sports: function() {
		var sportId = Session.get("selectedSportId");
		if (sportId) {
			return Sports.find({_id: sportId});
		}
		return Sports.find({},{sort: {title: 1}});
	},
	sportfederations: function() {
		var sportId = this._id,
			regionId = Session.get("selectedRegion");
		if (regionId) {
			return Federations.find({sportId: sportId, locationId: regionId}, {sort: {title: 1}});
		}
		return Federations.find({sportId: sportId}, {sort: {title: 1}});
	},
	isAdmin: function() {
		var roles = UserRoles.findOne(Meteor.userId());
		return (roles && roles.admin);
	},
	action: function() {
		var roles = UserRoles.findOne(Meteor.userId());
		if (roles && roles.admin) {
			return "Редагування";
		} else {
			return "Перегляд";
		}
	},
	regions: function() {
		//var data = Session.get("selectedRegions");
		return getRegionsHierarchy();
	},
	probely: function() {
		if (this.padding == 1) {
			return "&nbsp;&nbsp;&nbsp;&nbsp;";
		} else if (this.padding == 2) {
			return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		} else {
			return "";
		}
	},
	isSelected: function() {
		if (this.region._id === Session.get("selectedRegion")) {
			return "selected";
		} else {
			return "";
		}
	}
});

Template.info.events({
	'change .sportId': function(e, t) {
		var sportId = $(".sportId .selected").attr("data-value");
		if (sportId == "ALL") {
			Session.set("selectedSportId", null);
		} else {
			Session.set("selectedSportId", sportId);
		}
	},
	'change .region': function(e, t) {
		var regionId = $(".region .selected").attr("data-value");
		if (regionId == "ALL") {
			Session.set("selectedRegion", null);
		} else {
			Session.set("selectedRegion", regionId);
		}
		return false;
	}
});

Template.info.rendered = function() {
	$(".dropdown").dropdown();
};
