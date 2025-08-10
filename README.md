# React Basic Movie App

This is a basic movie search application built with React and Vite. It allows users to search for movies and view a list of popular or trending films. The app uses the TMDb (The Movie Database) API to fetch movie data and integrates with Appwrite for tracking popular search terms.

## Features

  * **Movie Search:** Search for movies using a debounced search input to reduce API calls.
  * **Trending Movies:** View a list of the top 5 trending movies based on search counts, fetched from an Appwrite database.
  * **Dynamic UI:** Displays a spinner while fetching data and shows an error message if the API call fails.
  * **Movie Cards:** Each movie is displayed in a card with its title, rating, original language, and release year.

## Technologies Used

  * **Framework:** React
  * **Build Tool:** Vite
  * **Styling:** TailwindCSS
  * **State Management:** React hooks (`useState`, `useEffect`)
  * **External Hooks:** `react-use` for the `useDebounce` hook
  * **Backend:** Appwrite SDK for database interactions
  * **API:** The Movie Database (TMDb) API for movie data

## Setup and Installation

To get the project running on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [your-repo-url]
    cd react-basic-movie-app/react-2hr-cc
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure environment variables:**

      * Create a `.env` file in the `react-2hr-cc` directory.
      * Add your TMDb API key and Appwrite credentials:
        ```env
        VITE_TMDB_API_KEY=your_tmdb_api_key
        VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
        VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
        VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
        ```
      * You can obtain a TMDb API key from their official website and Appwrite credentials from your Appwrite Cloud project.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The app will be available at the local URL provided in the terminal.

## Scripts

The following scripts are available in `package.json`:

  * `npm run dev`: Starts the development server.
  * `npm run build`: Builds the project for production.
  * `npm run lint`: Lints the project files.
  * `npm run preview`: Serves the production build locally.

-----

## Project Structure

```
react-basic-movie-app/
├── .idea/
├── react-2hr-cc/
│   ├── public/
│   │   ├── hero-bg.png
│   │   ├── hero.png
│   │   ├── logo.png
│   │   ├── no-movie.png
│   │   ├── search.svg
│   │   └── star.svg
│   ├── src/
│   │   ├── appwrite.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── MovieCard.jsx
│   │       ├── Search.jsx
│   │       └── Spinner.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
```
