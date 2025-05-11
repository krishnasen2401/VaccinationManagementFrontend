import React from "react";

// Mock data for vaccination drives
const drives = [
  { id: 1, date: "2025-05-10", location: "Auditorium", studentsTargeted: 120 },
  { id: 2, date: "2025-05-25", location: "Health Center", studentsTargeted: 95 },
  { id: 3, date: "2025-06-10", location: "School", studentsTargeted: 10 },
];

export default function VaccinationDrives() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Vaccination Drives</h2>

      <div style={styles.card}>
        {drives.length === 0 ? (
          <p style={styles.emptyState}>🚫 No vaccination drives are scheduled at the moment.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Students Targeted</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive.id} style={styles.tr}>
                  <td style={styles.td}>{drive.id}</td>
                  <td style={styles.td}>{drive.date}</td>
                  <td style={styles.td}>{drive.location}</td>
                  <td style={styles.td}>{drive.studentsTargeted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f4f7f9",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    color: "#2c3e50",
    marginBottom: "1.5rem",
    borderBottom: "3px solid #4CAF50",
    paddingBottom: "0.5rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
  },
  emptyState: {
    color: "#777",
    fontStyle: "italic",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    backgroundColor: "#f0f0f0",
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
    fontWeight: "600",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  tr: {
    transition: "background-color 0.2s ease",
  },
};
