import React from "react";

interface ProjectBoxProps {
  title: string;
  description: string;
  link: string;
}

const ProjectBox: React.FC<ProjectBoxProps> = ({
  title,
  description,
  link,
}) => {
  return (
    <div
      style={{
        border: "2px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px",
        textAlign: "center",
        backgroundColor: "white",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onClick={() => (window.location.href = link)}
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        target.style.transform = "scale(1.05)";
        target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.transform = "scale(1)";
        target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      }}
    >
      <h3 style={{ fontSize: "1.5rem", margin: "10px 0", color: "#333" }}>
        {title}
      </h3>
      <p style={{ fontSize: "1rem", color: "#666" }}>{description}</p>
    </div>
  );
};

export default ProjectBox;
