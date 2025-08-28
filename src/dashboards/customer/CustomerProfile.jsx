import React, { useState } from "react";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+91 9876543210",
    dob: "1995-06-15",
    gender: "Male",
    address: "123, MG Road, Bengaluru",
    company: "AccuBillify Pvt Ltd",
    role: "Customer",
    country: "India",
    username: "johndoe123",
    billingAddress: "456, Residency Road, Bengaluru",
    subscription: "Pro",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    twoFactorAuth: false,
    password: "",
    confirmPassword: "",
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
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Profile Settings</h2>

        {/* Personal Information Section */}
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

          <label>Gender</label>
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label>Address</label>
          <textarea name="address" value={profile.address} onChange={handleChange} />
        </div>

        {/* Account Settings Section */}
        <h3 className="section-title">Account Settings</h3>
        <div className="profile-form">
          <label>Username</label>
          <input type="text" name="username" value={profile.username} onChange={handleChange} />

          <label>Company</label>
          <input type="text" name="company" value={profile.company} onChange={handleChange} />

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

          <label>Billing Address</label>
          <textarea name="billingAddress" value={profile.billingAddress} onChange={handleChange} />

          <label>Subscription Plan</label>
          <select name="subscription" value={profile.subscription} onChange={handleChange}>
            <option>Free</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>

          <label>Notification Preferences</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="notifications.email"
                checked={profile.notifications.email}
                onChange={handleChange}
              />
              Email
            </label>
            <label>
              <input
                type="checkbox"
                name="notifications.sms"
                checked={profile.notifications.sms}
                onChange={handleChange}
              />
              SMS
            </label>
            <label>
              <input
                type="checkbox"
                name="notifications.push"
                checked={profile.notifications.push}
                onChange={handleChange}
              />
              Push Notifications
            </label>
          </div>

          <label>
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={profile.twoFactorAuth}
              onChange={handleChange}
            />
            Enable Two-Factor Authentication (2FA)
          </label>

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
        .profile-container {
          width:93vw;
          display: flex;
          justify-content: center;
          padding: 40px;
          background: #f3f4f6;
          min-height: 100vh;
        }
        .profile-card {
          background: #fff;
          padding: 30px;
          border-radius: 12px;
          width: 500px;
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
          resize: none;
        }
        .checkbox-group {
          display: flex;
          gap: 15px;
          margin: 5px 0 10px;
        }
        .button-group {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .save-btn {
          background: linear-gradient(125deg, #e374f4, #aa1bed);
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        .cancel-btn {
          background: #ddd;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;