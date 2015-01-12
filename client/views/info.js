Template.info.helpers({
	sports: function() {
		return Sports.find();
	},
	sportfederations: function() {
		var sportId = this._id;
		return Federations.find({sportId: sportId});
	}
});