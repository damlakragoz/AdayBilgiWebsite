import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "./UserTables.css";

const CounselorList = () => {
  const [counselors, setCounselors] = useState([]);
  const [error, setError] = useState(null);
  // Function to fetch counselors
  const fetchCounselors = async () => {
    try {
        const token = localStorage.getItem("userToken"); // Retrieve the auth token (adjust as needed)
        if (!token) {
          alert("Authorization token missing. Please log in.");
          // Redirect to login page, e.g., window.location.href = '/login';
          return;
        }
        console.log("Retrieved Token:", token);

        const response = await axios.get(
        "http://localhost:8081/api/counselors/getAll",
        {
            headers: {
                          Authorization: `Bearer ${token}`, // Add the authorization header
                        },
            withCredentials: true, // Include credentials like cookies
        }
      );
      console.log(response.data);
      setCounselors(response.data);
      setError(null); // Clear errors if successful
    } catch (err) {
      setError(err.response ? err.response.data : "Error fetching data");
      setCounselors([]); // Clear data on error
    }
  };

  // Fetch counselors on component load
  useEffect(() => {
    fetchCounselors();
  }, []);


  // Remove a specific row with confirmation
  const removeRow = async (email) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove counselor with email: ${email}?`
    );
    if (confirmRemoval) {
        try {
            const token = localStorage.getItem("userToken"); // Retrieve the auth token (adjust as needed)
            if (!token) {
              alert("Authorization token missing. Please log in.");
              // Redirect to login page, e.g., window.location.href = '/login';
              return;
            }
            console.log("Retrieved Token:", token);

            const response = await axios.delete(
              "http://localhost:8081/api/counselor/delete",
              {
                params: { username: email },
                headers: {
                  Authorization: `Bearer ${token}`, // Add the authorization header
                },
                withCredentials: true,
              }
            );

            if (response.status === 204 || response.status === 200) {
                // Remove the deleted counselor from the list
                setCounselors(counselors.filter(counselor => counselor.email !== email));
                alert("Counselor successfully deleted!");
            }
        } catch (error) {
          if (error.response) {
            alert(`Error: ${error.response.data}`);
          } else {
            alert('An unexpected error occurred.');
          }
        }
      }
  };

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Telefon Numarası</th>
              <th>Lise Adı</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {counselors.map((counselor, index) => (
              <tr key={index}>
                <td>{counselor.firstName+" "+counselor.lastName}</td>
                <td>{counselor.phoneNumber}</td>
                <td>{counselor.schoolName}</td>
                <td>{counselor.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CounselorList;