import express from 'express'
import multer from 'multer'
import Item from '../models/Item.js' 

const router = express.Router();

// this is multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads') 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
})

const upload = multer({ storage })

// here we are uploading the data from add item page to backend
router.post('/', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 },
]), async (req, res) => {
  try {
    console.log('FILES:', req.files)

    const { name, type, description } = req.body

    const coverImagePath = req.files['coverImage']?.[0]
  ? `${req.protocol}://${req.get('host')}/${req.files['coverImage'][0].path.replace(/\\/g, '/')}`
  : null

const additionalImagePaths = req.files['additionalImages']
  ? req.files['additionalImages'].map(file =>
      `${req.protocol}://${req.get('host')}/${file.path.replace(/\\/g, '/')}`
    )
  : []


    const newItem = new Item({
      name,
      type,
      description,
      coverImage: coverImagePath,
      additionalImages: additionalImagePaths,
    })

    await newItem.save();
    res.status(201).json({ message: 'Item saved successfully', item: newItem });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to save item' })
  }
});

// here we are tell them to fetch data whenever we need like in view page
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
});

// here is the function of delting 
router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findByIdAndDelete(itemId);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Failed to delete item' });
  }
});


export default router;
