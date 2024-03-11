import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import UserInfoBox from "./UserInfo";
import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode"; 
import { jwtDecode } from "jwt-decode";

const StoryPage = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [editedParagraph, setEditedParagraph] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchData();
    getUsernameFromCookie(); // Fetch username from cookie on initial load
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/story")
      .then((response) => {
        setStories(response.data);
        // Extract unique usernames from stories and set them to the state
        const uniqueUsers = [
          ...new Set(response.data.map((story) => story.paragraphs[0].author)),
        ];
        setUsers(uniqueUsers);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const getUsernameFromCookie = () => {
    // Get token from cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1");
    // Decode token to get username
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
    setEmail(decodedToken.email)
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setEditedParagraph(story.paragraphs[0].content);
  };

  const handleCloseModal = () => {
    setEditingStory(null);
    setEditedParagraph("");
  };
  const handleLogout = () => {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  const handleSave = () => {
    // Check if editedParagraph is empty
    if (!editedParagraph.trim()) {
      // Display a window alert notifying the user
      window.alert("Paragraph cannot be empty.");
      return;
    }

    axios
      .put(
        `http://localhost:3000/story/${editingStory._id}`,
        {
          content: editedParagraph,
        }
      )
      .then((response) => {
        const updatedStories = stories.map((story) => {
          if (story._id === editingStory._id) {
            return {
              ...story,
              paragraphs: [
                { content: editedParagraph },
                ...story.paragraphs.slice(1),
              ],
            };
          }
          return story;
        });
        setStories(updatedStories);
        handleCloseModal();
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating paragraph:", error);
      });
  };

  const handlePost = () => {
    axios
      .post("http://localhost:3000/story", {
        title: newTitle,
        paragraphs: [{ content: newContent }],
        token: document.cookie.replace("username=", ""),
      })
      .then((response) => {
        setStories((prevStories) => [...prevStories, response.data]);
        setNewTitle("");
        setNewContent("");
        const author = response.data.paragraphs[0].author;
        setUsername(author);
        const email = response.data.email;
        
        fetchData();
      })
      .catch((error) => {
        console.error("Error posting story:", error);
      });
      // fetchData();
  };

  const handleDelete = (storyId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this story?"
    );
    if (isConfirmed) {
      axios
        .delete(`http://localhost:3000/story/${storyId}`)
        .then((response) => {
          console.log("Story deleted successfully:", response.data);
          const updatedStories = stories.filter(
            (story) => story._id !== storyId
          );
          setStories(updatedStories);
        })
        .catch((error) => {
          console.error("Error deleting story:", error);
        });
    }
  };

  return (
    <div className="relative bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900 via-gray-900 to-indigo-800 min-h-screen flex flex-col justify-center items-center text-white">
      <UserInfoBox username={username} email={email} onLogout={handleLogout} />
      <h1 className="text-4xl font-bold mb-8 text-center">Stories</h1>

      {/* Dropdown to select user */}
      <div className="mb-8">
        <select
          value={selectedUser}
          onChange={(e) => handleUserSelect(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4 bg-white text-black"
        >
          <option value="">All</option>
          {users.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {/* Create Post Section */}
      <div className="text-black mb-8">
        <h2 className="text-xl font-bold text-white">Create Post</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full h-40 border border-gray-300 rounded p-2 mb-4"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          required
        ></textarea>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handlePost}
        >
          Post
        </button>
      </div>

      {stories ? (
        <div>
          {/* Display title, the first paragraph of each story, and like/edit buttons */}
          {stories
            .filter(
              (story) =>
                !selectedUser || story.paragraphs[0].author === selectedUser
            )
            .map((story, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold">{story.title}</h2>
                <p className="mt-2">{story.paragraphs[0].content}</p>
                <div className="flex items-center mt-4">
                  <button
                    className="flex items-center text-green-500 mr-4"
                    onClick={() => handleEdit(story)}
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center text-red-500"
                    onClick={() => handleDelete(story._id)}
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                  <span className="ml-2 text-white bg-black inline-block shadow-md p-1.5 rounded-sm">
                    Posted by: {story.paragraphs[0].author}
                  </span>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Modal for editing paragraph */}
      {editingStory && (
        <div className="text-black fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-10 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Paragraph</h2>
            <p className="text-gray-600 mb-4">
              Remove the old content to continue the story
            </p>
            <textarea
              className="w-96 h-96 border border-gray-300 rounded p-4 mb-4"
              value={editedParagraph}
              onChange={(e) => setEditedParagraph(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button className="text-blue-500 mr-4" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="text-green-500" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryPage;
