import React from "react";
import './PlaylistList.css';
import { PlaylistItem } from "../PlaylistItem/PlaylisyItem";

export class PlaylistList extends React.Component {
    render(){
        return(
            <div className="PlaylistLists">
                {
                    this.props.onMount?.map((item) => {
                        return (<PlaylistItem item={item} key={item.id} />);
                    })
                }
            </div>
        )
    }

}