UserProfiles = new Meteor.Collection("userprofiles");

var UserProfileSchema = new SimpleSchema({
	userId: {
		type: String,
		label: 'Посилання на ІД користувача',
		max: 50
	},
	firstName: {
		type: String,
		label: "Ім'я",
		max: 100,
		optional: true
	},
	secondName: {
		type: String,
		label: "По-батькові",
		max: 100,
		optional: true
	},
	surname: {
		type: String,
		label: "Фамілія",
		max: 100,
		optional: true
	},
	phones: {
		type: String,
		label: "Телефони",
		max: 250,
		optional: true
	},
	address: {
		type: String,
		label: "Адреса",
		max: 250,
		optional: true
	}
});

UserProfiles.attachSchema(UserProfileSchema);


var avatarStore = new FS.Store.GridFS("avatars", {
	transformWrite:  function(fileObj, readStream, writeStream) {
		gm(readStream, fileObj.name).resize('256^', '256^').gravity('Center').crop('256','256').stream().pipe(writeStream);
	},
	maxTries: 1,
	filter: {
	allow: {
		contentTypes: ['image/*']
	}
	}
});

Avatars = new FS.Collection("avatars", {
	stores: [avatarStore]
});

Meteor.users.after.insert(function(userId, doc) {
	var uId = doc._id;
	UserProfiles.insert({userId: uId});
});