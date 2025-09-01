import React, { useState } from "react";
const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    company: "AccuBillify Pvt Ltd",
    role: "Customer",
    country: "",
    username: ""
  });
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.includes("notifications")) {
      const notifType = name.split(".")[1];
      setProfile({
        ...profile,
        notifications: { ...profile.notifications, [notifType]: checked },
      });
    } else if (name === "twoFactorAuth") {
      setProfile({ ...profile, twoFactorAuth: checked });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };
  const handleSave = () => {
    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Profile Updated Successfully!"); 
    console.log("Updated Profile:", profile);
  };

  const handleCancel = () => {
    
    window.location.reload();
  };

  return (
    <>
      <div className="profile-card">
        <h2 className="profile-title">Profile Settings</h2>
        <h3 className="section-title">Personal Information</h3>
        <div className="profile-form">
          <label>Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />

          <label>Phone</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleChange} />

          <label>Date of Birth</label>
          <input type="date" name="dob" value={profile.dob} onChange={handleChange} />
          <label>Address</label>
          <textarea name="address" value={profile.address} onChange={handleChange} />
        </div>
        <h3 className="section-title">Account Settings</h3>
        <div className="profile-form">
          <label>Username</label>
          <input type="text" name="username" value={profile.username} onChange={handleChange} />
          <label>Role</label>
          <input type="text" name="role" value={profile.role} onChange={handleChange} />

          <label>Country</label>
          <select name="country" value={profile.country} onChange={handleChange}>
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
            <option>Australia</option>
          </select>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={profile.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={profile.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        /* Removed .profile-container styling as it conflicts with dashboard layout */
        /* The .profile-card will now be centered and styled by the dashboard's .page-content */

        .profile-card {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          max-width: 600px; /* Constrain max-width of the card */
          margin: 0 auto; /* Center the card horizontally within its parent */
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        }
        .profile-title {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
          color: #222;
        }
        .section-title {
          margin: 20px 0 10px;
          font-size: 18px;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #eee;
          padding-bottom: 5px;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .profile-form label {
          font-weight: 600;
          margin-bottom: 3px;
          color: #444;
        }
        .profile-form input, 
        .profile-form textarea,
        .profile-form select {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        .profile-form textarea {
          resize: vertical; /* Allow vertical resizing only */
          min-height: 60px; /* Give it a reasonable minimum height */
        }
        .checkbox-group {
          display: flex;
          gap: 15px;
          margin: 5px 0 10px;
          flex-wrap: wrap; /* Allow checkboxes to wrap on smaller screens */
        }
        .button-group {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end; /* Align buttons to the right */
          gap: 15px; /* Space between buttons */
        }
        .save-btn, .cancel-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .save-btn {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          color: white;
        }
        .save-btn:hover {
          background: linear-gradient(125deg, #aa1bed, #e374f4);
          transform: translateY(-1px);
        }
        .cancel-btn {
          background: #ddd;
          color: #333;
        }
        .cancel-btn:hover {
          background: #ccc;
          transform: translateY(-1px);
        }

        /* Responsive adjustments for the form itself */
        @media (max-width: 600px) {
            .profile-card {
                padding: 20px;
                margin: 0 10px; /* Add some margin on very small screens */
                width: auto; /* Let it take available width */
            }
            .profile-title {
                font-size: 20px;
            }
            .section-title {
                font-size: 16px;
            }
            .profile-form input, 
            .profile-form textarea,
            .profile-form select {
                padding: 8px;
                font-size: 13px;
            }
            .button-group {
                flex-direction: column; /* Stack buttons vertically */
                gap: 10px;
            }
            .save-btn, .cancel-btn {
                width: 100%;
            }
        }
      `}</style>
    </>
  );
};

export default CustomerProfile;