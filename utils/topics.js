const farmId = 'synthetic-farm-1';

const brokerTopics = [
    `${farmId}/6_dof_imu`,
    `${farmId}/tank_temperature_probes`,
    `${farmId}/tank_distance`,
    `${farmId}/air_quality`,
    `${farmId}/weight`,
    `${farmId}/magnetic_switch`,
    `${farmId}/encoder`,
    `${farmId}/board_temperature`,
    `${farmId}/board_status`,
]    

module.exports = brokerTopics;