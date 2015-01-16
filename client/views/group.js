drawChart = function(el) {
	var options = {

		///Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - Whether the line is curved between points
		bezierCurve : false,

		//Boolean - Whether to show a dot for each point
		pointDot : true,

		//Number - Radius of each point dot in pixels
		pointDotRadius : 4,

		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,

		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		pointHitDetectionRadius : 20,

		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,

		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,

		//Boolean - Whether to fill the dataset with a colour
		datasetFill : false,

		legendTemplate : "<% for (var i=0; i<datasets.length; i++){%><div style=\"text-align:center;background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></div><%}%>"

	};
	var group = Groups.findOne(Session.get("selectedGroupId")),
		qualifications = Qualifications.find({federationId: group.federationId}, {fields: {_id: 1, title: 1}}),
		labels = [],
		datasets = [],
		needAdd = true;
	qualifications.forEach(function(item) {
		var values = Values.find({destinationId: el, groupId: Session.get("selectedGroupId"), qualificationId: item._id}, {
			sort: {ratedAt: -1}, limit: 5
		});
		var data = [];
		values.forEach(function(value) {
			if (needAdd) {
				labels.push(value.ratedAt);
			}
			data.push(value.result);
		});
		console.log(item, item.title);
		needAdd = false;
		datasets.push({
			label: item.title,
			data: data
		});
	});
	console.log(labels, datasets);
	var data = {
		labels: labels,
		datasets: datasets
	};
	if (labels.length > 0) {
		var ctx = document.getElementById(el).getContext("2d");
		var myLineChart = new Chart(ctx).Line(data, options);
		$("#l"+el).html(myLineChart.generateLegend());
	} else {
		var ctx = document.getElementById(el).getContext("2d");
		$("#l"+el).html("Ще не оцінювався");
	}
}

Template.group.helpers({
	group: function() {
		return Groups.findOne(Session.get("selectedGroupId"));
	},
	userRates: function() {
		var group = Groups.findOne(Session.get("selectedGroupId")),
			rates = Qualifications.find({federationId: group.federationId}),
			result = [],
			userId = this.valueOf();
		rates.forEach(function(rate) {
			var values = Values.find({qualificationId: rate._id, groupId: Session.get("selectedGroupId"), destinationId: userId}, {sort: {ratedAt: -1}}).fetch();
			if (values.length > 0) {
				result.push(values[0]);
			}
		});
		return result;
	},
	additional: function() {
		var num = this.result,
			qualification = Qualifications.findOne(this.qualificationId);
		return {
			percent: (num * 100/(qualification.max - qualification.min)),
			name: qualification.title + " (" + qualification.min + " - " + qualification.max + ")"
		};
	}
});

Template.group.events({
	'click .rate': function(e, t) {
		var userId = e.currentTarget.id;
		if (userId == Meteor.users.findOne({_id: {$ne: Meteor.userId()}})) {
			console.log(Meteor.users.findOne({_id: {$ne: Meteor.userId()}}))
		}
		Session.set("selectedMemberId", userId);
		Session.set("modalWindow", "modalRateMember");
		$(".modalWindow").modal("show");
	}
});

Template.group.rendered = function() {
	/*var group = Groups.findOne(Session.get("selectedGroupId"));
	_.each(group.userIds, function(el) {
		drawChart(el);
	});*/
}

Template.modalRateMember.helpers({
	userId: function() {
		return Session.get("selectedMemberId");
	},
	rates: function() {
		var group = Groups.findOne(Session.get("selectedGroupId"));
		return Qualifications.find({federationId: group.federationId}, {sort: {title: 1}});
	}
})

Template.modalRateMember.events({
	'click .cancel': function(e, t) {
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	},
	'click .saveRate': function(e, t) {
		var group = Groups.findOne(Session.get("selectedGroupId")),
			rates = Qualifications.find({federationId: group.federationId});
		rates.forEach(function(rate) {
			var value = $("#"+rate._id).val();
			Values.insert({
				qualificationId: rate._id,
				result: value,
				groupId: Session.get("selectedGroupId"),
				destinationId: Session.get("selectedMemberId")
			});
		}, function(err) {
			console.log(err);
		});
		//drawChart(Session.get("selectedMemberId"));
		Session.set("modalWindow", null);
		$(".modalWindow").modal("hide");
	}
})