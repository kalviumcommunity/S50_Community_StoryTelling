import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";



const StoryPage = () => {
  const [stories, setStories] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [editedParagraph, setEditedParagraph] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/story")
      .then((response) => {
        console.log(response.data);
        setStories(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleLike = (storyId) => {
    console.log(`Liked story with ID ${storyId}`);
    console.log("WIP");
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setEditedParagraph(story.paragraphs[0].content);
  };

  const handleCloseModal = () => {
    setEditingStory(null);
    setEditedParagraph("");
  };

  const handleSave = () => {
    // Check if editedParagraph is empty
    if (!editedParagraph.trim()) {
      // Display a window alert notifying the user
      window.alert("Paragraph cannot be empty.");
      return;
    }
  
    axios
      .put(`http://localhost:3000/story/${editingStory._id}`, {
        content: editedParagraph,
      })
      .then((response) => {
        console.log("Paragraph updated successfully:", response.data);
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
    console.log("Posting story:", newTitle, newContent); // Check if the function is being called with correct data
    axios
      .post("http://localhost:3000/story", {
        title: newTitle,
        paragraphs: [{ content: newContent }],
      })
      .then((response) => {
        console.log("Post successful:", response.data);
        // Append the new story to the existing stories
        setStories((prevStories) => [...prevStories, response.data]);
        // Clear input fields
        setNewTitle("");
        setNewContent("");
      })
      .catch((error) => {
        console.error("Error posting story:", error);
      });
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
    <div className="bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900 min-h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Stories</h1>

      {/* Create Post Section */}
      <div className=" text-black mb-8">
        <h2 className="text-xl font-bold">Create Post</h2>
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
          {stories.map((story, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-bold">{story.title}</h2>
              <p className="mt-2">{story.paragraphs[0].content}</p>
              <div className="flex items-center mt-4">
                <button
                  className="flex items-center text-blue-500 mr-4"
                  onClick={() => handleLike(story._id)}
                >
                  <FaThumbsUp className="mr-2" />
                  Like
                </button>
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
