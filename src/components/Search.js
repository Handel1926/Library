import React from "react";

function ListD(props){
    return <li className="searchList" onMouseDown={props.mouseOver}><a href={"/page/"  + props.id} >{props.title}</a></li>
}

export default ListD