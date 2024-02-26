import React from "react";

const UserInfoBox = ({ username, email, onLogout, onDeleteAccount }) => {
  return (
    <div className="absolute top-0 right-0 m-6 bg-white p-6 rounded-lg">
      <p className="text-gray-800 font-semibold">{username}</p>
      <p className="text-gray-600">{email}</p>
      <div className="mt-4">
        <button className="text-red-500 mr-2" onClick={onLogout}>
          Logout
        </button>
        <button className="text-red-800" onClick={onDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserInfoBox;
