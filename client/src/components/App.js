import React, { useState } from "react";
import slideContent from "./slide-content.json";
const { slides } = slideContent;

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideType, setSlideType] = useState(slides[currentIndex].type);
    const [language, setLanguage] = useState("vi")

    // Example Slide Templates
    const TitleSlide = ({ content }) => (
        <div>
            <h1>{content[language].title}</h1>
        </div>
    );

    const TextOnlySlide = ({ content }) => (
        <div>
            <p>{content[language].text}</p>
        </div>
    );

    const TextAndMediaSlide = ({ content }) => {
        const listPoints = content[language].listPoints.map((point)=><li>{point}</li>);
        return (
        <div>
            
            <h1>{content[language].title}</h1>
            <h3>{content[language].listHeads?.[0] || ""}</h3>
            {listPoints}
            {/* <img src={content[language].imageUrl} alt="Slide Media" /> */}
        </div>
        )
    };

    const MediaOnlySlide = ({ content }) => (
        <div>
            <img src={content[language].imageUrl} alt="Slide Media" />
        </div>
    );

    const QuizSlide = ({ content }) => (
        <div>
            <h1>{content[language].question}</h1>
            <ul>
                {content[language].options.map((option, index) => (
                    <li key={index}>{option}</li>
                ))}
            </ul>
        </div>
    );

    const MediaAndQuizSlide = ({ content }) => (
        <div>
            <img src={content[language].imageUrl} alt="Slide Media" />
            <h1>{content[language].question}</h1>
            <ul>
                {content[language].options.map((option, index) => (
                    <li key={index}>{option}</li>
                ))}
            </ul>
        </div>
    );

    const goToNextSlide = () => {
        const newIndex = (currentIndex + 1) % slides.length;
        const newSlideType = slides[newIndex].type;
        setCurrentIndex(newIndex);
        setSlideType(newSlideType);
    };

    const goToPreviousSlide = () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        const newSlideType = slides[newIndex].type;
        setCurrentIndex(newIndex);
        setSlideType(newSlideType);
    };

    // Define slide templates based on slideType
    const renderSlide = () => {
        switch (slideType) {
            case "0":
                return <TitleSlide content={slides[currentIndex]} />;
            case "1":
                return <TextOnlySlide content={slides[currentIndex]} />;
            case "2":
                return <TextAndMediaSlide content={slides[currentIndex]} />;
            case "3":
                return <MediaOnlySlide content={slides[currentIndex]} />;
            case "4":
                return <QuizSlide content={slides[currentIndex]} />;
            case "5":
                return <MediaAndQuizSlide content={slides[currentIndex]} />;
            default:
                return <div>Unknown slide type</div>;
        }
    };

    return (
        <>
            <div id = "slideshow-container">
                <div>{renderSlide()}</div>
            </div>
            <div id = "test-stats">
                <p>Current index: {currentIndex}</p>
                <p>Slide ID: {slides[currentIndex].id}</p>
                <p>Slide type: {slideType} - {slideContent.slideTypes[slideType]}</p>
                <button onClick={goToPreviousSlide}>Previous</button>
                <button onClick={goToNextSlide}>Next</button>
            </div>
        </>
    );
}
