const SearchResult = ({ term, definition, wordtype, onSeeMore, onListen, index }) => {
    return (
      <div className="search-result">
        <h2>{term}</h2>
        <p><strong>Definition:</strong> {definition}</p>
        <p><strong>Type:</strong> {wordtype}</p>
        <div className="button-group">
          <button className="see-more-button" onClick={onSeeMore}>See More</button>
          <button className="play-button" onClick={() => onListen(term, index)}>
            ▶ {/* Triangle for play button */}
          </button>
        </div>
      </div>
    );
  };
  
  export default SearchResult;
  