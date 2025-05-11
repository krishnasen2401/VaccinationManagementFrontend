import React from "react";

// Mock report data (replace with real data/API later)
const reports = [
  { id: 1, name: "Alice Johnson", class: "8A", vaccinated: true, date: "2025-04-10" },
  { id: 2, name: "Bob Smith", class: "9B", vaccinated: false, date: null },
  { id: 3, name: "Charlie Lee", class: "7C", vaccinated: true, date: "2025-03-25" },
  { id: 4, name: "Diana Patel", class: "8B", vaccinated: true, date: "2025-03-25" },
];

export default function Reports() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Student Vaccination Reports</h2>

      <div style={styles.card}>
        {reports.length === 0 ? (
          <p style={styles.emptyState}>📄 No student reports available.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Vaccinated</th>
                <th style={styles.th}>Vaccination Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td style={styles.td}>{report.id}</td>
                  <td style={styles.td}>{report.name}</td>
                  <td style={styles.td}>{report.class}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: report.vaccinated ? "#4CAF50" : "#f44336",
                      fontWeight: "500",
                    }}
                  >
                    {report.vaccinated ? "✅ Yes" : "❌ No"}
                  </td>
                  <td style={styles.td}>{report.date ? report.date : "N/A"}</td>
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
};
