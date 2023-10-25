import "./page.css"
import { useNavigate } from "react-router"

interface PageProps{
    title: string
    date: string
    content: JSX.Element
}

export function Page(props: PageProps){

    let navigate = useNavigate();

    return(
        <div className="page">
            <div className="title">{props.title}</div>
            <div className="page-divider"/>
            <div className="page-date">{props.date}<div className="see-posts" onClick={() => navigate("/front/blog")}>See all posts</div></div>
            <br/>
            <div className="page-content">{props.content}</div>
        </div>
    );
}