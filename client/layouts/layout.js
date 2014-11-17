Template.confirmationDeleteModal.helpers({
    deleteInfo: function() {
        return Session.get("deleteModalObject");
    }
});

Template.confirmationDeleteModal.events({
    'click .yesDelete': function() {
        deleteCallback();
        $("#confirmationDeleteModal").modal('hide');
    }
});
