const CameraControlButtons = ({ handleViewChange }) => {
  const buttonStyle = {
    margin: "5px",
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={{ position: "absolute", bottom: 10, right: 10, zIndex: 100 }}>
      <button onClick={() => handleViewChange("lateral")} style={buttonStyle}>
        Vista Lateral
      </button>
      <button onClick={() => handleViewChange("front")} style={buttonStyle}>
        Vista Frontal
      </button>
      <button onClick={() => handleViewChange("top")} style={buttonStyle}>
        Vista Zenital
      </button>
      <button style={buttonStyle}>
        Maximizar
      </button>
    </div>
  );
};

export default CameraControlButtons;
