import React from "react";
import { useNavigate } from "react-router-dom";
// import { FaUserGraduate, FaSyringe, FaCalendarAlt } from "react-icons/fa"; // Optional: Install react-icons

const students = [
  { id: 1, name: "Alice Johnson", age: 14, class: "8A", vaccinated: true },
  { id: 2, name: "Bob Smith", age: 15, class: "9B", vaccinated: false },
  { id: 3, name: "Charlie Lee", age: 13, class: "7C", vaccinated: true },
  { id: 4, name: "Diana Patel", age: 14, class: "8B", vaccinated: true },
];

const vaccinationDrives = [
  { id: 1, date: "2025-05-10", location: "Auditorium", studentsTargeted: 120 },
  { id: 2, date: "2025-05-25", location: "Health Center", studentsTargeted: 95 },
  { id: 3, date: "2025-06-10", location: "School", studentsTargeted: 10 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const totalStudents = students.length;
  const vaccinatedCount = students.filter((s) => s.vaccinated).length;
  const vaccinatedPercent = totalStudents > 0
    ? ((vaccinatedCount / totalStudents) * 100).toFixed(1)
    : "0.0";

  const today = new Date();
  const upcomingDrives = vaccinationDrives.filter((drive) => {
    const driveDate = new Date(drive.date);
    const diffDays = (driveDate - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>School Coordinator Dashboard</h1>

      {/* Metrics */}
      <div style={styles.metrics}>
        <div style={styles.card}>
          {/* <FaUserGraduate size={24} color="#4CAF50" /> */}
          <h3>Total Students</h3>
          <p>{totalStudents}</p>
        </div>
        <div style={styles.card}>
          {/* <FaSyringe size={24} color="#2196F3" /> */}
          <h3>Vaccinated Students</h3>
          <p>{vaccinatedCount} ({vaccinatedPercent}%)</p>
        </div>
      </div>

      {/* Upcoming Drives */}
      <div style={styles.section}>
        {/* <h2><FaCalendarAlt /> Upcoming Vaccination Drives</h2> */}
        {upcomingDrives.length === 0 ? (
          <p style={styles.emptyText}>🚫 No drives scheduled in the next 30 days.</p>
        ) : (
          <ul style={styles.driveList}>
            {upcomingDrives.map((drive) => (
              <li key={drive.id} style={styles.driveItem}>
                📅 <strong>{drive.date}</strong> at <em>{drive.location}</em> — {drive.studentsTargeted} students targeted
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Links */}
      <div style={styles.navLinks}>
        <button style={styles.link} onClick={() => navigate("/manage-students")}>Manage Students</button>
        <button style={styles.link} onClick={() => navigate("/vaccination-drives")}>Vaccination Drives</button>
        <button style={styles.link} onClick={() => navigate("/reports")}>Reports</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2.5rem",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "2rem",
    borderBottom: "3px solid #4CAF50",
    paddingBottom: "0.5rem",
    fontWeight: "600",
    letterSpacing: "1px",
  }
,  
  metrics: {
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  emptyText: {
    color: "#777",
    fontStyle: "italic",
    marginTop: "1rem",
  },
  driveList: {
    listStyleType: "none",
    paddingLeft: "0",
    marginTop: "1rem",
  },
  driveItem: {
    backgroundColor: "#f1f8e9",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "6px",
    border: "1px solid #dcedc8",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  link: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};
