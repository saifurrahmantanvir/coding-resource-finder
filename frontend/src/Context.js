import { createContext, useEffect, useState } from "react";

const Context = createContext();

function ContextProvider({ children }) {
  const [resources, setResources] = useState([]);
  const [renderedResources, setRenderedResources] = useState([]);
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pageTitle, setPageTitle] = useState("Coding Resource Finder");
  // const[currentResources,setCurrentResources]=useState([])

  // this is to determine which state of resources to use
  const resourceGroup = searchTerm.trim().length
    ? renderedResources
    : resources;

  useEffect(() => {
    getResources();
    setRenderedResources(resources);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  async function getResources() {
    try {
      await fetch("https://coding-resource-finder-api.herokuapp.com/all")
        .then((response) => response.json())
        .then((data) => {
          const sortedData = data.data.sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });
          setResources(sortedData);
        });
    } catch (error) {
      console.log(error);
    }
  }

  function addBookmark(resourceURL) {
    const newBookmark = resourceGroup.find(
      (resource) => resource.url === resourceURL
    );
    setBookmarks((prevBookmarks) => [...prevBookmarks, newBookmark]);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  function removeBookmark(bookmarkURL) {
    const newBookmarks = bookmarks.filter(
      (bookmark) => bookmark.url !== bookmarkURL
    );
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  return (
    <Context.Provider
      value={{
        resources,
        setResources,
        renderedResources,
        resourceGroup,
        setRenderedResources,
        bookmarks,
        addBookmark,
        setBookmarks,
        removeBookmark,
        searchTerm,
        setSearchTerm,
        setPageTitle,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, ContextProvider };
