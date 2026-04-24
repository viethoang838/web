"use client"
import { useState } from "react"

export default function Button({label="Nút"}){
    const [count, setCount] = useState(0);
    return <button onClick={()=>{setCount(count+1)}}>
        {label}({count})
        </button>
}