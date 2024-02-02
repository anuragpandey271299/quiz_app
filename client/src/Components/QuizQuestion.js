import React, { useState } from 'react';
import styles from './QuizQuestion.module.css';
import deleteIMG from '../Components/images/deleteIMG.png';
import axios from 'axios'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function QuizQuestion({ onCancel, quizType, quizName }) {
    const [questions, setQuestions] = useState([
        { questionText: '', options: [], correctOption: null, type: 'text', timer: 'off' },
    ]);
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [options, setOptions] = useState([
        { textValue: '', imageValue: '', type: 'text' },
        { textValue: '', imageValue: '', type: 'text' },
    ]);
    const [quizLink, setQuizLink] = useState(null);

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, { textValue: '', imageValue: '', type: 'text' }]);
        } else {
            alert('Only 4 options are allowed');
        }
    };

    const addQuestion = () => {
        if (questions.length < 5) {
            setQuestions((prevQuestions) => [
                ...prevQuestions,
                { questionText: '', options: [], correctOption: null, type: 'text', timer: 'off' },
            ]);
            setSelectedQuestion(questions.length);
            setOptions([{ textValue: '', imageValue: '', type: 'text' }, { textValue: '', imageValue: '', type: 'text' }]);
        } else {
            alert('Only 5 questions are allowed');
        }
    };

    const removeOption = (index) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);

        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion].options = updatedOptions.map(opt => ({ value: opt.textValue, imageValue: opt.imageValue, type: opt.type }));
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);

        const newSelectedQuestion = Math.max(selectedQuestion - 1, 0);
        setSelectedQuestion(newSelectedQuestion);

        setQuestions(updatedQuestions);
        setOptions(questions[newSelectedQuestion]?.options.map(opt => ({ textValue: opt.value || '', imageValue: opt.imageValue || '', type: opt.type || 'text' })) || []);
    };

    const handleSelectedQuestion = (index) => {
        setSelectedQuestion(index);

        if (questions[index]?.options && questions[index]?.options.length > 0) {
            const selectedQuestionOptions = questions[index].options || [];
            setOptions(selectedQuestionOptions.map(opt => ({ textValue: opt.value || '', imageValue: opt.imageValue || '', type: opt.type || 'text' })));
        } else {
            setOptions([
                { textValue: '', imageValue: '', type: 'text' },
                { textValue: '', imageValue: '', type: 'text' },
            ]);
        }
    };

    const handleQuestionInputChange = (value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion].questionText = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionInputChange = (index, value, inputType) => {
        const updatedOptions = [...options];
        updatedOptions[index] = { ...updatedOptions[index], [inputType]: value };
        setOptions(updatedOptions);

        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion].options = updatedOptions.map(opt => ({ value: opt.textValue, imageValue: opt.imageValue, type: opt.type }));
        setQuestions(updatedQuestions);
    };

    const handleCorrectOptionChange = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion].correctOption = index;
        setQuestions(updatedQuestions);
    };

    const handleQuestionTypeChange = (type) => {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion].type = type;
        setQuestions(updatedQuestions);
    };

    const handleTimerChange = (timer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestion].timer = timer;
        setQuestions(updatedQuestions);
    };
    const handleShare=()=>{
        if(quizLink){
            navigator.clipboard.writeText(quizLink);
            toast.success('Link copied to clipboard!');
        }
    }

    const handleCreateQuiz = async () => {
        const currentQuestion = questions[selectedQuestion];

        if (!currentQuestion.questionText.trim()) {
            alert('Enter a question');
            return;
        }

        const filledOptionsCount = options.filter(opt => opt.textValue.trim() !== '' || opt.imageValue.trim() !== '').length;
        if (filledOptionsCount < 2) {
            alert('At least two options should be filled');
            return;
        }
        
        if (quizType === 'Q&A' && currentQuestion.correctOption === null) {
            alert('Select a correct option');
            return;
        }
        
        try {
            const quizId = nanoid()
            const quizLink = `http://localhost:3000/play-quiz/${quizId}`
            setQuizLink(quizLink)
            const jwtoken = localStorage.getItem('jwtoken')
            const config = {
                headers: {
                    'Authorization': jwtoken,
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('https://quizzieapp-h7ds.onrender.com/addquiz', { quizName, quizType, questions, quizId }, config)
            console.log(response.data)

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            {!quizLink && (
                <div className={styles.quizquestion}>
                    <div className={styles.btns}>
                        {questions.map((_, index) => (
                            <div
                                key={index}
                                className={`${styles.newquestion} ${selectedQuestion === index ? styles.selected : ''}`}
                            >
                                <button onClick={() => handleSelectedQuestion(index)}>{index + 1}</button>
                                {index !== 0 && <p onClick={() => removeQuestion(index)}>x</p>}
                            </div>
                        ))}
                        <button onClick={addQuestion}>+</button>
                    </div>
                    <input
                        id={styles.questionInput}
                        placeholder='Question'
                        value={questions[selectedQuestion]?.questionText}
                        onChange={(e) => handleQuestionInputChange(e.target.value)}
                    />
                    <div className={styles.optiontype}>
                        <label>Question Type</label>
                        <label>
                            <input
                                type='radio'
                                name='questionType'
                                checked={questions[selectedQuestion]?.type === 'text'}
                                onChange={() => handleQuestionTypeChange('text')}
                            />
                            Text
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='questionType'
                                checked={questions[selectedQuestion]?.type === 'image'}
                                onChange={() => handleQuestionTypeChange('image')}
                            />
                            Image
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='questionType'
                                checked={questions[selectedQuestion]?.type === 'textImage'}
                                onChange={() => handleQuestionTypeChange('textImage')}
                            />
                            Text & Image
                        </label>
                    </div>
                    <div className={styles.options}>
                        {options.map((opt, index) => (
                            <div className={styles.optioninputs} key={index}>
                                {quizType === 'Q&A' && (
                                    <input
                                        type='radio'
                                        name='options'
                                        checked={questions[selectedQuestion]?.correctOption === index}
                                        onChange={() => handleCorrectOptionChange(index)}
                                    />
                                )}
                                {questions[selectedQuestion]?.type === 'text' && (
                                    <input id={styles.optionInput}
                                        type='text'
                                        placeholder='Text'
                                        value={opt.textValue}
                                        onChange={(e) => handleOptionInputChange(index, e.target.value, 'textValue')}
                                    />
                                )}
                                {questions[selectedQuestion]?.type === 'image' && (
                                    <input
                                        type='text'
                                        placeholder='Image URL'
                                        value={opt.imageValue}
                                        onChange={(e) => handleOptionInputChange(index, e.target.value, 'imageValue')}
                                    />
                                )}
                                {questions[selectedQuestion]?.type === 'textImage' && (
                                    <>
                                        <input
                                            type='text'
                                            placeholder='Text'
                                            value={opt.textValue}
                                            onChange={(e) => handleOptionInputChange(index, e.target.value, 'textValue')}
                                        />
                                        <input
                                            type='text'
                                            placeholder='Image URL'
                                            value={opt.imageValue}
                                            onChange={(e) => handleOptionInputChange(index, e.target.value, 'imageValue')}
                                        />
                                    </>
                                )}
                                {index > 1 && <img src={deleteIMG} onClick={() => removeOption(index)} alt='deleteIMG' />}
                            </div>
                        ))}
                        <button id={styles.optionaddbtn} onClick={addOption}>Add option</button>
                    </div>
                    {quizType === 'Q&A' && (
                        <div className={styles.timer}>
                            <h4>Timer</h4>
                            <label>
                                <input
                                    type='radio'
                                    name={`timerType${selectedQuestion}`}
                                    checked={questions[selectedQuestion]?.timer === 'off'}
                                    onChange={() => handleTimerChange('off')}
                                />
                                OFF
                            </label>
                            <label>
                                <input
                                    type='radio'
                                    name={`timerType${selectedQuestion}`}
                                    checked={questions[selectedQuestion]?.timer === '5s'}
                                    onChange={() => handleTimerChange('5s')}
                                />
                                5s
                            </label>
                            <label>
                                <input
                                    type='radio'
                                    name={`timerType${selectedQuestion}`}
                                    checked={questions[selectedQuestion]?.timer === '10s'}
                                    onChange={() => handleTimerChange('10s')}
                                />
                                10s
                            </label>
                        </div>
                    )}

                    <div className={styles.bottomBtns}>
                        <button onClick={() => onCancel()} className={styles.cancel}>Cancel</button>
                        <button onClick={handleCreateQuiz} className={styles.continue}>Create Quiz</button>
                    </div>
                </div>
            )}

            {quizLink && (
                <div className={styles.quizLink}>
                    <p>Congrats your Quiz is Published!</p>
                    <a href={quizLink} target="_blank" rel="noopener noreferrer">
                        {quizLink}
                    </a><br/>
                    <button onClick={handleShare} className={styles.close}>
                        Share
                    </button>
                </div>
            )}
        </>
    );
}

export default QuizQuestion;
