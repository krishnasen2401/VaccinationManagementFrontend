import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const VaccinationEntry = () => {
  const location = useLocation(); // Access the location object
  const { drive } = location.state || {}; // Destructure the drive from location state

  const [students, setStudents] = useState([]); // For student data
  const [classes, setClasses] = useState([]); // For class data
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState(""); // Track selected class
  const [vaccinationDate, setVaccinationDate] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
   const token = localStorage.getItem("token");


  // Fetch classes from the API
useEffect(() => {
  if (selectedClass) {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `http://192.168.29.7:3000/students?${selectedClass}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // <-- Replace with your actual token
            },
          }
        );
        const data = await response.json();
        console.log(data)
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("Expected an array, but received:", data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }
}, [selectedClass]);



// Trigger API call when class is selected

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle vaccination entry submission (send data to the backend)
//     console.log("Vaccination entry submitted:", {
//       drive,
//       selectedClass,
//       selectedStudent,
//       vaccinationDate,
//       status,
//     });

//     // You can implement the API call for submitting vaccination entry here
//     // For now, we'll log the data to the console

//     setStatus("Vaccination entry submitted successfully!");
//   };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    driveId: drive.driveId,
    classId: drive.targetClasses.classId,
    studentId: selectedStudent,
    vaccinationDate,
    batchId: 'batch001',
    notes,
  };

  try {
    const response = await fetch("http://192.168.29.7:3000/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Replace if token is stored elsewhere
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Vaccination entry submitted successfully!");
      // Optionally reset form
      setSelectedClass("");
      setSelectedStudent("");
      setVaccinationDate("");
      setNotes("");
    } else {
      const errorData = await response.json();
      setStatus(`Submission failed: ${errorData.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error submitting vaccination entry:", error);
    setStatus("An error occurred while submitting the entry.");
  }
};


  return (
    <div style={styles.container}>
      <h3>Add Vaccination Entry</h3>
      {/* Display drive data */}
      {drive ? (
        <div style={styles.driveInfo}>
          <p><strong>Drive Name:</strong> {drive.name}</p>
          <p><strong>Location:</strong> {drive.location}</p>
        </div>
      ) : (
        <p>No drive data available.</p>
      )}

      {/* Vaccination Entry Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Select Class Dropdown */}
        <div style={styles.inputGroup}>
          <label htmlFor="class">Select Class</label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">-- Select a class --</option>
            {drive && drive.targetClasses.length > 0 ? (
              drive.targetClasses.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {`${cls.name} - ${cls.section}`} {/* Show name and section */}
                </option>
              ))
            ) : (
              <option value="">Loading classes...</option>
            )}
          </select>
        </div>

        {/* Select Student Dropdown */}
        <div style={styles.inputGroup}>
          <label htmlFor="student">Select Student</label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            style={styles.input}
            disabled={!selectedClass} // Disable student dropdown until a class is selected
          >
            <option value="">-- Select a student --</option>
            {students.length > 0 ? (
              students.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.name}
                </option>
              ))
            ) : (
              <option value="">Loading students...</option>
            )}
          </select>
        </div>

        {/* Vaccination Date */}
        <div style={styles.inputGroup}>
          <label htmlFor="vaccinationDate">Vaccination Date</label>
          <input
            type="datetime-local"
            id="vaccinationDate"
            value={vaccinationDate}
            onChange={(e) => setVaccinationDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
  <label htmlFor="notes">Notes</label>
  <textarea
    id="notes"
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    style={styles.textarea}
    placeholder="Add any additional notes (optional)..."
  />
</div>


        <div style={styles.inputGroup}>
          <button type="submit" style={styles.submitButton}>
            Submit Vaccination Entry
          </button>
        </div>
      </form>

      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  driveInfo: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#e9ecef",
    borderRadius: "8px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginTop: "1rem",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  status: {
    marginTop: "1rem",
    fontWeight: "bold",
    color: "#28a745",
  },
  textarea: {
  width: "100%",
  padding: "10px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  minHeight: "80px",
  resize: "vertical",
},

};

export default VaccinationEntry;
