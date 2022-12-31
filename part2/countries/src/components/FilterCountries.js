const FilterCountries = ({ searchInput, handlesearchInput }) => {
    return (
      <div>
        find countries
        <input value={searchInput} onChange={handlesearchInput} />
      </div>
    );
  };
  
  export default FilterCountries;
  