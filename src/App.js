import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUserPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { Modal, Button, Card } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    address: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/users');
      setUsers(result.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update user
        await axios.put(`http://localhost:3000/api/users/${editingUserId}`, formData);
        setIsEditing(false);
        setEditingUserId(null);
      } else {
        // Add new user
        await axios.post('http://localhost:3000/api/users', formData);
      }
      fetchUsers();
      setFormData({ first_name: '', last_name: '', phone_number: '', email: '', address: '' });
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingUserId(user[0]);
    setFormData({
      first_name: user[1],
      last_name: user[2],
      phone_number: user[3],
      email: user[4],
      address: user[5],
    });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${selectedUserId}`);
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleShowModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="app-container">
      <div className="top-section-wrapper">
        {/* Left Section - Welcome */}
        <div className="left-section">
          <h1>WELCOME BACK!</h1>
          <p>Manage your users effectively with this simple interface.</p>
        </div>

        {/* Right Section - Form */}
        <div className="right-section">
          <h2 className="form-title">{isEditing ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control rounded-input"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control rounded-input"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control rounded-input"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="email"
                className="form-control rounded-input"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control rounded-input"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn custom-btn w-100">
                <FaUserPlus className="me-2" /> {isEditing ? 'Update User' : 'Add User'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingUserId(null);
                    setFormData({ first_name: '', last_name: '', phone_number: '', email: '', address: '' });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* User List Section */}
      <div className="user-list-section">
        <h3 className="user-list-title">Users</h3>
        <div className="user-list">
          {users.length > 0 ? (
            users.map((user) => (
              <Card key={user[0]} className="user-card mb-4">
                <Card.Body>
                  <Card.Title>
                    {user[1]} {user[2]}
                  </Card.Title>
                  <Card.Text>
                    <strong>Phone:</strong> {user[3]}
                    <br />
                    <strong>Email:</strong> {user[4]}
                    <br />
                    <strong>Address:</strong> {user[5]}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleEdit(user)} className="me-2">
                    <FaEdit className="me-2" /> Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleShowModal(user[0])}>
                    <FaTrashAlt /> Delete
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;
