Template.profile.helpers({
	isMine: function() {
		if (Session.get("selectedUserId") == Meteor.userId()) {
			return true;
		}
		return false;
	},
	userId: function() {
		return Session.get("selectedUserId");
	},
	profile: function() {
		var profile = UserProfiles.findOne({userId: Meteor.userId()})
		return profile;
	}
});

Template.profile.events({
	'click .changeAvatar': function(event, template) {
		$('.myAvatarInput').click();
	},
	'change .myAvatarInput': function(event, template) {
		var files = event.target.files;
		if (files && files[0]) {
			var fsFile = new FS.File(files[0]);
			fsFile.attachData(files[0]);
			console.log(files[0]);
			fsFile.metadata = {owner: Meteor.userId()};
			Avatars.insert(fsFile, function (err, fileObj) {
				var aaa = Avatars.find({"metadata.owner": Meteor.userId(), _id: {$ne: fileObj._id}}).fetch();
				for (var i=0; i<aaa.length;i++){
					Avatars.remove(aaa[i]._id);
				}
				if (!err) {
					toastr.success("Аватарку замінено");
				} else {
					toastr.error("Аватарка не замінена");
				}
			});
		}
	},
	'click #save': function(e, t) {
		e.preventDefault();
		var fn = $("#firstName").val(),
			sn = $("#secondName").val(),
			p = $("#surname").val(),
			phones = $("#phones").val(),
			profile = UserProfiles.findOne({userId: Meteor.userId()});
		if (profile) {
			UserProfiles.update(profile._id, {$set: {firstName: fn, secondName: sn, surname: p, phones: phones}});
		}
		return false;
	}
});