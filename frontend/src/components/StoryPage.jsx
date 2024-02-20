import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp, FaEdit } from "react-icons/fa";

const StoryPage = () => {
  const [stories, setStories] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [editedParagraph, setEditedParagraph] = useState("");

  useEffect(() => {
    // Fetch data from your backend endpoint
    axios.get("http://localhost:3000/story")
      .then((response) => {
        console.log(response.data);
        setStories(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleLike = (storyId) => {
    // Implement your like functionality here, update the backend
    console.log(`Liked story with ID ${storyId}`);
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
    // Send PUT request to update the paragraph in the database
    axios.put(`http://localhost:3000/story/${editingStory._id}`, {
      content: editedParagraph
    })
    .then(response => {
      console.log("Paragraph updated successfully:", response.data);
      // Update stories state with the updated data
      const updatedStories = stories.map(story => {
        if (story.id === editingStory.id) {
          return {
            ...story,
            paragraphs: [{ content: editedParagraph }, ...story.paragraphs.slice(1)]
          };
        }
        return story;
      });
      setStories(updatedStories);
      handleCloseModal();
    })
    .catch(error => {
      console.error("Error updating paragraph:", error);
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Stories</h1>
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
                  onClick={() => handleLike(story.id)}
                >
                  <FaThumbsUp className="mr-2" />
                  Like
                </button>
                <button
                  className="flex items-center text-green-500"
                  onClick={() => handleEdit(story)}
                >
                  <FaEdit className="mr-2" />
                  Edit
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Paragraph</h2>
            <textarea
              className="w-full h-40 border border-gray-300 rounded p-2 mb-4"
              value={editedParagraph}
              onChange={(e) => setEditedParagraph(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="text-blue-500 mr-4"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="text-green-500"
                onClick={handleSave}
              >
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
