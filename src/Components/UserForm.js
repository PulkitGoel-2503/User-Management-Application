import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // For error handling notifications
import 'react-toastify/dist/ReactToastify.css';

const UserForm = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: {
      street: '',
      city: ''
    },
    company: {
      name: ''
    },
    website: ''
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams(); // To check if we are updating the user
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => toast.error('Error fetching user details'));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'street' || name === 'city') {
      setUser((prevUser) => ({
        ...prevUser,
        address: { ...prevUser.address, [name]: value }
      }));
    } else if (name === 'companyName') {
      setUser((prevUser) => ({
        ...prevUser,
        company: { ...prevUser.company, name: value }
      }));
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!user.name || user.name.length < 3) formErrors.name = 'Name must be at least 3 characters';
    if (!user.address.street || !user.address.city) formErrors.address = 'Street and City are required';
    if (user.company.name && user.company.name.length < 3) formErrors.companyName = 'Company name must be at least 3 characters';
    if (user.website && !/^https?:\/\/[^\s]+$/.test(user.website)) formErrors.website = 'Invalid website URL';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!id) {
      user.username = `USER-${user.name}`;
    }

    const apiMethod = id ? 'put' : 'post';
    const apiUrl = id ? `https://jsonplaceholder.typicode.com/users/${id}` : 'https://jsonplaceholder.typicode.com/users';

    axios[apiMethod](apiUrl, user)
      .then(() => {
        toast.success(id ? 'User updated successfully' : 'User created successfully');
        navigate('/');
      })
      .catch(() => toast.error('Error submitting the user data'));
  };

  return (
    <div className="container mt-4 border p-4 rounded">
      <h2>{id ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Username (Auto-generated)</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={id ? user.username : `USER-${user.name}`}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            type="text"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            name="street"
            value={user.address.street}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            name="city"
            value={user.address.city}
            onChange={handleChange}
            required
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Company Name (Optional)</label>
          <input
            type="text"
            className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
            name="companyName"
            value={user.company.name}
            onChange={handleChange}
          />
          {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Website (Optional)</label>
          <input
            type="url"
            className={`form-control ${errors.website ? 'is-invalid' : ''}`}
            name="website"
            value={user.website}
            onChange={handleChange}
          />
          {errors.website && <div className="invalid-feedback">{errors.website}</div>}
        </div>

        <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default UserForm;