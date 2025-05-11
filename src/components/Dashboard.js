import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchSummary = async () => {
      try {
        const response = await fetch("http://192.168.29.7:3000/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch dashboard summary");

        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Summary fetch error:", error);
      }
    };

    const fetchDrives = async () => {
      try {
        const response = await fetch("http://192.168.29.7:3000/drives", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch drives");

        const data = await response.json();
        const today = new Date();

        const filtered = data.filter((drive) => {
          const start = new Date(drive.startDate);
          const diffDays = (start - today) / (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 30;
        });

        setUpcomingDrives(filtered);
      } catch (error) {
        console.error("Drive fetch error:", error);
      }
    };

    fetchSummary();
    fetchDrives();
  }, []);

  if (!summary) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>School Coordinator Dashboard</h1>

      {/* Metrics from summary API */}
      <div style={styles.metrics}>
        <div style={styles.card}>
          <h3>Total Students</h3>
          <p>{summary.totalStudents}</p>
        </div>
        <div style={styles.card}>
          <h3>Vaccinated Students</h3>
          <p>{summary.vaccinatedStudents} ({summary.percentVaccinated}%)</p>
        </div>
        <div style={styles.card}>
          <h3>Upcoming Drives</h3>
          <p>{summary.upcomingDrives}</p>
        </div>
      </div>

      {/* Detailed upcoming drives */}
      <div style={styles.section}>
        <h2>📅 Upcoming Vaccination Drives (Next 30 Days)</h2>
        {upcomingDrives.length === 0 ? (
          <p style={styles.emptyText}>🚫 No drives scheduled in the next 30 days.</p>
        ) : (
          upcomingDrives.map((drive) => (
            <div key={drive.driveId} style={styles.driveItem}>
              <h3>{drive.name}</h3>
              <p><strong>Location:</strong> {drive.location}</p>
              <p><strong>Dates:</strong> {drive.startDate} - {drive.endDate}</p>
              <p><strong>Status:</strong> {drive.status}</p>
              <p><strong>Target Classes:</strong> {drive.targetClasses.map(cls => `${cls.name}-${cls.section}`).join(", ")}</p>
              <p><strong>Registered Students:</strong> {drive.registeredStudents}</p>
              <p><strong>Vaccinated Students:</strong> {drive.vaccinatedStudents}</p>
              <p><strong>Percent Vaccinated:</strong> {drive.percentVaccinated}%</p>
              <h4>Vaccines:</h4>
              <ul>
                {drive.vaccines.map((vaccine, index) => (
                  <li key={index}>
                    <strong>{vaccine.vaccineName}</strong> ({vaccine.vaccineType}) - {vaccine.dosage}<br />
                    Manufacturer: {vaccine.manufacturer}<br />
                    Administer Before: {vaccine.administerBefore}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Navigation */}
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
  },
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
  driveItem: {
    backgroundColor: "#f1f8e9",
    padding: "10px",
    marginBottom: "1rem",
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
