// equipments.js (o tanks.js según tu modelo de datos)
try {
  db.equipments.insertMany([
    {
      _id: ObjectId("673b5c5ed5c203a653ace6a0"),
      name: "Tanque A",
      type: "Tanque de leche",
      height: 5000,
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      devices: [
        ObjectId("673b5c5ed5c203a653ace6a5"),
        ObjectId("673c5faf96fa6f70e1296a39"),
        ObjectId("673c5fcd82a7a2e52157086d"),
      ],
      associatedTanks: [],
      display: "horizontal",
      blades: "2",
      capacity: 5000,
      __v: 1,
    },
    {
      _id: ObjectId("673b5c5ed5c203a653ace6a2"),
      name: "Estación de Lavado A",
      type: "Estación de lavado",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      devices: [ObjectId("673c5fcd82a7a2e52157086d")],
      associatedTanks: [ObjectId("673b5c5ed5c203a653ace6a0")],
      __v: 0,
    },
    {
      _id: ObjectId("673c63f46aba690baf41798a"),
      name: "Tanque B",
      type: "Tanque de leche",
      height: 5000,
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      devices: [
        ObjectId("673c613696fa6f70e1296a3f"),
        ObjectId("673c625296fa6f70e1296a48"),
        ObjectId("673c655a6aba690baf41798d"),
      ],
      associatedTanks: [],
      display: "vertical",
      blades: "1",
      capacity: 5000,
      __v: 1,
    },
    {
      _id: ObjectId("673c65b96aba690baf41798f"),
      name: "Estación de Lavado B",
      type: "Estación de lavado",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      devices: [ObjectId("673c655a6aba690baf41798d")],
      associatedTanks: [ObjectId("673c63f46aba690baf41798a")],
      __v: 0,
    },
  ]);
} catch (e) {
  print("Error inserting equipments: " + e);
}
