 import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error(error));

    axios.get(`http://localhost:5000/api/reviews/product/${id}`)
      .then((response) => setReviews(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <strong>{review.userId.name}</strong>: {review.comment} (Rating: {review.rating})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDetails;