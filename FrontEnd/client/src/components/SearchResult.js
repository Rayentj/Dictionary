const SearchResult = ({ term, definition, wordtype, onSeeMore, onListen, index }) => {
    return (
      <div className="search-result">
        <h2>{term}</h2>
        <p><strong>Definition:</strong> {definition}</p>
        <p><strong>Type:</strong> {wordtype}</p>
        <div className="button-group">
          <button onClick={onSeeMore}>See More</button> {/* Trigger the modal */}
          <button onClick={() => onListen(term, index)}>Listen</button> {/* Trigger text-to-speech */}
        </div>
      </div>
    );
  };
  
  export default SearchResult;
  