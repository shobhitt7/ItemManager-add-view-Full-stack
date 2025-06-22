import { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick'
import emailjs from '@emailjs/browser'
import '../index.css'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default function ViewItemsPage() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const formRef = useRef()

  // Helper function to get correct image URL
  const getImageUrl = (imageUrl) => {
    // If it's already a full URL (starts with http), use it directly
    if (imageUrl && imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Otherwise, construct the URL (for local development)
    return `${import.meta.env.VITE_BACKEND_URL}/uploads/${imageUrl}`;
  };

  //here slider working using slick-carousel a react plugin used for sliding images
  const sliderSettings = {
    dots: true,
    infinite: selectedItem?.additionalImages?.length > 0,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  //here fetching the details from backend
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/items`)
        const data = await res.json()
        setItems(data)
      } catch (err) {
        console.error('Failed to load items', err)
      }
    }
    fetchItems()
  }, [])

  //here delete item function works
  const handleDelete = async (e, itemId) => {
    e.stopPropagation()
    const confirmDelete = window.confirm('Confirm delete this item?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Item deleted successfully')
        setItems(items.filter(item => item._id !== itemId))
        if (selectedItem?._id === itemId) setSelectedItem(null)
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error('Error deleting item:', err)
      alert('Error deleting item')
    }
  }

  return (
    <div className="view-items-container">
      <h2>View Items</h2>

      <div className="items-grid">
        {items.map((item) => (
          <div
            key={item._id}
            className="item-card"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={getImageUrl(item.coverImage)}
              alt={item.name}
              className="cover-img"
              onError={(e) => {
                console.error('Cover image failed to load:', e.target.src);
                console.error('Original coverImage value:', item.coverImage);
              }}
            />
            <p><strong>{item.name}</strong></p>
            <button onClick={(e) => handleDelete(e, item._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* this is item modal when you click in view item */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="item-title">{selectedItem.name}</h3>
            <p className="item-info"><strong>Type:</strong> {selectedItem.type}</p>
            <p className="item-info"><strong>Description:</strong> {selectedItem.description}</p>

            {selectedItem && (
              <Slider {...sliderSettings}>
                {[selectedItem.coverImage, ...(selectedItem.additionalImages || [])]
                  .filter((img, idx, arr) => arr.indexOf(img) === idx)
                  .map((img, i) => (
                    <div key={i}>
                      <img
                        src={getImageUrl(img)}
                        alt={`slide-${i}`}
                        className="slider-img"
                        onError={(e) => {
                          console.error('Slider image failed to load:', e.target.src);
                          console.error('Original image value:', img);
                        }}
                      />
                    </div>
                ))}
              </Slider>
            )}

            <br />
            <button className="modal-btn enquire-btn" onClick={() => setShowEnquiryModal(true)}>
              Enquire
            </button>
            <button className="modal-btn close-btn" onClick={() => setSelectedItem(null)}>
              Close
            </button>
          </div>

          {/* this is enquiry emailjs form */}
          {showEnquiryModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Enquire about: {selectedItem.name}</h3>
                <form
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault()
                    emailjs.sendForm(
                      'service_6kimbnc',
                      'template_e0x5s1u',
                      formRef.current,
                      'p8vUQEo5zFicI3ZH1'
                    )
                    .then(() => {
                      alert('Your request has been sent to the seller!')
                      setShowEnquiryModal(false)
                    })
                    .catch((err) => {
                      alert('Failed to send. Please try again.')
                      console.error(err)
                    })
                  }}
                >
                  <input type="hidden" name="item_name" value={selectedItem.name} />
                  <input type="text" name="from_name" placeholder="Your Name" required />
                  <input type="email" name="reply_to" placeholder="Your Email" required />
                  <textarea name="message" placeholder="Your Message" required />
                  <br />
                  <button type="submit">Send Enquiry</button>
                  <button onClick={() => setShowEnquiryModal(false)} type="button" style={{ marginLeft: '10px' }}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}