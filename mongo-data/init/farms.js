// farms.js
try {
  db.farms.insertMany([
    {
      _id: ObjectId("673b5c5ed5c203a653ace69a"),
      name: "Granja Los Prados",
      idname: "prados_001",
      broker: "synthetic-farm-1",
      users: [
        ObjectId("673b5c5ed5c203a653ace691"),
        ObjectId("673b5c5ed5c203a653ace698"),
      ],
      equipments: [
        ObjectId("673b5c5ed5c203a653ace6a0"),
        ObjectId("673b5c5ed5c203a653ace6a2"),
        ObjectId("673c63f46aba690baf41798a"),
        ObjectId("673c65b96aba690baf41798f"),
      ],
      __v: 1,
    },
    {
      _id: ObjectId("673b5c5ed5c203a653ace69a"),
      name: "Granja La Dehesa",
      idname: "dehesa_001",
      broker: "farm-01",
      users: [
        ObjectId("673b5c5ed5c203a653ace691"),
        ObjectId("673b5c5ed5c203a653ace698"),
      ],
      equipments: [
        ObjectId("673b5c5ed5c203a653ace6a0"),
        ObjectId("673b5c5ed5c203a653ace6a2"),
        ObjectId("673c63f46aba690baf41798a"),
        ObjectId("673c65b96aba690baf41798f"),
      ],
      __v: 1,
    },
    {
      _id: ObjectId("673b5c5ed5c203a653ace69c"),
      name: "Granja El Roble",
      idname: "roble_002",
      broker: "synthetic-farm-2",
      users: [ObjectId("673b5c5ed5c203a653ace691")],
      equipments: [],
      __v: 0,
    },
  ]);
} catch (e) {
  print("Error inserting farms: " + e);
}
