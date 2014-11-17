Session.set("selectedEditFederationId", null);
Session.set("selectedRegion", null);

getFederationByRegions = function(result, region) {
	result.push({region: region.region});
	var federations = Federations.find({sportId: Session.get("selectedSportId"), regionId: region.region._id}, {sort: {title: 1}}).fetch();
	for (var i=0; i<federations.length; i++) {
		result.push({federation: federations[i]});
	}
	return result;
}

Template.sportfederations.helpers({
	federations: function() {
		var regions = getRegionsHierarchy(),
			result = [];
		for (var i=0; i<regions.length; i++) {
			getFederationByRegions(result, regions[i]);
		}
		return result;
	},
	sport: function() {
		return Sports.findOne(Session.get("selectedSportId"));
	}
});

Template.sportfederations.events({
	'click .addFederation': function(e, t) {
		e.preventDefault();
		Session.set("selectedRegion", this.region);
		$("#modalFederation").modal("show");
	},
	'click .editFederation': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditFederationId", this._id);
		$("#modalFederation").modal("show");
	},
	'click .removeFederation': function(e, t) {
		var federation = Federations.findOne(this._id);
		Session.set("deleteModalObject", federation.title);
		Session.set("deleteModalObjectId", federation._id);
		deleteCallback = function() {
			Federations.remove(Session.get("deleteModalObjectId"), function(err) {
				if (!err) {
					toastr.success(Session.get("deleteModalObject"), "Об'єкт успішно видалено");
				} else {
					toastr.error(Session.get("deleteModalObject"), "Об'єкт не видалено");
				}
			});
		}
		$("#confirmationDeleteModal").modal("show");
	},
	'click .editContactsFederation': function(e, t) {
		e.preventDefault();
		//Router.go("/sport/"+this._id+"/federations");
	},
	'click .editAdminsFederation': function(e, t) {
		e.preventDefault();
		//Router.go("/sport/"+this._id+"/federations");
	}
});

Template.modalFederation.helpers({
	modalTitle: function() {
		if (Session.get("selectedEditFederationId")) {
			return "Редагувати спортивне об'єднання";
		} else {
			return "Додати спортивне об'єднання";
		}
	},
	editFederation: function() {
		if (Session.get("selectedEditFederationId")) {
			var federation = Federations.findOne(Session.get("selectedEditFederationId"));
			return {title: federation.title};
		} else {
			return {title: ""};
		}
	},
	region: function() {
		if (Session.get("selectedRegion")) {
			return Session.get("selectedRegion").title;
		} else {
			return "";
		}
	}
});

Template.modalFederation.events({
	'click .saveFederation': function(e, t) {
		var title = $("#title").val();
		if (Session.get("selectedEditFederationId")) {
			Federations.update(Session.get("selectedEditFederationId"), {$set: {title: title}}, function(err) {
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено");
				} else {
					toastr.error(title, "Об'єкт не збережено");
				}
			});
		} else {
			Federations.insert({title: title,
				regionId: Session.get("selectedRegion")._id,
				sportId: Session.get("selectedSportId")
			}, function(err) {
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено");
				} else {
					toastr.error(title, "Об'єкт не збережено");
				}
			});
		}
		Session.set("selectedEditFederationId", null);
		$("#modalFederation").modal("hide");
	}
});
