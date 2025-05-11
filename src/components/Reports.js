import React, { useEffect, useState, useRef } from "react";

const ReportsPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const printRef = useRef();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://192.168.29.7:3000/records", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setReportData(data);
        } else {
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Vaccination Reports</h2>
        <button onClick={handlePrint} style={styles.printButton}>
          🖨️ Print Report
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && reportData.length === 0 && <p>No reports found.</p>}

      <div style={styles.tableWrapper} ref={printRef}>
        {reportData.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Class</th>
                <th style={styles.th}>Section</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Vaccine</th>
                <th style={styles.th}>Batch ID</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((record) => (
                <tr key={record.recordId}>
                  <td style={styles.td}>{record.studentId.name}</td>
                  <td style={styles.td}>{record.studentId.classId.name}</td>
                  <td style={styles.td}>{record.studentId.classId.section}</td>
                  <td style={styles.td}>{new Date(record.date).toLocaleString()}</td>
                  <td style={styles.td}>{record.vaccine?.vaccineName || "N/A"}</td>
                  <td style={styles.td}>{record.batchId}</td>
                  <td style={styles.td}>{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  printButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    backgroundColor: "#fff",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.05)",
  },
  th: {
    backgroundColor: "#343a40",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    border: "1px solid #dee2e6",
  },
  td: {
    padding: "10px",
    border: "1px solid #dee2e6",
    textAlign: "left",
    backgroundColor: "#fff",
  },
};

export default ReportsPage;
