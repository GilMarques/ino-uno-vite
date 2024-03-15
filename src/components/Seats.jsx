import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton } from "@mui/material";
import React from "react";
import { tabletexture } from "../assets";
const pentagonStyle = {
  width: "201px", // Adjust size as needed
  height: "201px", // Adjust size as needed
  position: "relative",
  transform: "scale(1) translate(-10px,-10px)",
};

const circleStyle = {
  position: "absolute",
  border: "2px solid black",
  top: "50%",
  left: "50%",
  width: "20px", // Adjust size of circles
  height: "20px", // Adjust size of circles
  // Adjust color as needed
  borderRadius: "50%",
};

const innerCircleStyle = {
  position: "absolute",
  width: "60px", // Adjust size of inner circle
  height: "60px", // Adjust size of inner circle
  backgroundImage: tabletexture, // Adjust color of inner circle
  borderRadius: "50%",
  border: "1px solid black",
  top: "calc(50% - 20px)", // Half the height of the inner circle
  left: "calc(50% - 20px)", // Half the width of the inner circle
  zIndex: 1, // Ensure the inner circle is above the smaller circles
  transform: `rotate(${Math.floor(Math.random() * 360)}deg)`,
};
const r = 300;
const Seats = ({ sides, takenSeats, spectators, takeSeat, handleLeave }) => {
  const angle = 360 / sides;
  const circles = [];

  for (let i = 0; i < sides; i++) {
    circles.push(
      <div
        key={i}
        style={{
          ...circleStyle,
          backgroundColor: takenSeats.includes(i) ? "#808080" : "#f0f0f0",
          cursor: takenSeats.includes(i) ? "no-drop" : "pointer",
          transform: `rotate(${angle * i}deg) translate(0%, -${r}%)`,
        }}
        onClick={() => {
          takeSeat(i);
        }}
      ></div>
    );
  }

  return (
    <div className="absolute left-3 top-2 opacity-90">
      <div className="h-[200px] w-[200px] rounded-3xl bg-[radial-gradient(ellipse_at_center,_#aaa_0%,#500_95%)]">
        <div
          style={{
            ...pentagonStyle,
          }}
        >
          {circles.map((c) => c)}
          <div style={{ ...innerCircleStyle }}></div>
        </div>
        <div className="absolute bottom-3 right-4 flex items-center justify-center gap-x-1 font-bold text-white">
          <PersonIcon />
          {`${takenSeats.length}/${sides}`}
        </div>

        <div className="absolute bottom-3 left-4 flex items-center justify-center gap-x-1 font-bold text-white">
          <VisibilityIcon /> {`${spectators}`}
        </div>
        <div className="absolute left-3 top-3">
          <IconButton onClick={handleLeave}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Seats;
