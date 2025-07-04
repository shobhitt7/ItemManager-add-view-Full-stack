import { useState } from 'react'
import '../App.css'
import Loader from './loader.jsx'

export default function AddPage() {

  //here we are handling form useState
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
  })

  const [coverImage, setCoverImage] = useState(null)
  const [additionalImages, setAdditionalImages] = useState([])

   //this is for loader 
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('type', form.type)
    formData.append('description', form.description)

    if (coverImage) {
      formData.append('coverImage', coverImage)
    }

    additionalImages.forEach((img) => {
      formData.append('additionalImages', img)
    })
     

    //here we are uploading our add item data to backend
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/items`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        alert('Item added successfully!')
        setForm({ name: '', type: '', description: '' })
        setCoverImage(null)
        setAdditionalImages([])
      } else {
        alert(data.message || 'Failed to add item')
      }
    } catch (err) {
      console.error('Error uploading item:', err)
      alert('Error uploading item')
    } finally {
      setLoading(false)
    }
  }
  
  //this is jsx 
  return loading ? (
    <Loader />
  ) : (
    <form onSubmit={handleSubmit} className="add-item-form">
      <h2>Add Item</h2>

      <input
        type="text"
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="type"
        placeholder="Item Type (e.g., Shirt, Shoes)"
        value={form.type}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Item Description"
        value={form.description}
        onChange={handleChange}
        rows="4"
        required
      />

      <label>Cover Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImage(e.target.files[0])}
        required
      />

      <label>Additional Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) =>
          setAdditionalImages((prev) => [...prev, ...Array.from(e.target.files)])
        }
      />

      <div>
        {additionalImages.map((img, index) => (
          <img
            key={index}
            src={URL.createObjectURL(img)}
            alt={`preview-${index}`}
            style={{ width: '80px', height: '80px', marginRight: '8px' }}
          />
        ))}
      </div>

      <button type="submit">Add Item</button>
    </form>
  )
}
