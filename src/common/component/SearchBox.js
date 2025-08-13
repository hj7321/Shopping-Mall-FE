import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox = ({ query, navigate, placeholder, field }) => {
  const [keyword, setKeyword] = useState(query.get(field) || "");

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      const newQuery = new URLSearchParams(query);
      newQuery.set(field, event.target.value);
      newQuery.set("page", 1);
      navigate(`?${newQuery.toString()}`);
    }
  };

  useEffect(() => {
    setKeyword(query.get(field) || "");
  }, [query, field]);

  return (
    <div className="search-box">
      <FontAwesomeIcon icon={faSearch} />
      <input
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
        onChange={(event) => setKeyword(event.target.value)}
        value={keyword}
      />
    </div>
  );
};

export default SearchBox;
