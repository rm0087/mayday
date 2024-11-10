import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link, Outlet} from 'react-router-dom';
import Navbar from "./Navbar";
import slideContent from "./slide-content.json"
const { slides } = slideContent

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [slideType, setSlideType] = useState(slides[currentIndex].type)



    const TextAndMedia = () => {
        return (
            <>
                <h1>{slides[currentIndex].listHeaders}</h1>
                {slides[currentIndex].listPoints.map((point)=>{point})}
            </>
        )
    }

    const goToNextSlide = () => {
        const newIndex = (currentIndex + 1) % slides.length;
        setCurrentIndex(newIndex);
        setSlideType(slides[newIndex].type);
        console.log(slides[newIndex].type);
    };

    const goToPreviousSlide = () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        setCurrentIndex(newIndex);
        setSlideType(slides[newIndex].type);
    };

    return (
        <>
            <div id = "slideshow-container">
                
            </div>
            <div id = "test-stats">
                <p>Current Index: {currentIndex}</p>
                <p>Slide ID: {slides[currentIndex].id}</p>
                <p>Slide type: {slideType} - {slideContent.slideTypes[slideType]}</p>
                <button onClick={goToPreviousSlide}>Previous</button>
                <button onClick={goToNextSlide}>Next</button>
            </div>
        </>
    );
};





