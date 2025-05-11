import React, { useEffect, useState } from "react";

export default function VaccinationDrives() {
  const [drives, setDrives] = useState([]);
  const [vaccinesList, setVaccinesList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editDriveId, setEditDriveId] = useState(null);

  const initialForm = {
    name: "",
    createdBy: "38c7b116-e227-448e-ac40-6e4e80154fdb",
    startDate: "",
    endDate: "",
    location: "",
    targetClasses: [],
    notes: "",
    status: "upcoming",
    vaccines: [],
  };

  const [form, setForm] = useState(initialForm);
  const token = localStorage.getItem("token");

  const getFormattedDate = (daysToAdd = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    fetchDrives();
    fetchVaccines();
    fetchClasses();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await fetch("http://192.168.29.7:3000/drives", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrives(data);
    } catch (err) {
      console.error("Failed to fetch drives:", err);
    }
  };

  const fetchVaccines = async () => {
    try {
      const res = await fetch("http://192.168.29.7:3000/vaccines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVaccinesList(data);
    } catch (err) {
      console.error("Failed to fetch vaccines:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch("http://192.168.29.7:3000/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClassesList(data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://192.168.29.7:3000/drives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Drive creation failed");
      setForm(initialForm);
      fetchDrives();
    } catch (err) {
      console.error("Error creating drive:", err);
    }
  };

  const handleEdit = (drive) => {
    setEditMode(true);
    setEditDriveId(drive.driveId);
    setForm({
      name: drive.name,
      createdBy: drive.createdBy,
      startDate: drive.startDate.slice(0, 16),
      endDate: drive.endDate.slice(0, 16),
      location: drive.location,
      targetClasses: drive.targetClasses,
      notes: drive.notes,
      status: drive.status,
      vaccines: drive.vaccines.map(v => v.vaccineId),
    });
  };
  const handleDelete = (drive) => {
    console.log(drive)
    const res = fetch(`http://192.168.29.7:3000/drives/${drive.driveId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    fetchDrives();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://192.168.29.7:3000/drives/${editDriveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Drive update failed");
      setEditMode(false);
      setEditDriveId(null);
      setForm(initialForm);
      fetchDrives();
    } catch (err) {
      console.error("Error updating drive:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vaccination Drives</h1>

      <form onSubmit={editMode ? handleUpdate : handleCreate} style={styles.form}>
        <h2>{editMode ? "Update Drive" : "Create New Drive"}</h2>

        <div style={styles.inputGroup}>
          <label htmlFor="name">Drive Name:</label>
          <input name="name" id="name" value={form.name} onChange={handleChange} required />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="datetime-local"
            name="startDate"
            id="startDate"
            value={form.startDate}
            onChange={handleChange}
            min={getFormattedDate(15)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            value={form.endDate}
            onChange={handleChange}
            min={form.startDate}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="location">Location:</label>
          <input name="location" id="location" value={form.location} onChange={handleChange} required />
        </div>

        <div style={styles.inputGroup}>
          <label>Select Target Classes:</label>
          <div style={styles.selectBox}>
            {classesList.map((cls) => (
              <div key={cls.classId}>
                <label>
                  <input
                    type="checkbox"
                    value={cls.classId}
                    checked={form.targetClasses.includes(cls.classId)}
                    onChange={(e) => {
                      const selected = [...form.targetClasses];
                      if (e.target.checked) selected.push(e.target.value);
                      else selected.splice(selected.indexOf(e.target.value), 1);
                      setForm((prev) => ({ ...prev, targetClasses: selected }));
                    }}
                  />
                  {cls.name} - {cls.section}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label>Select Vaccines:</label>
          <div style={styles.selectBox}>
            {vaccinesList.map((vaccine) => (
              <div key={vaccine.vaccineId}>
                <label>
                  <input
                    type="checkbox"
                    value={vaccine.vaccineId}
                    checked={form.vaccines.includes(vaccine.vaccineId)}
                    onChange={(e) => {
                      const selected = [...form.vaccines];
                      if (e.target.checked) selected.push(e.target.value);
                      else selected.splice(selected.indexOf(e.target.value), 1);
                      setForm((prev) => ({ ...prev, vaccines: selected }));
                    }}
                  />
                  {vaccine.vaccineName}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label>Status:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Ongoing</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>
          {editMode ? "Update Drive" : "Create Drive"}
        </button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>All Drives</h2>
      {drives.map((drive) => (
        <div key={drive.driveId} style={styles.driveCard}>
          <h3>{drive.name}</h3>
          <p><strong>Location:</strong> {drive.location}</p>
          <p><strong>Date:</strong> {drive.startDate} - {drive.endDate}</p>
          <p><strong>Status:</strong> {drive.status}</p>
          <p><strong>Classes:</strong> {drive.targetClasses.map(v => `${v.name} - ${v.section}`).join(", ")}</p>

          <p><strong>Vaccines:</strong> {drive.vaccines.map(v => v.vaccineName).join(", ")}</p>
          <button onClick={() => handleEdit(drive)}>Update Drive</button>
          <button onClick={() => handleDelete(drive)} style={{ backgroundColor: "#e74c3c", color: "#fff" }}>
    Delete Drive
  </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
    textAlign: "center",
    width: "100%",
  },
  form: {
    display: "grid",
    gap: "1rem",
    maxWidth: "600px",
    marginBottom: "2rem",
    width: "100%",
    boxSizing: "border-box",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    width: "100%",
    maxWidth: "200px",
    margin: "auto",
  },
  driveCard: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    width: "100%",
    maxWidth: "600px",
  },
  selectBox: {
    border: "1px solid #ccc",
    padding: "5px",
    borderRadius: "4px",
    maxHeight: "150px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
};
