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
		Session.set("modalWindow", "modalRegion");
		$(".modalWindow").modal("show");
	},
	'click .editRegion': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditRegionId", this.region._id);
		Session.set("modalWindow", "modalRegion");
		$(".modalWindow").modal("show");
	},
	'click .removeRegion': function(e, t) {
		var region = Regions.findOne(this.region._id);
		Session.set("deleteModalObject", region.title);
		Session.set("deleteModalObjectId", region._id);
		Session.set("modalWindow", "modalDeleteRegion");
		$(".modalWindow").modal("show");
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
						toastr.success(title, "Об'єкт успішно збережено", 1000);
					} else {
						toastr.error(title, "Об'єкт не збережено", 1000);
					}
				});
			} else {
				Regions.insert({title: title}, function(err) {
					if (!err) {
						toastr.success(title, "Об'єкт успішно збережено", 1000);
					} else {
						toastr.error(title, "Об'єкт не збережено", 1000);
					}
				});
			}
		}
		Session.set("selectedUpRegionId", null);
		Session.set("selectedEditRegionId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'click .cancel': function(e, t) {
		Session.set("modalWindow", null);
		Session.set("selectedUpRegionId", null);
		Session.set("selectedEditRegionId", null);
		$(".modalWindow").modal("hide");
	}
});

Template.modalDeleteRegion.helpers({
	deleteRegion: function() {
		return Session.get("deleteModalObject");
	}
});

Template.modalDeleteRegion.events({
	'click .cancel': function(e, t) {
		Session.set("modalWindow", null);
		Session.set("deleteModalObject", null);
		Session.set("deleteModalObjectId", null);
		$(".modalWindow").modal("hide");
	},
	'click .deleteRegion': function(e, t) {
		var subregions = Regions.find({parentId: Session.get("deleteModalObjectId")}).count();
		if (subregions == 0) {
			Regions.remove(Session.get("deleteModalObjectId"), function(err) {
				if (!err) {
					toastr.success(Session.get("deleteModalObject"), "Об'єкт успішно видалено", 1000);
				} else {
					toastr.error(Session.get("deleteModalObject"), "Об'єкт не видалено", 1000);
				}
			});
		} else {
			toastr.error(Session.get("deleteModalObject"), "Об'єкт не видалено - має підлеглі об'єкти", 1000);
		}
		Session.set("modalWindow", null);
		Session.set("deleteModalObject", null);
		Session.set("deleteModalObjectId", null);
		$(".modalWindow").modal("hide");
	}
})
