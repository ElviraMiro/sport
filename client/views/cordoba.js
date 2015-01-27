Template.cordoba.rendered = function() {
    moment.locale("uk");
    var date = moment(new Date()).format('DD-MM-YYYY'),
        date1 = "<span class='circular ui icon button blue dayleft'><i class='angle double left icon'></i></span> "+date+" <span class='circular ui icon button blue dayright'><i class='angle double right icon'></i></span>",
        events = [],
        nows = new Date(2015, 0, 14),
        nowe = new Date(2015, 0, 15);
    Meteor.call("setCalendarData", nows, nowe);
    $('#time').highcharts({
        chart: {
            backgroundColor: '#f7f7f7',
            plotBackgroundColor: '#f7f7f7',
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: date1,
            useHTML: true,
            y: 30,
            align: 'center'
        },
        tooltip: {
            pointFormat: '{series.name}'
        },
        plotOptions: {
            pie: {
                center: ['50%', '50%'],
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                }
            }
        },
        credits: {
            enabled: false
        }
    });
    var userGroups = userIsUserInGroups(Meteor.userId()),
        data = [],
        percent = 90;
    Events.find().forEach(function(event) {
        var time = "".concat(moment(event.startedAt).format("HH:mm"), "-", moment(event.finishedAt).format("HH:mm"));
        data.push({
            id: event._id,
            name:time,
            color: '#7cb5ec',
            cursor: 'pointer',
            y: 45.0,
            events: {
                click: function () {
                    Session.set("selectedEventId",this.id);
                }
            }
        });
    });
    chart = $("#time").highcharts();
    chart.addSeries({
        type: 'pie',
        name: date,
        innerSize: '40%',
        size: "100%",
        data: data/*,
        dataLabels: {
            formatter: function () {
                // display only if larger than 1
                return '<b>' + this.point.name +'</b>';
            }
        }*/
    });
}

Template.cordoba.helpers({
    event: function() {
        var event = Events.findOne(Session.get("selectedEventId")),
            type = EventTypes.findOne(event.eventTypeId),
            location = Locations.findOne(event.locationId),
            time = "".concat(moment(event.startedAt).format("HH:mm"), "-", moment(event.finishedAt).format("HH:mm"));
        return {
            time: time,
            title: event.description,
            type: type.title,
            location: location.title
        }
    }
});

Template.cordoba.events({

});