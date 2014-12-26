Template.federation.helpers({
	federation: function() {
		return Federations.findOne(Session.get("selectedFederationId"));
	},
	isAdmin: function() {
		var federation = Federations.findOne({_id: Session.get("selectedFederationId"), admins: Meteor.userId()});
		if (federation) {
			return true;
		} else {
			var roles = UserRoles.findOne(Meteor.userId());
			if (roles && (roles.admin)) {
				return true;
			}
			return false;
		}
	},
	location: function() {
		var federation = Federations.findOne(Session.get("selectedFederationId")),
			location = Regions.findOne(federation.locationId);
		return location;
	},
	parent: function() {
		var federation = Federations.findOne(Session.get("selectedFederationId"));
		if (federation.parentId) {
			return Federations.findOne(federation.parentId);
		}
		return false;
	}
});

Template.federation.events({
	'click .changeAvatar': function(event, template) {
		$('.myAvatarInput').click();
	},
	'change .myAvatarInput': function(event, template) {
		var files = event.target.files;
		if (files && files[0]) {
			var fsFile = new FS.File(files[0]);
			fsFile.attachData(files[0]);
			fsFile.metadata = {owner: Session.get("selectedFederationId")};
			Avatars.insert(fsFile, function (err, fileObj) {
				var aaa = Avatars.find({"metadata.owner": Session.get("selectedFederationId"), _id: {$ne: fileObj._id}}).fetch();
				for (var i=0; i<aaa.length;i++){
					Avatars.remove(aaa[i]._id);
				}
				if (!err) {
					toastr.success("Аватарку замінено", "", 1000);
				} else {
					toastr.error("Аватарка не замінена", "", 1000);
				}
			});
		}
	},
	'change #address': function(e, t) {
		var address = $("#address").val();
		Federations.update(Session.get("selectedFederationId"), {$set: {address: address}}, function(err) {
			if (!err) {
				toastr.success("Адреса збережена", "", 500);
			} else {
				toastr.error("Адреса не збережена", "", 500);
			}
		})
	},
	'change #phones': function(e, t) {
		var phones = $("#phones").val();
		Federations.update(Session.get("selectedFederationId"), {$set: {phones: phones}}, function(err) {
			if (!err) {
				toastr.success("Телефони збережені", "", 500);
			} else {
				toastr.error("Телефони не збережені", "", 500);
			}
		})
	}
});