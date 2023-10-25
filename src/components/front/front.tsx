import { Outlet, useNavigate} from "react-router";
import "./front.css"

interface FrontProps{
    theme: string;
}

export function Front(props :  FrontProps){

    const navigate = useNavigate();

    return(
        <>
        <div className={`front-header ${props.theme}`}>Stephen Bettis's Website</div>
        <br/>
        <div className='divider'/>
        <div className="links-box">
            <a className="link" onClick={() => navigate("/front/blog")}>Blog</a>
            <a className="link" onClick={() => navigate("/front/crypto")}>Crypto</a>
            <a className="link" onClick={() => navigate("/front/projects")}>Projects</a>
            <a className="link" onClick={() => navigate("/front/art")}>Art</a>
        </div>
        <div className='divider'/>
        <br/>
        <Outlet />
        </>
    );
}
