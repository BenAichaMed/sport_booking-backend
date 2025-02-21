const Court = require('../models/Court')


const addCourt = async(req,res)=>{
    try {
        const { name, type, location, price, availability, image, description, rating, reviews, amenties,contact } = req.body;
        
        // Validate input
        if (!name || !type || !location || !price || !availability || !image, !description, !rating, !reviews, !amenties, !contact) {
          return res.status(400).json({ message: 'All fields are required' });
        }
    
        // Create a new court
        const newCourt = new Court({ name, type, location, price, availability, image, description, rating, reviews, amenties,contact });
        await newCourt.save();
    
        res.status(201).json({ message: 'Court added successfully', court: newCourt });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};

const editCourt = async(req,res)=>{
    try {
        const { name, type, location, price, availability, image, description, rating, reviews, amenties,contact } = req.body;
        const { courtId } = req.params;
    
        // Update court details
        const updatedCourt = await Court.findByIdAndUpdate(
          courtId,
          {name, type, location, price, availability, image, description, rating, reviews, amenties,contact },
          { new: true }
        );
    
        if (!updatedCourt) {
          return res.status(404).json({ message: 'Court not found' });
        }
    
        res.json({ message: 'Court updated successfully', court: updatedCourt });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};

const deleteCourt = async(req,res)=>{
    try {
        const { courtId } = req.params;
    
        // Delete court
        const deletedCourt = await Court.findByIdAndDelete(courtId);
    
        if (!deletedCourt) {
          return res.status(404).json({ message: 'Court not found' });
        }
    
        res.json({ message: 'Court deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    };
const getAllCourts = async(req,res)=>{
    try {
        const courts = await Court.find();
        res.json({ courts });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }

}    

const getSingleCourt = async(req,res)=>{
    try {
        const { courtId } = req.params;
    
        const court = await Court.findById(courtId);
    
        if (!court) {
          return res.status(404).json({ message: 'Court not found' });
        }
    
        res.json({ court });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

module.exports = {addCourt,editCourt,deleteCourt,getAllCourts,getSingleCourt}


