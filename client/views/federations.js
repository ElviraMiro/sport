Session.set("selectedEditFederationId", null);
Session.set("selectedRegion", null);

Template.sportfederations.helpers({
	federations: function() {
		var result = getFederationsHierarchy(Session.get("selectedSportId"));
		return result;
	},
	sport: function() {
		return Sports.findOne(Session.get("selectedSportId"));
	}
});

Template.sportfederations.events({
	'click .addFederation': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditFederationId", null);
		Session.set("modalWindow", "modalFederation");
		$(".modalWindow").modal("show");
	},
	'click .editFederation': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditFederationId", this.federation._id);
		Session.set("modalWindow", "modalFederation");
		$(".modalWindow").modal("show");
	},
	'click .removeFederation': function(e, t) {
		var federation = this.federation;
		Session.set("deleteModalObject", federation.title);
		Session.set("deleteModalObjectId", federation._id);
		Session.set("modalWindow", "modalDeleteFederation");
		$(".modalWindow").modal("show");
	},
	'click .lookFederation': function(e, t) {
		e.preventDefault();
		Router.go("/sport/"+this.federation.sportId+"/federation/"+this.federation._id);
	}
});

Template.modalFederation.rendered = function() {
	$("#region").dropdown();
	$("#parent").dropdown();
};

Template.modalFederation.helpers({
	modalTitle: function() {
		if (Session.get("selectedEditFederationId")) {
			return "Редагувати об'єднання";
		} else {
			return "Додати об'єднання";
		}
	},
	editFederation: function() {
		if (Session.get("selectedEditFederationId")) {
			var federation = Federations.findOne(Session.get("selectedEditFederationId"));
			return federation;
		} else {
			return {title: ""};
		}
	},
	regions: function() {
		return Regions.find({}, {sort: {title: 1}});
	},
	isSelRegion: function() {
		var federationId = Session.get("selectedEditFederationId");
		if (federationId) {
			var federation = Federations.findOne(federationId);
			if (this._id == federation.locationId) {
				return "selected";
			}
		}
		return "";
	},
	parents: function() {
		var federation = Session.get("selectedEditFederationId");
		if (federation) {
			return Federations.find({_id: {$ne: federation}}, {sort: {title: 1}});
		} else {
			return Federations.find({}, {sort: {title: 1}});
		}
	},
	isSelParent: function() {
		var federationId = Session.get("selectedEditFederationId");
		if (federationId) {
			var federation = Federations.findOne(federationId);
			if (federation.parentId && (this._id == federation.parentId)) {
				return "selected";
			}
		}
		return "";
	}
});

Template.modalFederation.events({
	'click .saveFederation': function(e, t) {
		var title = $("#title").val()
			region = $("#region option:selected").val(),
			parent = $("#parent option:selected").val();
		if (parent == "0") {
			parent = null;
		};
		if (Session.get("selectedEditFederationId")) {
			Federations.update(Session.get("selectedEditFederationId"), {$set: {title: title, locationId: region, parentId: parent}}, function(err) {
				console.log(err);
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено", 1000);
				} else {
					toastr.error(title, "Об'єкт не збережено", 1000);
				}
			});
		} else {
			Federations.insert({title: title,
				locationId: region,
				sportId: Session.get("selectedSportId"),
				parentId: parent
			}, function(err) {
				console.log(err);
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено", 1000);
				} else {
					toastr.error(title, "Об'єкт не збережено", 1000);
				}
			});
		}
		Session.set("selectedEditFederationId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'click .cancel': function(e, t) {
		Session.set("selectedEditFederationId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	}
});

Template.modalDeleteFederation.helpers({
	deleteFederation: function() {
		return Session.get("deleteModalObject");
	}
});

Template.modalDeleteFederation.events({
	'click .deleteFederation': function(e, t) {
		Federations.remove(Session.get("deleteModalObjectId"), function(err) {
			if (!err) {
				toastr.success(Session.get("deleteModalObject"), "Об'єкт успішно видалено", 1000);
			} else {
				toastr.error(Session.get("deleteModalObject"), "Об'єкт не видалено", 1000);
			}
		});
		Session.set("deleteModalObject", null);
		Session.set("deleteModalObjectId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'click .cancel': function(e, t) {
		Session.set("deleteModalObject", null);
		Session.set("deleteModalObjectId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	}
});