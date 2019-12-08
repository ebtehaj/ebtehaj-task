import React from 'react';
import '../App.css';


const Header = () => {
    return (
        <React.Fragment>
            <header>
                <h3>Welcome to reactjs note app !</h3>
            </header>
            {/* <input value={input} onChange={(e) => setInput(e.target.value)} /> */}
        </React.Fragment>
    );
}

export default Header;