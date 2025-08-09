// --- Imports from Appwrite SDK ---
// Client: The main class to connect to your Appwrite project.
// Databases: The class for interacting with the Appwrite Databases service.
// ID: A helper class to generate unique IDs for new documents.
// Query: A helper class to build database queries for filtering documents.
import { Client, Databases, ID, Query } from "appwrite";

// --- Configuration ---
// Securely load your project, database, and collection IDs from environment variables.
// This is a best practice to avoid hardcoding sensitive credentials in your source code.
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
// A constant for the base URL of TMDb movie posters for consistency.
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// --- Client & Database Initialization ---
// Create a new instance of the Appwrite Client.
const client = new Client()
  // Set the API endpoint to your Appwrite server (in this case, Appwrite Cloud).
  .setEndpoint("https://cloud.appwrite.io/v1")
  // Set the project ID to connect to your specific Appwrite project.
  .setProject(PROJECT_ID);

// Create an instance of the Databases service, passing in the configured client.
// The `database` object is now ready to make requests to your project's database.
const database = new Databases(client);

// --- Core Functionality ---
// This function is exported to be used elsewhere in the app (e.g., in App.jsx).
// It's an `async` function, allowing it to use `await` for handling asynchronous Appwrite operations.
// Its purpose is to track how many times a specific search term has been used.
export const updateSearchCount = async (searchTerm, movie) => {
  // A `try...catch` block is used to gracefully handle potential errors during the API call.
  try {
    // --- Step 1: Check if the search term already exists in the database. ---
    // `listDocuments` fetches documents from our specified collection.
    const result = await database.listDocuments(
      DATABASE_ID, // The ID of the database.
      COLLECTION_ID, // The ID of the collection within the database.
      [
        // An array of queries to filter the results.
        // Here, we only want documents where the 'searchTerm' attribute exactly matches the user's query.
        Query.equal("searchTerm", searchTerm),
      ],
    );

    // --- Step 2: Decide whether to update an existing document or create a new one. ---
    // If the `documents` array in the result has a length greater than 0, it means we found a match.
    if (result.documents.length > 0) {
      // --- Step 2a: Update the existing document. ---
      // Get the first matching document from the results.
      const doc = result.documents[0];
      // Call `updateDocument` to modify the existing entry.
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        doc.$id, // The unique ID of the document to update.
        {
          // The data to update. We increment the 'count' by 1.
          count: doc.count + 1,
        },
      );
    } else {
      // --- Step 2b: Create a new document. ---
      // If no matching document was found, we create a new one.
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        // The data for the new document.
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path
          ? `${TMDB_IMAGE_BASE_URL}/${movie.poster_path}`
          : null,
      });
    }
  } catch (error) {
    // If any part of the `try` block fails, the error is caught here.
    // We log the error to the console for debugging purposes.
    console.error("Appwrite Error:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents;
  } catch (error) {
    console.error("Appwrite Error:", error);
  }
};
