const Admin = require('../models/AdminModel');

exports.createProfile = async (req, res) => {
    try {
      const { username, email, password, description } = req.body;
      const profileImageURL = req.file ? '/uploads/adminImages/' + req.file.filename : null;
  
      if (!profileImageURL) {
        return res.status(400).json({ message: 'No profile image uploaded' });
      }
  
      const newAdmin = new Admin({
        username,
        email,
        password,
        description,
        profileImageURL,
      });
  
      await newAdmin.save();
      res.status(201).json({ message: 'Admin profile created successfully', admin: newAdmin });
    } catch (err) {
      res.status(400).json({ message: 'Error creating admin profile', error: err.message });
    }
  };
  


// Get Admin Profile by ID
exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin profile not found' });
        }

        res.status(200).json({ admin });
    } catch (err) {
        res.status(400).json({ message: 'Error fetching admin profile', error: err.message });
    }
};

// Update Admin Profile
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin profile not found' });
        }

        res.status(200).json({ message: 'Admin profile updated successfully', admin: updatedAdmin });
    } catch (err) {
        res.status(400).json({ message: 'Error updating admin profile', error: err.message });
    }
};

// Delete Admin Profile
exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin profile not found' });
        }

        res.status(200).json({ message: 'Admin profile deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting admin profile', error: err.message });
    }
};
