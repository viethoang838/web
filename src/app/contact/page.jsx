"use client"
import { useRef } from "react"

export default function Contact(){
    const name = useRef('');
    const email = useRef('');
    const message = useRef('');
    const handleContact = (e)=> {
        e.preventDefault();
        console.log(name.current.value,email.current.value, message.current.value);
        
    }
    return (
        <div>
            <h1>Lien he</h1>
            <form onSubmit={handleContact}>
                <label htmlFor="name">Ho ten</label>
                <input type="text" id="name" ref={name}/><br />

                <label htmlFor="name">Email</label>
                <input type="email" id="email" ref={email} /><br />

                <label htmlFor="message">Noi dung lien he</label>
                <textarea  id="message" ref={message}></textarea> <br />

                <button type="submit">Gui</button>
            </form>
        </div>
    )
}