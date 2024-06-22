import { useState, useRef } from "react";
import './ListTestimonial.css';
import cancelSVG from '../assets/icons/x.svg';
import editSVG from '../assets/icons/edit.svg';
import checkSVG from '../assets/icons/check.svg';

export default function ListTestimonial({id, author, text, rating, updateTestimonial, deleteTestimonial}){
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({
        author, text, rating
    })

    function onInputChange(e){
        setForm({...form, [e.target.name]: e.target.value})
    }

    async function onSaveBtnClick(e, id){
        const message = await updateTestimonial(form.author, form.text, form.rating, id)
        setIsEditing(false)
        if (message === 'success'){
            alert(message)
            setIsEditing(false)

        } else {
            alert(message)
        }  
    }

    async function onDeleteBtnClick(id){
        if (window.confirm("Delete?")){
            const message = await deleteTestimonial(id)
        }

    }

    let itemComponent;
    if (isEditing){
        itemComponent = (
            <div className="input-form">
            <label htmlFor='author'>Name:
                <input type='text' value={form.author} name='author' minLength='4' maxLength='20' onChange={(e)=> onInputChange(e)}/>
            </label>
            <label htmlFor='text'>Review:
                <textarea type='text' value={form.text} name='text' style={{ width: Math.min(Math.max(form.text.length, 2), 50) + 'ch' }} minLength='4' onChange={(e)=> onInputChange(e)}/>
            </label>
            <label htmlFor='rating'>Score:
            <select name="rating" value={form.rating} onChange={(e)=> onInputChange(e)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>
            </label>
            <button onClick={(e) => onSaveBtnClick(e, id)}><img src={checkSVG} alt='check mark'/></button>
            <button onClick={() => setIsEditing(false)}><img src={cancelSVG} alt='delete icon'/></button>
            </div>
        )
    } else {
        itemComponent = (
            
            <li>
                <span>{form.author}:</span>{form.text}<Stars count={form.rating}/>
                <button onClick={()=> setIsEditing(true)}><img src={editSVG} alt='edit icon'/></button>
                <button onClick={() => onDeleteBtnClick(id)}><img src={cancelSVG} alt='delete icon'/></button>
                </li>
        
        )
    }
    return(
        <>
            {itemComponent}
        </>
    )
}

function Stars({count}){
    const starArr = new Array(parseInt(count)).fill('★').concat(new Array(5 - parseInt(count)).fill('☆'));
    return (
        <div>
        {starArr}
        </div>
    )
}