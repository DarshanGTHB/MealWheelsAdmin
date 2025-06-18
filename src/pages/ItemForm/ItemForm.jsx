import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ItemForm.css';
import FirebaseContext from '../../context/Firebase/FirebaseContext';
import LoginWarn from "../LoginWarn/LoginWarn";
import { toast } from 'react-toastify';
const ItemForm = () => {
  const {user, userToken} = useContext(FirebaseContext);
  // console.log(user, userToken);

  if(!user) return <LoginWarn/>;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Predefined categories
  const categories = [
    'Salad',
    'Rolls',
    'Deserts',
    'Sandwich',
    'Cake',
    'Pure Veg',
    'Pasta',
    'Noodles',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!formData.image) {
      newErrors.image = 'Please select an image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('image', formData.image);
      
      const response = await fetch('http://localhost:5000/api/items/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        toast.error('Only admin can upload item.');
        
        throw new Error('Only admin can upload item.');
      }
      
      // Success - redirect back to products
      toast.success('item added.')
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({ submit: 'Failed to create product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="item-form-container">
      <div className="item-form-wrapper">
        <div className="form-header">
          <h2 className="form-title">Add New Product</h2>
          <p className="form-subtitle">Fill in the details below to add a new product to your catalog</p>
        </div>

        <form onSubmit={handleSubmit} className="item-form">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter product name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Enter product description"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Category and Price Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Product Image <span className="required">*</span>
            </label>
            <div className="image-upload-container">
              <div className="image-upload-area">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="image-input"
                />
                <label htmlFor="image" className="image-upload-label">
                  <div className="upload-icon">📸</div>
                  <span>Click to upload image</span>
                  <small>PNG, JPG, GIF up to 5MB</small>
                </label>
              </div>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" className="preview-img" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                'Upload Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;