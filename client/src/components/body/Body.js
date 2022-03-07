import React from "react";
import { Routes, Route } from 'react-router-dom'
import Login from "./auth/Login";
function Body() {
    return (
        <section>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </section>
    )
}
export default Body