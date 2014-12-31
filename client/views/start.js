Template.start.helpers({
    calendarOptions: {
        // Standard fullcalendar options
        height: 700,
        contentHeight: "auto",
        aspectRatio: 2,
        timezone: "local",
        //hiddenDays: [ 0 ],
        defaultView: "agendaWeek",
        axisFormat: "HH:mm",
        slotDuration: '00:30:00',
        minTime: '07:00:00',
        maxTime: '23:00:00',
        lang: 'uk',
        // Function providing events reactive computation for fullcalendar plugin
        events: function(start, end, timezone, callback) {
            //console.log(start);
            //console.log(end);
            //console.log(timezone);
            var events = [];
            console.log(start.toDate(), end.toDate());
            Meteor.call("getEvents", start.toDate(), end.toDate(), function(err, events){
                console.log("ERROR", err);
                console.log("EVENTS", events);
                callback(events);
            });
        },
        dayClick: function(date, jsEvent, view) {
            Session.set("selectedDate", date.toDate());
            Session.set("selectedTime", date.format("(H)"));
            Session.set("modalWindow", "modalAddEvent");
            $(".modalWindow").modal("show");
        },
        eventClick: function(calEvent, jsEvent, view) {
            // change the border color just for fun
            $(this).css('border-color', 'red');
        },
        // Optional: id of the calendar
        id: "calendar",
        // Optional: Additional classes to apply to the calendar
        //addedClasses: "ten wide column",
        // Optional: Additional functions to apply after each reactive events computation
        autoruns: [
            function () {
                //console.log("user defined autorun function executed!");
            }
        ]
    },
});

Template.modalAddEvent.rendered = function() {
    $("#typeSelect").dropdown();
    $("#location").dropdown();
    $('.ui.checkbox').checkbox();
}

Template.modalAddEvent.helpers({
    'start': function() {
        return moment(Session.get("selectedDate")).format("YYYY-MM-DD");
    },
    'end': function() {
        return moment(Session.get("selectedDate")).format("YYYY-MM-DD");
    },
    eventTypes: function() {
        return EventTypes.find({$or: [{ownerId: null}, {ownerId: Meteor.userId()}]});
    },
    locations: function() {
        return Locations.find({ownerId: Meteor.userId()});
    }
});

Template.modalAddEvent.events({
    'click .cancel': function(e, t) {
        Session.set("modalWindow", null);
        Session.set("selectedDate", null);
        $(".modalWindow").modal("hide");
    },
    'click .eraseType': function(e, t) {
        e.preventDefault();
        $("#eventTypeNew").val("");
        return false;
    },
    'click .eraseLocation': function(e, t) {
        e.preventDefault();
        $("#locationNew").val("");
        return false;
    },
    'click .saveEvent': function(e, t) {
        var eventData = {
            type: $("#eventType .text").html(),
            description: $("#description").val(),
            start: $("#start").val(),
            startHour: $("#startHour").val(),
            startMinute: $("#startMinute").val(),
            end: $("#start").val(),
            endHour: $("#endHour").val(),
            endMinute: $("#endMinute").val(),
            location: $("#location option:selected").val(),
            locationNew: $("#locationNew").val(),
            forGroup: $("#forGroup").is(":checked")
        };
        console.log(eventData);
        return false;
        if (eventData.newType != "") {
            var typeId = EventTypes.insert({
                title: eventData.newType,
                ownerId: Meteor.userId()
            });
        } else {
            var typeId = eventData.type;
        }
        if (eventData.locationNew != "") {
            var locationId = Locations.insert({
                title: eventData.locationNew,
                ownerId: Meteor.userId()
            });
        } else {
            var locationId = eventData.location;
        };
        if (eventData.startHour == "") {
            var sh = "00";
        } else {
            var sh = eventData.startHour;
        };
        if (eventData.startMinute == "") {
            var sm = "00";
        } else {
            var sm = eventData.startMinute;
        };
        if (eventData.endHour == "") {
            var eh = "23";
        } else {
            var eh = eventData.endHour;
        };
        if (eventData.endMinute == "") {
            var em = "59";
        } else {
            var em = eventData.endMinute;
        };
        var start = eventData.start.split("-");
        var end = eventData.end.split("-");
        start = new Date(start[0], (start[1] - 1), start[2], sh, sm);
        end = new Date(end[0], (end[1] - 1), end[2], eh, em);
        Events.insert({
            eventTypeId: typeId,
            locationId: locationId,
            startedAt: start,
            finishedAt: end,
            description: eventData.description,
            adminIds: [Meteor.userId()]
        });
    }
});