import React, { useState, useEffect } from "react";

// Initial mock data
const initialStudents = [
  { id: 1, name: "Alice Johnson", age: 14, class: "8A", vaccinated: true },
  { id: 2, name: "Bob Smith", age: 15, class: "9B", vaccinated: false },
  { id: 3, name: "Charlie Lee", age: 13, class: "7C", vaccinated: true },
  { id: 4, name: "Diana Patel", age: 14, class: "8B", vaccinated: true },
];

export default function ManageStudents() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [csvError, setCsvError] = useState("");

  // Search filtering
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.class} ${student.id} ${student.vaccinated ? "yes" : "no"}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // CSV Upload Handler
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
            vaccinated: vaccinated?.toLowerCase().includes("yes"),
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

  // Add or Edit student
  const handleSaveStudent = (student) => {
    if (student.id) {
      // Edit existing
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? student : s))
      );
    } else {
      // Add new
      setStudents([
        ...students,
        { ...student, id: students.length + 1 }
      ]);
    }
    setEditingStudent(null);
  };

  return (
    <div style={styles.container}>
      <h2>Manage Students</h2>

      {/* Upload CSV */}
      <div style={{ marginBottom: "1rem" }}>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
        {csvError && <p style={{ color: "red" }}>{csvError}</p>}
        <p style={{ fontSize: "12px", color: "#555" }}>
          Format: name,age,class,vaccinated (yes/no)
        </p>
      </div>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="🔍 Search by name, class, ID, vaccinated..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchBar}
      />

      {/* Add / Edit Form */}
      <StudentForm
        student={editingStudent}
        onSave={handleSaveStudent}
        onCancel={() => setEditingStudent(null)}
      />
      {/* Student List */}
      <table style={styles.table}>
      <thead>
  <tr>
    <th style={styles.th}>ID</th>
    <th style={styles.th}>Name</th>
    <th style={styles.th}>Age</th>
    <th style={styles.th}>Class</th>
    <th style={styles.th}>Vaccinated</th>
    <th style={styles.th}>Actions</th>
  </tr>
</thead>

        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.class}</td>
              <td>{s.vaccinated ? "✅" : "❌"}</td>
              <td>
                <button onClick={() => setEditingStudent(s)} style={styles.editButton}>
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

// 🧾 Reusable Student Form
function StudentForm({ student, onSave, onCancel }) {
    const [form, setForm] = useState({ name: "", age: "", class: "", vaccinated: false });

    useEffect(() => {
      setForm(student || { name: "", age: "", class: "", vaccinated: false });
    }, [student]);
    

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.class) return;
    onSave({ ...form, age: parseInt(form.age), id: form.id });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        name="age"
        type="number"
        placeholder="Age"
        value={form.age}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        name="class"
        placeholder="Class"
        value={form.class}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <label style={styles.label}>
        <input
          type="checkbox"
          name="vaccinated"
          checked={form.vaccinated}
          onChange={handleChange}
        />{" "}
        Vaccinated
      </label>
      <div>
        <button type="submit" style={styles.saveButton}>
          {form.id ? "💾 Save Changes" : "✅ Add Student"}
        </button>
        {form.id && (
          <button type="button" onClick={onCancel} style={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// 🎨 Styles
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

  