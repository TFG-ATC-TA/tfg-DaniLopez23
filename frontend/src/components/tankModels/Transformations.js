export const getRotationDuration = (encoderData) => {
    if (encoderData === null || encoderData <= 0) return 0;
    const minDuration = 1000;
    const maxDuration = 10000;
    const minRPM = 0;
    const maxRPM = 100;

    const rpm = Math.min(Math.max(encoderData, minRPM), maxRPM);
    const duration =
      maxDuration -
      ((rpm - minRPM) * (maxDuration - minDuration)) / (maxRPM - minRPM);

    return duration;
  };

  