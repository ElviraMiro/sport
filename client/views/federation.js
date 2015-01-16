Session.set("filter", {name1: "", name2: "", name3: ""});
Session.set("selectedContacts", []);
Session.set("selectedMembers", []);
Session.set("selectedTeachers", []);
Session.set("status", true);

var setUserFilter = _.throttle(function(template) {
    var name1 = $("#name1").val(),
        name2 = $("#name2").val(),
        name3 = $("#name3").val();
    Session.set("filter", {name1: name1, name2: name2, name3: name3});
    UserData.upsert({_id: Meteor.userId()}, {$set: {search: Session.get("filter")}});
}, 500);

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
	},
	groups: function() {
		return Groups.find({federationId: Session.get("selectedFederationId")});
	},
	rates: function() {
		return Qualifications.find({federationId: Session.get("selectedFederationId")}, {sort: {title: 1}});
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
	},
	'click .addContact': function(e, t) {
		Session.set("modalWindow", "modalAddContact");
		$(".modalWindow").modal("show");
	},
	'click .deleteContact': function(e, t) {
		var federation = Federations.findOne(Session.get("selectedFederationId")),
			contacts = federation.contacts,
			profileId = this.profileId,
			result = _.reject(contacts, function(el) {
				return (el.profileId == profileId);
			});
		Federations.update(Session.get("selectedFederationId"), {$set: {contacts: result}});
	},
	'click .contact': function(e, t) {
		Router.go("profile", {id: this.profileId});
	},
	'click .addGroup': function(e, t) {
		Session.set("selectedMembers", []);
		Session.set("selectedTeacher", null);
		Session.set("modalWindow", "modalAddGroup");
		$(".modalWindow").modal("show");
	},
	'click .group': function(e, t) {
		var federation = Federations.findOne({_id: Session.get("selectedFederationId"), admins: Meteor.userId()});
		if (federation) {
			Router.go("group", {id: this._id});
		} else {
			var roles = UserRoles.findOne(Meteor.userId());
			if (roles && (roles.admin)) {
				Router.go("group", {id: this._id});
			}
		}
	},
	'click .teacher': function(e, t) {
		Router.go("profile", {id: this});
	},
	'click .deleteGroup': function(e, t) {
		var groupId = this._id;
		Groups.remove(groupId);
	},
	'click .addRate': function(e, t) {
		Session.set("modalWindow", "modalAddRate");
		$(".modalWindow").modal("show");
	},
	'click .deleteRate': function(e, t) {
		var rateId = this._id;
		Qualifications.remove(rateId);
	}
});

Template.modalAddContact.helpers({
	users: function() {
		var result = [];
		if (Session.get("filter")) {
			result = filteredUserQuery(Session.get("filter"), Session.get("selectedContacts"));
		}
		return result;
	},
	contacts: function() {
		return Session.get("selectedContacts");
	}
});

Template.modalAddContact.events({
	'click .cancel': function() {
		Session.set("filter", {name1: "", name2: "", name3: ""});
		Session.set("selectedContacts", []);
		UserData.upsert(Meteor.userId(), {$set: {find: null, search: null}});
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'keyup .name': function(e, t) {
		setUserFilter(t);
	},
	'click .addContactUser': function(e, t) {
		var contacts = Session.get("selectedContacts");
		contacts.push(this._id);
		UserData.upsert(Meteor.userId(), {$set: {find: contacts}});
		Session.set("selectedContacts", contacts);
	},
	'click .saveContact': function(e, t) {
		var contacts = Session.get("selectedContacts"),
			result = _.map(contacts, function(id) {
				return {
					profileId: id,
					position: $("."+id).val()
				}
			});
		Federations.update({_id: Session.get("selectedFederationId")}, {$set: {contacts: result}});
		Session.set("filter", {name1: "", name2: "", name3: ""});
		Session.set("selectedContacts", []);
		UserData.upsert(Meteor.userId(), {$set: {find: null, search: null}});
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	}
});

Template.modalAddGroup.rendered = function() {
	$(".menu .item").tab();
};

Template.modalAddGroup.helpers({
	users: function() {
		var result = [];
		if (Session.get("filter")) {
			if (Session.get("status")) {
				result = filteredUserQuery(Session.get("filter"), Session.get("selectedTeachers"));
			} else {
				result = filteredUserQuery(Session.get("filter"), Session.get("selectedMembers"));
			}
		}
		return result;
	},
	members: function() {
		return Session.get("selectedMembers");
	},
	teachers: function() {
		return Session.get("selectedTeachers");
	}
});

Template.modalAddGroup.events({
	'click .cancel': function() {
		Session.set("filter", {name1: "", name2: "", name3: ""});
		Session.set("selectedMembers", []);
		Session.set("selectedTeachers", []);
		Session.set("status", true);
		UserData.upsert(Meteor.userId(), {$set: {find: null, search: null}});
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'keyup .name': function(e, t) {
		setUserFilter(t);
	},
	'click .addMembers': function(e, t) {
		var isTeacher = Session.get("status");
		if (isTeacher) {
			var teachers = Session.get("selectedTeachers"),
				members = Session.get("selectedMembers");
			teachers.push(this._id);
			UserData.upsert(Meteor.userId(), {$set: {find: members.concat(teachers)}});
			Session.set("selectedTeachers", teachers);
		} else {
			var teachers = Session.get("selectedTeachers"),
				members = Session.get("selectedMembers");
			members.push(this._id);
			UserData.upsert(Meteor.userId(), {$set: {find: members.concat(teachers)}});
			Session.set("selectedMembers", members);
		}
	},
	'click .saveGroup': function(e, t) {
		var members = Session.get("selectedMembers"),
			teachers = Session.get("selectedTeachers"),
			title = $(".title").val(),
			federation = Federations.findOne(Session.get("selectedFederationId"));
		Groups.insert({
			title: title,
			regionId: federation.locationId,
			federationId: federation._id,
			adminIds: teachers,
			userIds: members
		});
		Session.set("filter", {name1: "", name2: "", name3: ""});
		Session.set("selectedMembers", []);
		Session.set("selectedTeachers", []);
		Session.set("status", true);
		UserData.upsert(Meteor.userId(), {$set: {find: null, search: null}});
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'click .item[data-tab="info"]': function(e, t) {
		Session.set("status", true);
	},
	'click .item[data-tab="members"]': function(e, t) {
		Session.set("status", false);
	}
});

Template.modalAddRate.events({
	'click .cancel': function(e, t) {
		Session.set("modalWindow", null);
		$(".modalWindow").modal('hide');
	},
	'click .saveRate': function(e, t) {
		var title = $("#title").val(),
			description = $("#description").val(),
			min = $("#min").val(),
			max = $("#max").val();
		Qualifications.insert({
			title: title,
			description: description,
			min: min,
			max: max,
			federationId: Session.get("selectedFederationId")
		});
		Session.set("modalWindow", null);
		$(".modalWindow").modal('hide');
	}
});