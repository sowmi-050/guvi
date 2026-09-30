// import { useContext, createContext } from 'react';
// import './App.css';

// const StudentContext = createContext();

// function App(children) {
//   // let StudentName = "sowmiya";
//   // let RollNo = "24CS005";
//   // let Email = "sowmiya@gmail.com";
//   // let Gender = "Female";
//   const name = useContext(StudentContext);
//   const rollNo = useContext(StudentContext);
//   const email = useContext(StudentContext);
//   const gender = useContext(StudentContext);




// //   return (
// //     <StudentContext.Provider
// //       value={{ name, rollNo, email, gender
        
// //        }}
// //     >
// //       <Student />
// //     </StudentContext.Provider>
// //   );
// // }

// // function Student() {
// //   const student = useContext(StudentContext);

// //   return (
// //     <div>
// //       <h1>Student Details</h1>
// //       <p>Name: {student.StudentName}</p>
// //       <p>Roll No: {student.RollNo}</p>
// //       <p>Email: {student.Email}</p>
// //       <p>Email: {student.Gender}</p>
// //     </div>
// //   );
// // }

// // export default App;
// import { useContext, createContext, useState } from 'react';
// import './App.css';

// const ThemeContext = createContext();

// function App() {
//   const [theme, setTheme] = useState("light");

//   const darkTheme = () => {
//     setTheme("dark");
//     alert("Dark Theme Enabled");
//   };

//   const lightTheme = () => {
//     setTheme("light");
//     alert("Light Theme Enabled");
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, darkTheme, lightTheme }}>
//       <Theme />
//     </ThemeContext.Provider>
//   );
// }

// function Theme() {
//   const themeData = useContext(ThemeContext);

//   const pageStyle = {
//     backgroundColor: themeData.theme === "dark" ? "black" : "white",
//     color: themeData.theme === "dark" ? "white" : "black",
//     height: "100vh",
//     textAlign: "center",
//     paddingTop: "100px"
//   };

//   return (
//     <div style={pageStyle}>
//       <h1>Theme Changer</h1>

//       <p>Current Theme: {themeData.theme}</p>

//       <button onClick={themeData.darkTheme}>
//         Dark Theme
//       </button>

//       <button onClick={themeData.lightTheme}>
//         Light Theme
//       </button>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect, useRef, createContext, useContext } from "react";
import "./App.css";

const MovieContext = createContext();

function App() {

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchRef = useRef();

  const movieData = [
    {
      id: 1,
      title: "Avatar",
      year: "2009",
      category: "Action",
      rating: "8.0",
      image: "https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg"
    },
    {
      id: 2,
      title: "Inception",
      year: "2010",
      category: "Action",
      rating: "8.8",
      image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
    },
    {
      id: 3,
      title: "Interstellar",
      year: "2014",
      category: "Sci-Fi",
      rating: "8.7",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
      id: 4,
      title: "Joker",
      year: "2019",
      category: "Drama",
      rating: "8.4",
      image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
    }
  ];

  useEffect(() => {
    searchRef.current.focus();
    setMovies(movieData);
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {

    if (search.trim() === "") {
      setError("Fill the movie name!");
      searchRef.current.focus();
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {

      let result = movieData.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );

      if (result.length === 0) {
        setMovies([]);
        setError("Movie not found!");
      } else {
        setMovies(result);
      }

      setLoading(false);

    }, 500);
  };

  const handleCategory = (value) => {

    setCategory(value);

    if (value === "All") {
      setMovies(movieData);
    } else {

      let result = movieData.filter(
        (movie) => movie.category === value
      );

      setMovies(result);
    }
  };

  return (
    <MovieContext.Provider value={{ movies }}>

      <div className="container">

        <h1>Movie Explorer</h1>

        <div className="search-box">

          <input
            ref={searchRef}
            type="text"
            value={search}
            name="search"
            placeholder="Enter movie name"
            onChange={handleChange}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

        <div className="category">

          <button onClick={() => handleCategory("All")}>
            All
          </button>

          <button onClick={() => handleCategory("Action")}>
            Action
          </button>

          <button onClick={() => handleCategory("Sci-Fi")}>
            Sci-Fi
          </button>

          <button onClick={() => handleCategory("Drama")}>
            Drama
          </button>

        </div>

        {error && <p className="error">{error}</p>}

        {loading && <p>Loading...</p>}

        {!loading && <MovieList />}

      </div>

    </MovieContext.Provider>
  );
}

function MovieList() {

  const { movies } = useContext(MovieContext);

  return (

    <div className="movie-list">

      {movies.map((movie) => (

        <div className="movie-card" key={movie.id}>

          <img
            src={movie.image}
            alt={movie.title}
          />

          <h2>{movie.title}</h2>

          <p>Year: {movie.year}</p>

          <p>Category: {movie.category}</p>

          <p>⭐ Rating: {movie.rating}</p>

          <button
            onClick={() =>
              alert(
                "Movie: " + movie.title +
                "\nYear: " + movie.year +
                "\nCategory: " + movie.category +
                "\nRating: " + movie.rating
              )
            }
          >
            View Details
          </button>

        </div>

      ))}

    </div>
  );
}

export default App;

