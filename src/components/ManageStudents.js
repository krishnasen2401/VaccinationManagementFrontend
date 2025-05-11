import React, { useEffect, useState } from "react";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [csvError, setCsvError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStudents = async () => {
      try {
        const response = await fetch("http://192.168.29.7:3000/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch students");

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Students fetch error:", error);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.class} ${student.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      const rows = content.split("\n").map((row) => row.trim());
      const parsed = [];

      for (let i = 1; i < rows.length; i++) {
        const [name, age, className, vaccinated] = rows[i].split(",");
        if (name && age && className) {
          parsed.push({
            id: students.length + parsed.length + 1,
            name: name.trim(),
            age: parseInt(age),
            class: className.trim(),
            // vaccinated: vaccinated?.toLowerCase().includes("yes"),
          });
        }
      }

      if (parsed.length) {
        setStudents([...students, ...parsed]);
        setCsvError("");
      } else {
        setCsvError("⚠️ No valid rows found in the CSV.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveStudent = (savedStudent) => {
    setStudents((prev) =>
      prev.some((s) => s._id === savedStudent._id || s.id === savedStudent.id)
        ? prev.map((s) =>
            s._id === savedStudent._id || s.id === savedStudent.id
              ? savedStudent
              : s
          )
        : [...prev, savedStudent]
    );
    setEditingStudent(null);
  };

  return (
    <div style={styles.container}>
      <h2>Manage Students</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
        {csvError && <p style={{ color: "red" }}>{csvError}</p>}
        <p style={{ fontSize: "12px", color: "#555" }}>
          Format: name,age,class
        </p>
      </div>

      <input
        id="search"
        type="text"
        placeholder="🔍 Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchBar}
      />

      <StudentForm
        student={editingStudent}
        onSave={handleSaveStudent}
        onCancel={() => setEditingStudent(null)}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Date of Birth</th>
            <th style={styles.th}>Class</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td>{s.StudentID || s.id}</td>
              <td>{s.name}</td>
              <td>
                {s.dateOfBirth
                  ? Math.floor(
                      (new Date() - new Date(s.dateOfBirth)) /
                        (1000 * 60 * 60 * 24 * 365.25)
                    )
                  : "N/A"}
              </td>
              <td>{s.dateOfBirth}</td>
              <td>
                {s.classId ? `${s.classId.name} - ${s.classId.section}` : "N/A"}
              </td>
              <td>
                <button
                  onClick={() => setEditingStudent(s)}
                  style={styles.editButton}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    dateOfBirth: "",
    classId: ""
  });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    setForm(
      student
        ? {
            studentId: student.StudentID || student.id || "",
            name: student.name || "",
            dateOfBirth: student.dateOfBirth || "",
            classId: student.classId?._id || "",
            // vaccinated: student.vaccinated || false,
          }
        : {
            studentId: "",
            name: "",
            dateOfBirth: "",
            classId: "",
            // vaccinated: false,
          }
    );
  }, [student]);

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://192.168.29.7:3000/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dateOfBirth || !form.classId) return;

    const token = localStorage.getItem("token");
    const method = student ? "PUT" : "POST";
    const url = student
      ? `http://192.168.29.7:3000/students/${student._id || student.id}`
      : "http://192.168.29.7:3000/students";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          StudentID: form.studentId,
          name: form.name,
          dateOfBirth: form.dateOfBirth,
          classId: form.classId,          // vaccinated: form.vaccinated,
        }),
      });

      if (!res.ok) throw new Error("Failed to save student");

      const savedStudent = await res.json();
      onSave(savedStudent);
    } catch (err) {
      console.error("Save student failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        id="studentId"
        name="studentId"
        placeholder="Student ID"
        value={form.studentId}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        id="name"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        id="dateOfBirth"
        type="date"
        name="dateOfBirth"
        value={form.dateOfBirth}
        onChange={handleChange}
        style={styles.input}
        required
      />
<select
  id="classId"
  name="classId"
  value={form.classId}
  onChange={handleChange}
  style={styles.input}
  required
>
  <option value="">-- Select Class --</option>
  {classes.map((cls) => (
    <option key={cls._id} value={cls._id}>  {/* Set value to cls._id */}
      {cls.name} - {cls.section}  {/* Display name and section */}
    </option>
  ))}
</select>

      {/* <label htmlFor="vaccinated" style={styles.label}>
        <input
          id="vaccinated"
          type="checkbox"
          name="vaccinated"
          checked={form.vaccinated}
          onChange={handleChange}
        /> Vaccinated
      </label> */}
      <div>
        <button type="submit" style={styles.saveButton}>
          ✅ {student ? "Update Student" : "Add Student"}
        </button>
        {student && (
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  searchBar: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.05)",
  },
  th: {
    backgroundColor: "#e9ecef",
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  editButton: {
    backgroundColor: "#ffc107",
    color: "#000",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
    marginBottom: "1.5rem",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    flex: "1 0 180px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    flex: "1 0 150px",
  },
  saveButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  csvInfo: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  csvError: {
    color: "red",
    marginTop: "6px",
  },
};
