Federations = new Meteor.Collection("federations");

var FederationSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Назва спортивного об'єднання",
    max: 200
  },
  address: {
    type: String,
    label: "Адреса",
    max: 200,
    optional: true
  },
  phones: {
    type: String,
    label: "Телефони",
    max: 200,
    optional: true
  },
  contactIds: {
    type: [String],
    label: "Перелік користувачів",
    optional: true
  },
  regionId: {
    type: String,
    label: "Регіон/населений пункт",
    max: 50
  },
  sportId: {
    type: String,
    label: "Вид спорту",
    max: 50
  },
  adminIds: {
    type: [String],
    label: 'Адміністратори',
    optional: true
  }
});

Federations.attachSchema(FederationSchema);
