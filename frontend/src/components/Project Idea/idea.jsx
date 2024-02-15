import React from "react";
import { motion } from "framer-motion";

function Idea() {
  return (
    <main>
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 bg-gray-100"
      >
        <h1 className="text-3xl font-bold mb-8">
          Community Input Based Storytelling
        </h1>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="text-gray-800 leading-relaxed">
            Welcome to the Community Input Based Storytelling platform! This
            full-stack project allows users to engage in collaborative
            storytelling by writing and extending paragraphs. Whether you want
            to start a new story, continue an existing one, or generate a random
            line, this platform provides a creative space for community-driven
            narratives.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="grid gap-6">
            <li>
              <details className="text-gray-800">
                <summary className="text-xl font-semibold mb-2 cursor-pointer">
                  User Authentication
                </summary>
                <p className="text-gray-800 leading-relaxed mt-2">
                  Users can sign up or log in using their Google accounts,
                  ensuring a secure and convenient authentication process.
                </p>
              </details>
            </li>
            <li>
              <details className="text-gray-800">
                <summary className="text-xl font-semibold mb-2 cursor-pointer">
                  Anonymous User Handles
                </summary>
                <p className="text-gray-800 leading-relaxed mt-2">
                  For those who prefer privacy, the platform supports anonymous
                  user handles, allowing individuals to contribute to stories
                  without revealing their identity.
                </p>
              </details>
            </li>
            <li>
              <details className="text-gray-800">
                <summary className="text-xl font-semibold mb-2 cursor-pointer">
                  Create and Extend Stories
                </summary>
                <p className="text-gray-800 leading-relaxed mt-2">
                  Users can start a new story by writing the first paragraph or
                  continue existing ones written by others. The collaborative
                  nature allows stories to grow indefinitely.
                </p>
              </details>
            </li>
            <li>
              <details className="text-gray-800">
                <summary className="text-xl font-semibold mb-2 cursor-pointer">
                  Random Line Generator
                </summary>
                <p className="text-gray-800 leading-relaxed mt-2">
                  Need inspiration? Utilize the random line generator to inject
                  unexpected twists into your story or jumpstart a new
                  narrative.
                </p>
              </details>
            </li>
          </ul>
        </section>
      </motion.section>
    </main>
  );
}

export default Idea;
