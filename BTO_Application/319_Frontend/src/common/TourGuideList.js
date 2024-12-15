import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./UserTables.css";

const TourGuideList = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);

  const fetchTourGuides = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Authorization token missing. Please log in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:8081/api/tourguide/getAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setTourGuides(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : "Error fetching data");
      setTourGuides([]);
    }
  };

  useEffect(() => {
    fetchTourGuides();
  }, []);

  const removeRow = async (email) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove Tour Guide with email: ${email}?`
    );
    if (confirmRemoval) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          alert("Authorization token missing. Please log in.");
          return;
        }

        const response = await axios.delete(
          "http://localhost:8081/api/tourguide/delete",
          {
            params: { username: email },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 204 || response.status === 200) {
          setTourGuides(tourGuides.filter((tg) => tg.email !== email));
          alert("Tour Guide successfully deleted!");
        }
      } catch (error) {
        if (error.response) {
          alert(`Error: ${error.response.data}`);
        } else {
          alert("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Bölümü</th>
            <th>Puantaj</th>
            <th>Çalışma Saatleri</th>
            <th>Sınıf</th>
            <th>IBAN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tourGuides.map((tourGuide, index) => (
            <tr key={index}>
              <td>{tourGuide.email}</td>
              <td>{tourGuide.department}</td>
              <td>{tourGuide.puantage}</td>
              <td>{tourGuide.workHours}</td>
              <td>{tourGuide.grade}</td>
              <td>{tourGuide.iban}</td>
              <td>
                <button
                  onClick={() => removeRow(tourGuide.email)}
                  title="Delete Tour Guide"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Centered Button Below the Table */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/add-tourguide">
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: '#002855',
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Yeni Tur Rehberi Kaydet
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TourGuideList;
