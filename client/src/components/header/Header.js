import React from "react";
import { Link } from 'react-router-dom'
import 'boxicons'
function Header() {
    return (
        <header>
            <div>
                <h1><Link to="/">Hecap</Link></h1>
            </div>

            <ul>
                <li><Link to="/"><box-icon name='home-heart'></box-icon>Homepage</Link></li>
                <li><Link to="/login"><box-icon name='user-circle'></box-icon> Sign in</Link></li>
            </ul>
        </header >
    )
}
export default Header