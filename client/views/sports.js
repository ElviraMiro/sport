Session.set("selectedEditSportId", null);

Template.sports.helpers({
	sports: function() {
		return Sports.find({}, {sort: {title: 1}});
	}
});

Template.sports.events({
	'click .addSport': function(e, t) {
		e.preventDefault();
		Session.set("modalWindow", "modalSport");
		$(".modalWindow").modal("show");
	},
	'click .editSport': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditSportId", this._id);
		Session.set("modalWindow", "modalSport");
		$(".modalWindow").modal("show");
	},
	'click .removeSport': function(e, t) {
		var sport = Sports.findOne(this._id);
		Session.set("deleteModalObject", sport.title);
		Session.set("deleteModalObjectId", sport._id);
		Session.set("modalWindow", "modalDeleteSport");
		$(".modalWindow").modal("show");
	},
	'click .editSportTeam': function(e, t) {
		e.preventDefault();
		Router.go("/sport/"+this._id+"/federations");
	}
});

Template.modalSport.helpers({
	modalTitle: function() {
		if (Session.get("selectedEditSportId")) {
			return 'Редагувати вид спорту';
		} else {
			return 'Додати вид спорту';
		}
	},
	editSport: function() {
		if (Session.get("selectedEditSportId")) {
			var sport = Sports.findOne(Session.get("selectedEditSportId"));
			return {title: sport.title};
		} else {
			return {title: ""};
		}
	}
});

Template.modalSport.events({
	'click .saveSport': function(e, t) {
		var title = $("#title").val();
		if (Session.get("selectedEditSportId")) {
			Sports.update(Session.get("selectedEditSportId"), {$set: {title: title}}, function(err) {
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено", 1000);
				} else {
					toastr.error(title, "Об'єкт не збережено", 1000);
				}
			});
		} else {
			Sports.insert({title: title}, function(err) {
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено", 1000);
				} else {
					toastr.error(title, "Об'єкт не збережено", 1000);
				}
			});
		}
		Session.set("selectedEditSportId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'click .cancel': function(e, t) {
		Session.set("selectedEditSportId", null);
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	}
});

Template.modalDeleteSport.helpers({
	deleteSport: function() {
		return Session.get("deleteModalObject");
	}
});

Template.modalDeleteSport.events({
	'click .deleteSport': function(e, t) {
		Sports.remove(Session.get("deleteModalObjectId"), function(err) {
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
	}
})
