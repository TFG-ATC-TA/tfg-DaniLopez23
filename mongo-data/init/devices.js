// devices.js
try {
  db.devices.insertMany([
    {
      _id: ObjectId("673b5c5ed5c203a653ace6a5"),
      boardId: "00",
      type: "Flotador",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      equipment: ObjectId("673b5c5ed5c203a653ace6a0"),
      description: "Flotador",
      sensors: [
        {
          sensorId: "00",
          name: "tank_temperature_probes",
          description: "Sensor de temperatura de leche en el tanque",
          _id: ObjectId("673b5c5ed5c203a653ace6a6"),
        },
        {
          sensorId: "00",
          name: "6_dof_imu",
          description: "Sensor de giroscopio y acelerometro del flotador",
          _id: ObjectId("673b5c5ed5c203a653ace6a7"),
        },
        {
          sensorId: "00",
          name: "board_temperature",
          description: "Sensor de estado del board",
          _id: ObjectId("673b5c5ed5c203a653ace6a7"),
        },
      ],
      __v: 0,
    },
    {
      _id: ObjectId("673c5faf96fa6f70e1296a39"),
      boardId: "01",
      type: "Estación del tanque",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      equipment: ObjectId("673b5c5ed5c203a653ace6a0"),
      description: "Sensórica del propio tanque",
      sensors: [
        {
          _id: ObjectId("673c5faf96fa6f70e1296a34"),
          sensorId: "00",
          name: "tank_distance",
          description: "Sensor de distancia de leche con el techo del tanque",
        },
        {
          _id: ObjectId("673c5faf96fa6f70e1296a35"),
          sensorId: "00",
          name: "magnetic_switch",
          description: "Sensor de escotilla del tanque",
        },
        {
          _id: ObjectId("673c5faf96fa6f70e1296a36"),
          sensorId: "00",
          name: "encoder",
          description: "Sensor de velocidad de palas",
        },
        {
          _id: ObjectId("673c5faf96fa6f70e1296a37"),
          sensorId: "01",
          name: "encoder",
          description: "Sensor de velocidad de palas",
        },
        {
          _id: ObjectId("673c5faf96fa6f70e1296a38"),
          sensorId: "00",
          name: "board_temperature",
          description: "Sensor de estado del board",
        },
      ],
      __v: 0,
    },
    {
      _id: ObjectId("673c5fcd82a7a2e52157086d"),
      boardId: "02",
      type: "Estación de pesado",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      equipment: ObjectId("673b5c5ed5c203a653ace6a0"),
      description:
        "Sensórica de la estación de pesado de productos de limpieza",
      sensors: [
        {
          _id: ObjectId("673c5faf96fa6f70e1296a34"),
          sensorId: "00",
          name: "weight",
          description: "Sensor de peso",
        },
      ],
      __v: 0,
    },
    {
      _id: ObjectId("673c613696fa6f70e1296a3f"),
      boardId: "04",
      type: "Estación del tanque",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      equipment: ObjectId("673b5c5ed5c203a653ace6a0"),
      description: "Sensórica del propio tanque",
      sensors: [
        {
          _id: ObjectId("673c613696fa6f70e1296a3a"),
          sensorId: "00",
          name: "tank_distance",
          description: "Sensor de distancia de leche con el techo del tanque",
        },
        {
          _id: ObjectId("673c613696fa6f70e1296a3b"),
          sensorId: "00",
          name: "magnetic_switch",
          description: "Sensor de escotilla del tanque",
        },
        {
          _id: ObjectId("673c613696fa6f70e1296a3c"),
          sensorId: "00",
          name: "encoder",
          description: "Sensor de velocidad de palas",
        },
        {
          _id: ObjectId("673c613696fa6f70e1296a3d"),
          sensorId: "01",
          name: "encoder",
          description: "Sensor de velocidad de palas",
        },
        {
          _id: ObjectId("673c613696fa6f70e1296a3e"),
          sensorId: "00",
          name: "board_temperature",
          description: "Sensor de estado del board",
        },
      ],
      __v: 0,
    },
    {
      _id: ObjectId("673c625296fa6f70e1296a48"),
      boardId: "03",
      type: "Flotador",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      equipment: ObjectId("673b5c5ed5c203a653ace6a0"),
      description: "Flotador",
      sensors: [
        {
          _id: ObjectId("673b5c5ed5c203a653ace6a6"),
          sensorId: "00",
          name: "tank_temperature_probes",
          description: "Sensor de temperatura de leche en el tanque",
        },
        {
          _id: ObjectId("673b5c5ed5c203a653ace6a7"),
          sensorId: "00",
          name: "6_dof_imu",
          description: "Sensor de giroscopio y acelerometro del flotador",
        },
        {
          _id: ObjectId("673b5c5ed5c203a653ace6a7"),
          sensorId: "00",
          name: "board_temperature",
          description: "Sensor de estado del board",
        },
      ],
      __v: 0,
    },
    {
      _id: ObjectId("673c655a6aba690baf41798d"),
      boardId: "05",
      type: "Estación de pesado",
      farm: ObjectId("673b5c5ed5c203a653ace69a"),
      equipment: ObjectId("673b5c5ed5c203a653ace6a0"),
      description:
        "Sensórica de la estación de pesado de productos de limpieza",
      sensors: [
        {
          sensorId: "00",
          name: "weight",
          description: "Sensor de peso",
          _id: ObjectId("673c655a6aba690baf41798c"),
        },
      ],
      __v: 0,
    },
  ]);
} catch (e) {
  print("Error inserting devices: " + e);
}
