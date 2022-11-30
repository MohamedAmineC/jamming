import React from "react";

export class PlaylistItem extends React.Component{
    render(){
        return (
            <div>
                <p>{this.props.item.name}</p>
            </div>
        )
         
    }
}