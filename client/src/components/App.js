import React, { useState, useRef } from "react";
import slideContent from "./slide-content.json";
const { slides } = slideContent;

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideType, setSlideType] = useState(slides[currentIndex].type);
    const [language, setLanguage] = useState("en")
    const [isPlaying, setIsPlaying] = useState(true)
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    
    // SLIDE TEMPLATES //////////////////////////////////////////////////////////////////////////
    const Navigation = ({ content }) => {
        const links = content[language].links?.map((link) =>
            <button key={content[language].links.indexOf(link)} onClick={()=>
                {goToSlide(link.ref, slideContent.slides.find((slide)=>slide.id === link.ref))}}>{link.title}</button>
        )
        
        return (
            <>
            {links}
            </>
        )
    };

    const TextAndMediaSlide = ({ content }) => {
        
        //if listpoints is not empty, map list points
        const listPoints = content[language].listPoints?.map((point) =>
            point ? <li className="text-base leading-tight tracking-wide p-2">{point}</li> : null
        )

        const listPoints2 = content[language].listPoints2?.map((point) =>
            point ? <li className="text-base leading-tight tracking-wide p-2">{point}</li> : null
        )
        
        // if content.images is not empty, map images
        const images = content.images?.map((media) =>
            media? <img className="mt-2" src={media} alt="Slide Media" /> : null    
        )

        const videos = content.videos?.map((video)=>
            video? 
                <div className = "p-4 m-auto w-screen bg-slate-800 justify-items-center drop-shadow-xl">
                <video className="w-min h-auto" controls autoplay loop>
                    <source src={video} type="video/mp4"/>
                </video></div> : null
           
        )

        const uniqueMedia = content[language].uniqueMedia?.map((media)=>
            media.slice(-4) === ".mp4"?
            <div className = "p-4 mt-5 w-screen bg-slate-800 drop-shadow-xl">
                <video className="" controls autoplay>
                    <source src={media} type="video/mp4"/>
                </video>
                </div> 
                : <img src = {media} alt="Slide Media" />    
        )

        return (
            <>
            <div className="w-4/4">
                {content[language].listHeads && content[language].listHeads.length > 0 ? <h3 className="text-xl font-bold leading-tight tracking-wide p-5 m-auto">{content[language].listHeads[0]}</h3> : null}
                {listPoints}
                {content[language].listHeads2 && content[language].listHeads2.length > 0 ? <h3 className="text-xl font-bold leading-tight tracking-wide p-5 m-auto">{content[language].listHeads2[0]}</h3> : null}
                {listPoints2}
            </div>
                <div className = "grid-cols-2 justify-items-center mt-5" id= "medias">
                    {images}
                    {videos}
                    {uniqueMedia}
                </div>
            </>
        )
    };

    const QuizSlide = ({ content }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
        const [selectedAnswer, setSelectedAnswer] = useState(null);
        const [showFeedback, setShowFeedback] = useState(false);
        const [score, setScore] = useState(0);
        const [quizCompleted, setQuizCompleted] = useState(false);
    
        const questions = content[language].questions;
        const currentQuestion = questions[currentQuestionIndex];
    
        const handleAnswerSelect = (optionId) => {
            if (showFeedback) return;
            setSelectedAnswer(optionId);
        };
    
        const handleSubmit = () => {
            if (selectedAnswer === null) return;
            setShowFeedback(true);
    
            const selectedOption = currentQuestion.options.find(opt => opt.id === selectedAnswer);
            if (selectedOption?.isCorrect) {
                setScore(score + 1);
                // Play correct answer sound here
            } else {
                // Play incorrect answer sound here
            }
        };
    
        const moveToNextQuestion = () => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                setQuizCompleted(true);
            }
        };
    
        const getFinalFeedback = () => {
            const percentage = (score / questions.length) * 100;
            if (percentage === 100) return "Perfect score!";
            if (percentage >= 70) return "Decent job.";
            return "You need to study more.";
        };
    
        return (
            <div className="w-full max-w-2xl mx-auto p-6 flex-grow">
                {!quizCompleted ? (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Question</h2>
                        
                        <div className="m-0 text-sm text-gray-500">
                            {`${currentQuestionIndex + 1} / ${questions.length}`}
                        </div>
                        <div className="space-y-4 justify-items-center">
                            {content.images.length > 0  ?
                            <img
                                src={content.images[0]}
                                alt="Question media"
                                className="max-w-full h-auto rounded-lg"
                            />
                            : null}
                            <h3 className="tracking-wide leading-none font-semibold">{currentQuestion.questionText}</h3>
                            
                            <div className="w-full space-y-2 items-center flex flex-col">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.id}
                                        className={`w-full text-left text-20px p-4 rounded-lg border ${
                                            selectedAnswer === option.id
                                                ? showFeedback
                                                    ? option.isCorrect
                                                        ? 'bg-green-100 border-green-500'
                                                        : 'bg-red-100 border-red-500'
                                                    : 'bg-blue-50 border-blue-500'
                                                : 'hover:bg-gray-50'
                                        } ${
                                            showFeedback && option.isCorrect ? 'ring-2 ring-green-500' : ''
                                        }`}
                                        onClick={() => handleAnswerSelect(option.id)}
                                        disabled={showFeedback}
                                    >
                                        <span className="mr-2">{option.id.toUpperCase()}.</span>
                                        {option.text}
                                        {showFeedback && option.isCorrect && (
                                            <span className="ml-auto text-green-500">✓</span>
                                        )}
                                        {showFeedback && selectedAnswer === option.id && !option.isCorrect && (
                                            <span className="ml-auto text-red-500">✗</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {showFeedback && (
                                <div
                                    className={`p-4 rounded-lg ${
                                        currentQuestion.options.find(opt => opt.id === selectedAnswer)?.isCorrect
                                            ? 'bg-green-100 text-20px text-green-800'
                                            : 'bg-red-100 text-20px text-red-800'
                                    }`}
                                >
                                    {currentQuestion.options.find(opt => opt.id === selectedAnswer)?.isCorrect
                                        ? currentQuestion.feedback.correct
                                        : currentQuestion.feedback.incorrect}
                                </div>
                            )}
                            <div className="flex justify-end space-x-4">
                                {!showFeedback ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={selectedAnswer === null}
                                        className={`px-4 py-2 rounded-lg ${
                                            selectedAnswer === null
                                                ? 'bg-gray-100 text-20px text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 text-20px text-white hover:bg-blue-600'
                                        }`}
                                    >
                                        Submit Answer
                                    </button>
                                ) : (
                                    <button
                                        onClick={moveToNextQuestion}
                                        className="px-4 py-2 rounded-lg bg-blue-500 text-20px text-white hover:bg-blue-600"
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <h2 className="text-20px font-bold">Quiz Complete!</h2>
                        <p className="text-20px">Your score: {score} out of {questions.length}</p>
                        <p className="text-20px">{getFinalFeedback()}</p>
                    </div>
                )}
            </div>
        )
    };
    // END SLIDE TEMPLATES //////////////////////////////////////////////////////////////////////
    
    // SLIDE CONTROLS /////////////////////////////////////////////////////////////////////
    const goToSlide = (index, slide) => {
        setCurrentIndex(index-1)
        setSlideType(slide.type)
    }

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

    const toggleMediaPlayback = () => {
        if (isPlaying) {
          audioRef.current?.pause();
          videoRef.current?.pause();
        } else {
          audioRef.current?.play();
          videoRef.current?.play();
        }
        setIsPlaying(!isPlaying);
      };

      const handleLanguage = (key) => setLanguage(key)
      // END SLIDE CONTROLS /////////////////////////////////////////////////////////////////////

    // Define slide templates based on slideType
    const renderSlide = () => {
        switch (slideType) {
            case "1":
                return <Navigation content={slides[currentIndex]} />;
            case "2":
                return <TextAndMediaSlide content={slides[currentIndex]} />;
            case "4":
                return <QuizSlide content={slides[currentIndex]} />;
            default:
                return <div>Unknown slide type</div>;
        }
    };
    
    // useEffect(()=>{renderSlide()},[currentIndex])

    return (
        <>
            <button className="h-10 w-10 border">E</button>
            {Object.entries(slideContent.languages).map(([key,language]) =>
                    <button key={key} onClick={()=>handleLanguage(key)}>{language}</button>
                )}
            <div className="min-w-full mb-5" id ="header-limit">
                <div className="m-auto bg-slate-500 p-7 justify-items-center" id = "header">
                    <div className="w-3/4" id ="title">
                        <h1 className="w-full text-left text-3xl font-bold">{slideContent.slides[currentIndex].id}. {slideContent.slides[currentIndex][language].title}</h1>
                    </div>
                </div>
            </div>
            <div className="w-full justify-items-center"id ="container-limit">
                <div className="m-auto pb-5 w-4/4"id ="container">
                    {<audio ref={audioRef} src={slideContent.slides[currentIndex][language].soundtrack} loop />}
                    <div className="w-4/4 items-center flex flex-col" id = "render-slide">{renderSlide()}</div>
                </div>
            </div>
            <div id = "control-panel">
                <div id = "controls">
                    <button onClick={goToPreviousSlide}>Previous</button>
                    <button onClick={toggleMediaPlayback}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={goToNextSlide}>Next</button>
                </div>
            </div>
        </>
    );
}