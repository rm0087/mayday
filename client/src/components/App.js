import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link, Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
// import Slide from "./Slide";

const slideContext = require.context('./Slides', false, /\.jsx$/);
const slides = slideContext.keys().map((file) => {
    const SlideComponent = slideContext(file).default;
    return <SlideComponent />;
});

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToPreviousSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + slides.length) % slides.length
        );
    };


    
    return (
        <div id = "slideshow-container">
            {currentIndex}
            {slides[currentIndex]}
            <button onClick={goToPreviousSlide}>Previous</button>
            <button onClick={goToNextSlide}>Next</button>
        </div>
    );
};








