Template.start.helpers({
    calendarOptions: {
        // Standard fullcalendar options
        height: 700,
        contentHeight: "auto",
        aspectRatio: 2,
        timezone: "local",
        //hiddenDays: [ 0 ],
        allDaySlot: false,
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
            Meteor.call("setCalendarData", start.toDate(), end.toDate());
            var userGroups = userIsUserInGroups(Meteor.userId()),
                events = [];
            Events.find().forEach(function(event) {
                var type = EventTypes.findOne(event.eventTypeId),
                    location = Locations.findOne(event.locationId);
                eventDetails = {
                    id: event._id,
                    title: type.title,
                    start: event.startedAt,
                    end: event.finishedAt,
                    editable: false,
                    color: "green"
                };
                events.push(eventDetails);
            });
            callback(events);
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
    $("#eventType").dropdown();
    $(".time").dropdown();
    $("#location").dropdown();
    $('.ui.checkbox').checkbox();
    $('.menu .tabitem').tab();
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
    },
    startHour: function() {
        var data = [];
        for (var i=7; i<23; i++) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    endHour: function() {
        var data = [];
        for (var i=7; i<23; i++) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    startMinute: function() {
        var data = [];
        for (var i=0; i<=55; i=i+5) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
    },
    endMinute: function() {
        var data = [];
        for (var i=0; i<=55; i=i+5) {
            if (i < 10) {
                data.push({name: "0".concat(i)});
            } else {
                data.push({name: "".concat(i)});
            }
        }
        return data;
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
        var typeNew = $("#eventType input.search").val(),
            locationNew = $("#location input.search").val(),
            location = "",
            type = "";
        if (typeNew == "") {
            type = $("[name='eventType']").val();
        }
        if (locationNew == "") {
            location = $("[name='location']").val();
        }
        var eventData = {
                type: type,
                typeNew: typeNew,
                description: $("#description").val(),
                start: $("#start").val(),
                startHour: $("#startHour option:selected").val(),
                startMinute: $("#startMinute option:selected").val(),
                end: $("#start").val(),
                endHour: $("#endHour option:selected").val(),
                endMinute: $("#endMinute option:selected").val(),
                location: location,
                locationNew: locationNew,
                forGroup: $("#forGroup").is(":checked")
            };
        if (eventData.typeNew != "") {
            var type = EventTypes.findOne({title: eventData.typeNew});
            if (type) {
                var typeId = type._id;
            } else {
                var typeId = EventTypes.insert({
                    title: eventData.typeNew,
                    ownerId: Meteor.userId()
                });
            }
        } else {
            var typeId = eventData.type;
        }
        if (eventData.locationNew != "") {
            var location = Locations.findOne({title: eventData.locationNew});
            if (location) {
                var locationId = location._id;
            } else {
                var locationId = Locations.insert({
                    title: eventData.locationNew,
                    ownerId: Meteor.userId()
                });
            }
        } else {
            var locationId = eventData.location;
        };
        var sh = eventData.startHour,
            sm = eventData.startMinute,
            eh = eventData.endHour,
            em = eventData.endMinute,
            start = eventData.start.split("-"),
            end = eventData.end.split("-");
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
        Session.set("modalWindow", null);
        Session.set("selectedDate", null);
        $(".modalWindow").modal("hide");
    }
});