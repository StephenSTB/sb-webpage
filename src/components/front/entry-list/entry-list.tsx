import { useNavigate } from "react-router";
import "../front.css"

interface EntryProps{
    entry: Array<string[]>;
}

export function EntryList(props : EntryProps){

    let navigate = useNavigate();

    return(
        <>
            
            {props.entry.map(e =>{
                return(
                    <div className="entry">
                        <div className="date">{e[0]}</div>
                        <div className="entry-space" />
                        <div className="redirect">{ e[1] === "page" ? <div onClick={() => navigate(`/page/${e[2]}`)}>{e[2]}</div> : 
                                                    e[1] === "link" ? <a className="entry-link" href={e[3]}><div className="redirect">{e[2]}</div></a> :
                                                    <></>}
                        </div>
                        <br/>
                    </div>
                )
            })}
        </>
    );
}