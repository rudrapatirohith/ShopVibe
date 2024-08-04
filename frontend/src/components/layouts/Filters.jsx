import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams} from 'react-router-dom'
import { getPriceQueryParams } from '../../helpers/helpers'
import { PRODUCT_CATEGORIES } from '../../constants/constants'
import StarRatings from 'react-star-ratings'

const Filters = () => {

    const [min, setMin] = useState(0)
    const [max, setMAx] = useState(0)

    const navigate = useNavigate();
    let [searchParams] = useSearchParams()
    

    useEffect(()=>{
        searchParams.has("min") && setMin(searchParams.get("min"));
        searchParams.has("max") && setMAx(searchParams.get("max"));
    },[]);
    // Handle Price Filter
    const handleButtonClick = (e) =>{
        e.preventDefault()

        searchParams = getPriceQueryParams(searchParams, 'min', min);
        searchParams = getPriceQueryParams(searchParams,'max',max);

        const path = window.location.pathname+"?"+searchParams.toString();
        navigate(path);
    }

    // Handle Category & Ratings Filter
    const handleClick = (checkbox)=>{
        const checkboxes = document.getElementsByName(checkbox.name);

        checkboxes.forEach((item)=>{
            if(item!==checkbox) item.checked = false;
        });

        if(checkbox.checked === false){
            // Delete the filter from query
            if(searchParams.has(checkbox.name)){
                searchParams.delete(checkbox.name);
                const path = window.location.pathname+"?"+searchParams.toString();
                navigate(path);
            }
        }
        else{
            // set new filter value if already there
            if(searchParams.has(checkbox.name)){
                searchParams.set(checkbox.name,checkbox.value);
            }
            else{
                // Append new filter
                searchParams.append(checkbox.name,checkbox.value);
            }
            const path = window.location.pathname+"?"+searchParams.toString();
            navigate(path);
         }
    };

    const defaultCheckHandler = (checkboxType , checkboxValue)=>{
        const value = searchParams.get(checkboxType);
        if(checkboxValue === value) return true;
        return false;
    }
  return (
    <div>
    
      <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form
        id="filter_form"
        className="px-2"
        onSubmit={handleButtonClick}
      >
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min}
              onChange={(e)=>setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={(e)=>setMAx(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">GO</button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

      {PRODUCT_CATEGORIES?.map((category, index) => (
  <div className="form-check" key={index}>
    <input
      className="form-check-input"
      type="checkbox"
      name="category"
      id={`check-${index}`}
      value={category}
      onClick={(e) => handleClick(e.target)}
      defaultChecked={defaultCheckHandler("category", category)}
    />
    <label className="form-check-label" htmlFor={`check-${index}`}>
      {category}
    </label>
  </div>
))}
 

 

      <hr />
      <h5 className="mb-3">Ratings</h5>
    {[5, 4, 3, 2, 1].map((rating,val)=>(
        <div className="form-check" key={`rating-${val}`}>
          <input
            className="form-check-input"
            type="checkbox"
            name="ratings"
            id={`rating-check-${val}`}
            value={rating}
            onClick={(e)=>handleClick(e.target)}
          defaultChecked={defaultCheckHandler("ratings",rating.toString())}

          />
          <label className="form-check-label" htmlFor={`rating-check-${val}`}>
          <StarRatings
                        rating={rating}
                        starRatedColor="#ECB056"
                        numberOfStars={5}
                        name='rating'
                        starDimension='21px'
                        starSpacing='1px'
                      />          
            </label>
        </div>
        
    ))}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>
    </div>
  )
}

export default Filters
