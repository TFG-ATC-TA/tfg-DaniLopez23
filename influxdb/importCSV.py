import pandas as pd
from influxdb_client import InfluxDBClient, Point, WritePrecision

# Configurar conexión con InfluxDB
bucket = "my_farm"
org = "myorg"
token = "my-super-secret-token"
url = "http://localhost:8086"

client = InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api()

# Ruta del archivo CSV
csv_file = "accel.csv"

# Leer CSV omitiendo las 3 primeras líneas
df = pd.read_csv(csv_file, skiprows=3)

# Renombrar columnas para claridad
df = df.rename(columns={
    "_time": "timestamp",
    "_value": "value",
    "_field": "field",
    "_measurement": "measurement",
    "tags_accel_unit": "accel_unit",
    "tags_board_id": "board_id",
    "tags_gyro_unit": "gyro_unit",
    "tags_sensor_id": "sensor_id"
})

# Convertir timestamps a UNIX (nanosegundos) para InfluxDB
df["timestamp"] = pd.to_datetime(df["timestamp"]).astype(int) // 10**9

# Enviar datos en bloques de 100,000 filas
chunk_size = 100_000

for chunk in range(0, len(df), chunk_size):
    subset = df.iloc[chunk:chunk + chunk_size]
    points = []

    for _, row in subset.iterrows():
        point = (
            Point(row["measurement"])
            .time(row["timestamp"], WritePrecision.S)  # Precisión en segundos
            .field(row["field"], float(row["value"]))  # Insertar el valor numérico
            .tag("accel_unit", row["accel_unit"])
            .tag("board_id", row["board_id"])
            .tag("gyro_unit", row["gyro_unit"])
            .tag("sensor_id", row["sensor_id"])
        )
        points.append(point)

    # Escribir en InfluxDB
    write_api.write(bucket=bucket, org=org, record=points)

print("Carga completada 🚀")
