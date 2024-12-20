import React, { useState, useRef } from "react";
import slideContent from "./slide-content.json";
const { slides } = slideContent;

export default function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideType, setSlideType] = useState(slides[currentIndex].type);
    const [language, setLanguage] = useState("en");
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [fadeEffect, setFadeEffect] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // SLIDE COMPONENTS //////////////////////////////////////////////////////////////////////////
    const Navigation = ({ content }) => {
        const links = content[language].links?.map((link) =>
            <button key={content[language].links.indexOf(link)} 
                className="w-[300px] border rounded-lg text-center text-20px m-1 p-4 font-roboto font-bold hover:bg-gray-100" 
                onClick={()=>
                    {goToSlide(link.ref)}}>{link.title}</button>
        )
        
        return (
            <div className="flex flex-col mt-10 items-center">
                {links}
            </div>
        )
    };

    const PdfSlide = ({ content }) => {
        const links = content[language].links?.map((link) =>
            <a key={content[language].links.indexOf(link)} 
                href={link.ref} 
                className="w-[300px] flex items-center m-1 p-1 border rounded-lg text-left text-20px font-roboto font-bold hover:bg-gray-100" 
                target="_blank" 
                rel="noreferrer">
                    <div>
                        <img className="rounded-lg border w-8 h-8 m-4 shadow-md" 
                        src="/assets/images/pdf-logo-sm.png" alt="PDF document"/>
                    </div>
                    <p className="text-left">{link.title}</p>
            </a>
        )
        
        return (
            <>
                <div className="flex flex-col mt-10 items-center">
                {content[language].listHeads && content[language].listHeads.length > 0 ? 
                    <h3 className="text-xl font-bold leading-tight tracking-wide p-2 m-auto font-roboto">{content[language].listHeads[0]}</h3> : null}
                {links}
                </div>
            </>
        )
    }

    const TextAndMediaSlide = ({ content }) => {
        const listPoints = content[language].listPoints?.map((point) =>
            point ? <li key={content[language].listPoints.indexOf(point)} 
                className="list-none leading-tight tracking-wide p-2 font-serif text-lg before:text-lg before:content-['⚓'] before:mr-2">{point}</li> : null
        )

        const listPoints2 = content[language].listPoints2?.map((point) =>
            point ? <li key={content[language].listPoints2.indexOf(point)} 
                className="list-none leading-tight tracking-wide p-2 font-serif text-lg before:content-['⚓'] before:mr-2">{point}</li> : null
        )
        
      
        const images = content.images?.map((media) =>
            media? <img key={content.images.indexOf(media)} 
                className="w-auto h-auto max-w-full max-h-full mt-5" 
                src={media} 
                alt="Slide Media"/> : null    
        )

        const videos = content.videos?.map((video)=>
            video? 
                <div key={video} 
                    className = "mt-5 p-4 bg-slate-800 drop-shadow-md justify-center">
                    <video
                        src={video} 
                        className="w-min h-auto" 
                        controls autoPlay loop>
                    </video>
                </div> : null
           
        )

        const animations = content.animations?.map((animation)=>
            animation?
                <div className = "mt-5 p-4 bg-slate-800 drop-shadow-md justify-center">
                    <div id={`sprite${content.id}`} 
                        className="bg-no-repeat bg-contain" 
                        style={{ backgroundImage: `url(${animation})` }}>
                    </div>
                </div> : null

        )

        const uniqueMedia = content[language].uniqueMedia?.map((media)=>
            media.slice(-4) === ".mp4"?
            <div className = "mt-5 p-4 bg-slate-800 drop-shadow-md justify-center">
                <video className="" controls autoPlay>
                    <source key={content.images.indexOf(media)} 
                        src={media} 
                        type="video/mp4"> 
                    </source>
                </video>
            </div>
            : 
            <div className="p-4 bg-slate-500 shadow-lg">
                <img key={content.images.indexOf(media)} 
                    src = {media} 
                    alt="Slide Media">  
                </img>
            </div>    
        )

        return (
            <>
            {<div className="w-full list-inside mt-7 md:p-6">
                {content[language].listHeads && content[language].listHeads.length > 0 ? 
                    <h3 className="text-xl font-bold leading-tight tracking-wide p-2 m-auto font-roboto">{content[language].listHeads[0]}</h3> : null}
                {listPoints}
                {content[language].listHeads2 && content[language].listHeads2.length > 0 ? 
                    <h3 className="text-xl font-bold leading-tight tracking-wide p-2 m-auto font-roboto">{content[language].listHeads2[0]}</h3> : null}
                {listPoints2}
            </div>}
                <div className = "grid place-items-center" id= "medias">
                    {images}
                    {videos}
                    {uniqueMedia}
                    {animations}
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
            scrollToTopQuiz()
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
            <div className="w-full max-w-2xl p-6 flex-grow ">
                {!quizCompleted ? (
                    <div className="space-y-6 mt-5">
                        <h2 className="text-2xl font-bold font-roboto">Question</h2>
                        <div className="m-0 text-sm text-gray-500" id="test">
                            {`${currentQuestionIndex + 1} / ${questions.length}`}
                        </div>
                        <div className="space-y-4 grid place-items-center mt-5">
                            {currentQuestion.media.image  ?
                            <img
                                src={currentQuestion.media.image}
                                alt="Question media"
                                className="max-w-full h-auto rounded-lg drop-shadow-md"
                            />
                            : null}
                            <h3 className="tracking-wide leading-tight font-semibold text-lg font-roboto">{currentQuestion.questionText}</h3>
                            
                            <div className="w-full space-y-2 items-center flex flex-col">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.id}
                                        className={`w-full text-left text-base p-4 rounded-lg border font-roboto ${
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

    // END SLIDE COMPONENTS //////////////////////////////////////////////////////////////////////
    
    // SLIDE CONTROLS /////////////////////////////////////////////////////////////////////
    const goToSlide = (index) => {
        
        scrollToTop();
        
        setIsMenuOpen(false)
        
        setFadeEffect(true)
        setTimeout(() => {
            // Change slide after fade-out completes
            setCurrentIndex(index-1);
            setSlideType(slideContent.slides[index - 1].type);
            // Trigger fade-in effect
            setFadeEffect(false);
          }, 500);
    }

    const goToNextSlide = () => {
        
        const newIndex = (currentIndex + 1) % slides.length;
        const newSlideType = slides[newIndex].type;
        scrollToTop();
        setIsPlaying(false)
        
        setFadeEffect(true)
        setTimeout(() => {
            // Change slide after fade-out completes
            setCurrentIndex(newIndex);
            setSlideType(newSlideType);
            // Trigger fade-in effect
            setFadeEffect(false);
          }, 500);
    };

    const goToPreviousSlide = () => {
       
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        const newSlideType = slides[newIndex].type;
        scrollToTop();
        setIsPlaying(false)
        
        setFadeEffect(true)
        setTimeout(() => {
            // Change slide after fade-out completes
            setCurrentIndex(newIndex);
            setSlideType(newSlideType);
            // Trigger fade-in effect
            setFadeEffect(false);
          }, 500);
    };

    const toggleMediaPlayback = () => {
        if (isPlaying) {
          audioRef.current?.pause();
          
        } else {
          audioRef.current?.play();
          
        }
        setIsPlaying(!isPlaying);
      };

    const scrollToTop = () => {
        window.scrollTo(0,0)
    }

    const scrollToTopQuiz = () => {
        const contentFrame = document.getElementById('header');
        if (contentFrame) {
            contentFrame.scrollIntoView();
        }
    }

    const handleLanguage = (key) => setLanguage(key)
      // END SLIDE CONTROLS /////////////////////////////////////////////////////////////////////

    // Define slide templates based on slideType
    
    const renderSlide = () => {
        // Apply the animation class if isAnimating is true
        return (
            <div id="render-div"
                className={`relative w-full md:w-2/4 md:min-w-[960px] flex flex-col items-center transition-all border rounded-lg shadow-lg pt-5 pb-12 md:p-5f ${fadeEffect ? 'opacity-0' : "opacity-100"}`}
            >
            {slideContent.slides[currentIndex][language].soundtrack ? 
                <button 
                    className={`hover:border-2 hover:bg-white hover:font-bold hover:text-black absolute top-0 left-0 m-3 md:m-2 w-7 h-7 md:w-10 md:h-10 flex text-center items-center justify-center rounded-full bg-black text-white text-sm shadow-md ${isPlaying? "bg-white text-black": null}`} 
                    onClick={toggleMediaPlayback}> 
                    {!isPlaying? '\u25B6\uFE0E' : '\u23F8\uFE0E'}
                </button> : null
            }
            
                {(() => {
                    switch (slideType) {
                        case "1":
                            return <Navigation content={slides[currentIndex]} />;
                        case "2":
                            return <TextAndMediaSlide content={slides[currentIndex]} />;
                        case "3":
                            return <PdfSlide content={slides[currentIndex]} />;
                        case "4":
                            return <QuizSlide content={slides[currentIndex]} />;
                        default:
                            return <div>Unknown slide type</div>;
                    }
                })()}
            </div>
        );
    };
    
    // useEffect(()=>{renderSlide()},[currentIndex])

    return (
        <>
            <div className="relative min-h-screen flex flex col">
                {/* Sliding Menu */}
                <div
                    className={`overflow-y-scroll w-[300px] fixed top-0 left-0 h-full bg-gray-800 text-white transform transition-transform duration-300 ${
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <button
                        className="absolute top-4 left-4 text-white font-bold hover:bg-black px-2 border"
                        onClick={toggleMenu}
                    >
                        X
                    </button>
                    <div className="p-4">
                        <h2 className="text-lg font-bold mt-5 text-center font-roboto">Menu</h2>
                        {Object.entries(slideContent.languages).map(([key, language]) => (
                        <button
                            key={language}
                            className="m-2 hover:font-bold"
                            onClick={() => handleLanguage(key)}
                        >
                            {language}
                        </button>
                    ))}
                        <ul>
                            {slideContent.slides.map((slide) => 
                                <li>
                                    <button className="mt-2 text-left text-sm font-roboto hover:underline" 
                                        key={slide.id} 
                                        onClick={() => goToSlide(slide.id)}>{slide.id}. {slide[language].title}
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Main Content Wrapper */}
                <div
                    className={`flex-1 transition-all duration-300 ${
                        isMenuOpen ? "ml-[300px]" : "ml-0"
                    }`}
                >
                    {/* Top Buttons */}
                    <div className="w-full border p-2">
                        <button
                            className="border rounded p-3 m-1 hover:bg-slate-500 hover:font-bold font-roboto"
                            onClick={toggleMenu}
                        >
                            Menu
                        </button>
                    </div>

                    {/* Main Content */}
                    <div id="banner" className="w-full p-5 flex justify-center text-center font-roboto text-lg">
                        {slideContent.presentationTitle[language]}
                    </div>
                    <div className="min-w-full justify-center flex flex col" id="header-limit">
                    
                        
                        <div
                            className="p-7 flex justify-left w-screen shadow-md border"
                            id="header"
                        >
                            
                            <div className="w-3/4 md:m-auto font-roboto" id="title">
                                <h1 className="w-full text-left text-3xl font-bold tracking-wide">
                                    {slideContent.slides[currentIndex].id}.{" "}
                                    {slideContent.slides[currentIndex][language].title}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div
                        id="container"
                        className="relative z-0 flex items-center justify-center align-center pt-5"
                    >
                        <button
                            id="prev-slide"
                            className="md:hover:bg-white md:hover:text-black md:hover:border-2 md:hover:border:black md:hover:font-bold fixed z-10 md:top-[50%] md:left-[10%] top-[50%] left-[0%] w-7 h-7 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center shadow-md text-3xl md:opacity-100 opacity-50"
                            onClick={goToPreviousSlide}
                        >
                            {"<"}
                        </button>
                        <audio
                            ref={audioRef}
                            src={slideContent.slides[currentIndex][language].soundtrack}
                        />
                        <div
                            className="w-full md:w-min items-center flex flex-col pt-5 relative z-0"
                            id="slide"
                        >
                            {renderSlide()}
                        </div>
                        <button
                            className="md:hover:bg-white md:hover:text-black md:hover:border-2 md:hover:border:black md:hover:font-bold fixed z-10 md:top-[50%] md:right-[10%] top-[50%] right-[0%] w-7 h-7 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center shadow-md text-3xl md:opacity-100 opacity-50"
                            onClick={goToNextSlide}
                        >
                            {">"}
                        </button>
                    </div>
                    <div
                        id="footer"
                        className="w-full h-[600px] mt-20 bg-slate-500 border flex justify-center p-10 "
                    >
                        <img className="h-[200px] w-auto" src="footer-logo.png" alt="UTHealth Houston School of Public Health - Southwest Center for Occupational and Environmental Health"></img>
                    </div>
                </div>
            </div>
        </>
    );
}