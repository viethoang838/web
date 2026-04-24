"use client"
import { useState } from "react"

export default function Gopy(){
    const[gopY, themGopY] = useState("");
    const [dsGopY, themDSGopY] = useState([]);
    const handleSubmit = (e) =>{
        e.preventDefault();
        if(gopY.trim().length > 0){
            themDSGopY([...dsGopY,gopY]);
            themGopY("");
        }
    }
    const handleDelete = (index) =>{
        let dsTam = dsGopY.filter((gopY,i)=>i != index);
        themDSGopY(dsTam);
    }
    return (
        <div>
            <h1>Gop y</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={gopY} onChange={(e)=>themGopY(e.target.value)}/>
                <button type="submit">gui</button>
            </form>
            <h3>Gop y da gui</h3>
            <ul>
                {dsGopY.map((noiDung,index)=>(
                    <li key={index}>{noiDung}<button onClick={(e)=>handleDelete(index)}>Xoa</button></li>
                ))}
            </ul>
        </div>
    )
}