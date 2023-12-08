
const Menu = require('../models/Menu');
const fs = require("fs");

exports.createMenuItem = (name, price, image) => {
  return new Promise((resolve, reject) => {
      console.log(name)
      const menuItem = new Menu({name, price, image});
      console.log(menuItem)
        const newMenuItem = menuItem.save().then((item) => {
          resolve(item);
        }).catch((err) => {
          reject({message: "Failed to save item to database", error: err});
        });
    }
  )
};

exports.getAllMenuItems = async (req, res, next) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (error) {
    next(error);
  }
};

exports.getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id);
    res.status(200).json(menuItem);
  } catch (error) {
    next(error);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  const itemId = req.params.id;
    const { name, price } = req.body;
    let imagePath = null;

    // Check if a new image was uploaded
    if (req.file) {
        imagePath = req.file.path; // Get the path of the uploaded image
    }
    // console.log(imagePath)

    try {
        const itemToUpdate = await Menu.findById(itemId);
        // console.log(itemToUpdate)
        if (!itemToUpdate) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update name and price if provided
        if (name) itemToUpdate.name = name;
        if (price) itemToUpdate.price = price;

        // Update the image path if a new image was uploaded
        if (imagePath) {
            if (itemToUpdate.image) {
                // Remove the previous image file if it exists
                fs.unlinkSync(itemToUpdate.image);
            }
            itemToUpdate.image = imagePath;
        }

        const updatedItem = await itemToUpdate.save();


        return res.json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating item', error: error.message });
    }
};





exports.deleteMenuItem = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json(deletedMenuItem);
  } catch (error) {
    next(error);
  }
};


exports.uploadImage = async (req, res, next) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Erreur lors de l\'upload du fichier' });
      } else if (err) {
        return res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'upload du fichier' });
      }
      
      const { id } = req.params;
      const imageUrl = req.file.path; // Chemin de l'image uploadée
      
      const menuItem = await Menu.findByIdAndUpdate(id, { imageUrl }, { new: true });
      res.status(200).json(menuItem);
    });
  } catch (error) {
    next(error);
  }
};
