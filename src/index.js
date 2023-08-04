import React, {useState, useEffect} from "react";
import {createRoot} from "react-dom/client";
import ListD from "./components/Search";
import  Axios  from "axios";


function Search(){
    const [textInput, setTextInput] = useState("");
    const [show, setshow] = useState(false);
    const [notes, setNewnotes] = useState([])
    useEffect(()=>{
        async function getFaculties(){
            if (notes.length === 0){
                const faculties = await Axios.get("/faculty")
                setNewnotes(faculties.data)
            }
            
        }
        getFaculties(), []
    })
   
    function showtext(event, notes){
        let newtext = event.target.value
        setTextInput(event.target.value)
            setNewnotes((notes)=>{
                return notes.filter(note=>{
                    if (note.title.toLowerCase().includes(newtext.toLowerCase())){
                        return note
                    }
                })
                
            })
            
            event.preventDefault()
        // else {
        //     setNewnotes(faculties.data)
        //     setshow(false)
        // }
        event.preventDefault()
        
   }
   function showdef(){
    setshow(true)
   }
   function dontShow(){
    setTimeout(()=>{
        setshow(false)
    }, 1000)
    
   }
   function selectText(event){
    setshow(true)
    event.target.select()
   }
   
    return(
        <div>
        <form action="/home" method="post">
        <input onFocus={selectText} onBlur={dontShow}  onChange={showtext} type="text" />
        </form>
        <div className="searchDropdown">
        <ul>
        {show && notes.map((note)=>{
                return <ListD key={note._id} id={note._id} title={note.title} mouseOver={showdef}/>
            })}
        </ul>
        </div>
        
        </div>
    
    )

}

const search = createRoot(document.getElementById("search"));
search.render(<Search />)
