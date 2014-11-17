Session.set("selectedUpRegionId", null);
Session.set("selectedEditRegionId", null);

Template.regions.helpers({
	regions: function() {
		return getRegionsHierarchy();
	}
});

Template.regions.events({
	'click .addRegion': function(e, t) {
		e.preventDefault();
		if (this.region) {
			Session.set("selectedUpRegionId", this.region._id);
		}
		$("#modalRegion").modal("show");
	},
	'click .editRegion': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditRegionId", this.region._id);
		$("#modalRegion").modal("show");
	},
	'click .removeRegion': function(e, t) {
		var region = Regions.findOne(this.region._id);
		Session.set("deleteModalObject", region.title);
		Session.set("deleteModalObjectId", region._id);
		deleteCallback = function() {
			Regions.remove(Session.get("deleteModalObjectId"), function(err) {
				if (!err) {
					toastr.success(Session.get("deleteModalObject"), "Об'єкт успішно видалено");
				} else {
					toastr.error(Session.get("deleteModalObject"), "Об'єкт не видалено");
				}
			});
		}
		$("#confirmationDeleteModal").modal("show");
	}
});

Template.modalRegion.helpers({
	modalTitle: function() {
		if (Session.get("selectedEditRegionId")) {
			return 'Редагувати регіон/населений пункт';
		} else {
			return 'Додати регіон/населений пункт';
		}
	},
	editRegion: function() {
		if (Session.get("selectedEditRegionId")) {
			var region = Regions.findOne(Session.get("selectedEditRegionId"));
			if (region.parentId) {
				var parent = Regions.findOne(region.parentId);
			}
			return {title: region.title, parent: parent.title};
		} else {
			if (Session.get("selectedUpRegionId")) {
				var region = Regions.findOne(Session.get("selectedUpRegionId"));
				return {parent: region.title, title: ""};
			} else {
				return {parent: false, title: ""};
			}
		}
	}
});

Template.modalRegion.events({
	'click .saveRegion': function(e, t) {
		var title = $("#title").val();
		if (Session.get("selectedEditRegionId")) {
			Regions.update(Session.get("selectedEditRegionId"), {$set: {title: title}});
		} else {
			if (Session.get("selectedUpRegionId")) {
				Regions.insert({title: title, parentId: Session.get("selectedUpRegionId")}, function(err) {
					if (!err) {
						toastr.success(title, "Об'єкт успішно збережено");
					} else {
						toastr.error(title, "Об'єкт не збережено");
					}
				});
			} else {
				Regions.insert({title: title}, function(err) {
					if (!err) {
						toastr.success(title, "Об'єкт успішно збережено");
					} else {
						toastr.error(title, "Об'єкт не збережено");
					}
				});
			}
		}
		Session.set("selectedUpRegionId", null);
		Session.set("selectedEditRegionId", null);
		$("#modalRegion").modal("hide");
	}
});
