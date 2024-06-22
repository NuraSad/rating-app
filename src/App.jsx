import { useState, useEffect } from 'react'
import './App.css'
import { get, post, put, del } from 'aws-amplify/api'

import ListTestimonial from './Components/ListTestimonial';
import addSVG from './assets/icons/plus.svg';
import cancelSVG from './assets/icons/x.svg';

function App() {
  const [testimonials, setTestimonials] = useState([]);
  const [isAddNew, setIsAddNew] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({name: '', text: '', rating: 1});

  function onInputChange(e) {
    setNewTestimonial({...newTestimonial, [e.target.name]: e.target.value})
  }
  
  async function callApi(){
    try {
    const restOperation = get({ 
      apiName: 'test',
      path: '/things' 
    });
    const response = await restOperation.response;
    const data = await response.body.json()
    setTestimonials(data)
    } catch (e) {
      console.log('POST call failed: ', JSON.parse(e.response.body))
    }
  }

  async function updateTestimonial(name, testimonial, rating, id){
    try {
      const restOperation = put({
        apiName: 'test',
        path: '/things', 
        options: {
          queryParams: {
            'id': id
          },
          body:{
            'name': name, 
            "testimonial": testimonial,
            "rating": parseInt(rating)
          }
        }
      })
      const response = await restOperation.response;
      const message = await response.body.json();
      return message
    } catch (e) {
      console.log('POST call failed: ', JSON.parse(e.response.body))
    }
  }

  async function createTestimonial(){
    try {
      const restOperation = post({
        apiName: 'test',
        path: '/things', 
        options: {
          body:{
            'name': newTestimonial.name, 
            "testimonial": newTestimonial.text,
            "rating": parseInt(newTestimonial.rating)
          }
        }
      })
      const response = await restOperation.response;
      setIsAddNew(false)
      callApi()
      alert("Testimonial added successfully!")
    } catch (e) {
      console.log('POST call failed: ', JSON.parse(e.response.body))
    }
    
  }

  async function deleteTestimonial(id){
    try {
      const restOperation = del({
        apiName: 'test',
        path: '/things', 
        options: {
          queryParams: {
            'id': id
          }
        }
      })
      const response = await restOperation.response;
      const message = await response.body.json();
      setTestimonials(prev => prev.filter(li => li.id !== id ))
      return message
    } catch (e) {
      console.log('POST call failed: ', JSON.parse(e.response.body))
    }

  }

  useEffect(() =>{
    callApi()
  }, [])

  if (testimonials.length === 0) {
    return (
      <h1>...Loading...</h1>
    )
  }

  return (
    <section className='container'>
      <h1>Welcome to Planet Earth Testimonials!</h1>
      <h2>There you can rate your experience living on Earth and see reviews of others.</h2>
      <h2>(or correct them if you don't like it)</h2>
      <ul className='testimonial-field'>
       {testimonials.map((testimonial) => (
        <ListTestimonial key={testimonial.id} id={testimonial.id} author={testimonial.name} text={testimonial.testimonial} rating={testimonial.rating} updateTestimonial={updateTestimonial} deleteTestimonial={deleteTestimonial}/>
       ))}
      </ul>
      {isAddNew ? 
        <div className="create-form">
          <label htmlFor='name'>Name:
              <input type='text' value={newTestimonial.name} name='name' minLength='4' maxLength='20' onChange={(e)=> onInputChange(e)}/>
          </label>
          <label htmlFor='text'>Review:
              <textarea type='text' value={newTestimonial.text} name='text' minLength='4' onChange={(e)=> onInputChange(e)}/>
          </label>
          <label htmlFor='rating'>Score:
          <select name="rating" value={newTestimonial.rating} onChange={(e)=> onInputChange(e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              </select>
          </label>
          <button onClick={createTestimonial}><img src={addSVG} alt='plus icon'/></button>
          <button onClick={() => setIsAddNew(false)}><img src={cancelSVG} alt='delete icon'/></button>
        </div>
        : <button className='add-btn' onClick={() => setIsAddNew(true)}>Add your review</button>}
    </section>
  )
}

export default App
