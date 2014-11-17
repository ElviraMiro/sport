Session.set("selectedEditEventTypeId", null);

Template.eventtypes.helpers({
	eventtypes: function() {
		return EventTypes.find({}, {sort: {title: 1}});
	}
});

Template.eventtypes.events({
	'click .addEventType': function(e, t) {
		e.preventDefault();
		$("#modalEventType").modal("show");
	},
	'click .editEventType': function(e, t) {
		e.preventDefault();
		Session.set("selectedEditEventTypeId", this._id);
		$("#modalEventType").modal("show");
	},
	'click .removeEventType': function(e, t) {
		var eventtype = EventTypes.findOne(this._id);
		Session.set("deleteModalObject", eventtype.title);
		Session.set("deleteModalObjectId", eventtype._id);
		deleteCallback = function() {
			EventTypes.remove(Session.get("deleteModalObjectId"), function(err) {
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

Template.modalEventType.helpers({
	modalTitle: function() {
		if (Session.get("selectedEditEventTypeId")) {
			return 'Редагувати вид події';
		} else {
			return 'Додати вид події';
		}
	},
	editEventType: function() {
		if (Session.get("selectedEditEventTypeId")) {
			var eventtype = EventTypes.findOne(Session.get("selectedEditEventTypeId"));
			return {title: eventtype.title};
		} else {
			return {title: ""};
		}
	}
});

Template.modalEventType.events({
	'click .saveEventType': function(e, t) {
		var title = $("#title").val();
		if (Session.get("selectedEditEventTypeId")) {
			EventTypes.update(Session.get("selectedEditEventTypeId"), {$set: {title: title}}, function(err) {
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено");
				} else {
					toastr.error(title, "Об'єкт не збережено");
				}
			});
		} else {
			EventTypes.insert({title: title}, function(err) {
				if (!err) {
					toastr.success(title, "Об'єкт успішно збережено");
				} else {
					toastr.error(title, "Об'єкт не збережено");
				}
			});
		}
		Session.set("selectedEditEventTypeId", null);
		$("#modalEventType").modal("hide");
	}
});
