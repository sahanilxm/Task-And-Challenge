import { useNavigate } from 'react-router-dom';

function NotAdmin(){

    const navigateTo = useNavigate();

    return(
        <div>
            <h1>You can't get here, because you aren't admin</h1>
            <br/>
            <button onClick={()=>navigateTo('../')}>Back to main page</button>
        </div>
    );
}

export default NotAdmin