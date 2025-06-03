let lastMqttStatus = { status: "unknown" };

const getLastMqttStatus = () => lastMqttStatus;

const setLastMqttStatus = (status) => {
  lastMqttStatus = status;
};

module.exports = {
  getLastMqttStatus,
  setLastMqttStatus,
};
