import React from "react";
import ProjectBox from "./ProjectBox";

const Home: React.FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#333" }}>
        Welcome to Fine-Tuned Functions
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "40px", color: "#555" }}>
        Currently a project deployment site run by{" "}
        <a href={"https://github.com/jacobpaine"}> Jacob Paine</a>.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <ProjectBox
          title="The Violin Tuner"
          description="A handy front-end only tuner for violin. No malware, no ads."
          link="/tuner"
        />
        <ProjectBox
          title="Pomodoro Timer"
          description="Simple Pomodoro timers to help you focus."
          link="/timer"
        />
        <ProjectBox
          title="Future Project"
          description="Stay tuned for more exciting tools!"
          link="#"
        />
      </div>
    </div>
  );
};

export default Home;
