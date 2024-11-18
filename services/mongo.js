const mongoose = require("mongoose");
const User = require("../models/User");
const Farm = require("../models/Farm");
const Equipment = require("../models/Equipment");
const Device = require("../models/Device");
const Collection = require("../models/Collection");
// Función para conectarse a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/tfg", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

// Función para cargar datos de ejemplo
const seedDatabase = async () => {
  try {
    console.log("Eliminando datos existentes...");
    await User.deleteMany({});
    await Farm.deleteMany({});
    await Equipment.deleteMany({});
    await Device.deleteMany({});
    await Collection.deleteMany({});

    console.log("Insertando datos de ejemplo...");

    // Crear Usuarios
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      role: "Administrador",
      farms: [],
    });

    const farmerUser = await User.create({
      name: "John",
      email: "john@example.com",
      role: "Ganadero",
      farms: [],
    });

    // Crear Granjas
    const farm1 = await Farm.create({
      name: "Granja Los Prados",
      idname: "prados_001",
      users: [adminUser._id, farmerUser._id],
      equipments: [],
    });

    const farm2 = await Farm.create({
      name: "Granja El Roble",
      idname: "roble_002",
      users: [adminUser._id],
      equipments: [],
    });

    // Actualizar usuarios con granjas asociadas
    adminUser.farms.push(farm1._id, farm2._id);
    farmerUser.farms.push(farm1._id);
    await adminUser.save();
    await farmerUser.save();

    // Crear Equipamientos
    const tank1 = await Equipment.create({
      name: "Tanque Principal",
      type: "Tanque de leche",
      farm: farm1._id,
      devices: [],
    });

    const washingStation1 = await Equipment.create({
      name: "Estación de Lavado A",
      type: "Estación de lavado",
      farm: farm1._id,
      associatedTanks: [tank1._id],
    });

    farm1.equipments.push(tank1._id, washingStation1._id);
    await farm1.save();

    // Crear Dispositivos
    const device1 = await Device.create({
      boardId: "board001",
      type: "Monitor de leche",
      farm: farm1._id,
      equipment: tank1._id,
      description: "Sensor de nivel de leche",
      sensors: [
        {
          sensorId: "sensor001",
          name: "Nivel",
          description: "Sensor de nivel de leche en el tanque",
        },
        {
          sensorId: "sensor002",
          name: "Temperatura",
          description: "Sensor de temperatura de leche",
        },
      ],
    });

    tank1.devices.push(device1._id);
    await tank1.save();

    // Crear Recogidas
    const collection1 = await Collection.create({
      collectionDate: new Date(),
      cisternLicensePlate: "ABC-123",
      collectionCompany: "LecheCo",
      driver: "Carlos López",
      tankId: "T01",
      sampleLabel: "SAMPLE123",
      milkTemperature: 4.5,
      inhibitorSampleTaken: true,
      litersPerTank: [
        {
          tankId: tank1._id,
          liters: 5000,
          compartment: "Comp1",
        },
      ],
      sample: null, // Puede referenciar una colección de muestras (no implementada aquí)
    });

    console.log("Datos de ejemplo insertados correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("Error al insertar datos de ejemplo:", error);
    process.exit(1);
  }
};

// Ejecutar funciones
const main = async () => {
  await connectDB();
  await seedDatabase();
};

main();
