// This is NOT used for cheating, just to save time on long smartbook assignments.
// I, Hrishi Mehta, do not condone cheating at all but am also not responsible for yall...
const pastSavedAnswers = {};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startSolving = async () => {
  await sleep(2000);
  while (true) {
    try {
      await sleep(250); // Wait for the page to open properly
      const question = await parseQuestion();
      await answerQuestion(question);
    } catch (e) {
      console.error('Error:', e);
    }
  }
};

// Returns the state of the question (pending or answered)
const getQuestionState = () => {
  const element = document.querySelector('.probe-header');
  return element.innerText.includes('Your Answer') ? 'ANSWERED' : 'PENDING';
};

// Returns true if the answer is correct and false if incorrect
const isAnswerCorrect = () => {
  const header = document.querySelector('.probe-header').innerText;
  return !header.includes('Your Answer incorrect');
};

// Parses the question and returns an object
const parseQuestion = async () => {
  const type = document.querySelector('.probe-header').innerText;
  let prompt = Array.from(document.querySelectorAll('.prompt'))
    .map((el) => el.innerText.trim())
    .filter(Boolean)
    .join(' ');
  const clutter = prompt.substring(prompt.lastIndexOf(' \n') + 1, prompt.lastIndexOf('\n ') + 1);
  prompt = prompt.split(clutter).map((x) => x.trim()).join(' ');
  return { type, prompt };
};

const answerQuestion = async (question) => {
  const { type } = question;
  let state = getQuestionState();

  if (state === 'PENDING') {
    const solution = pastSavedAnswers[question.prompt];
    console.log(solution);

    if (type.includes('Multiple Choice') || type.includes('True or False')) {
      answerMCQ(solution);
    } else if (type.includes('Multiple Select')) {
      answerMSQ(solution);
    } else {
      if (solution) console.log(solution);
      await waitForAnswer(question);
    }

    state = 'ANSWERED';
    await sleep(250);
  }

  if (state === 'ANSWERED') {
    const high = await getSpecificButton('High');
    if (high) high.click();
    await sleep(250);
    await saveAnswer(question);
    await goToNextQuestion();
  }
};

const answerMCQ = (solution) => {
  const options = document.querySelectorAll('.choice-row');
  if (solution) {
    options.forEach((option) => {
      const value = option.innerText;
      if (solution.includes(value)) {
        option.querySelector('input').click();
        return;
      }
    });
  } else {
    const randomIndex = Math.floor(Math.random() * options.length);
    options[randomIndex].querySelector('input').click();
  }
};

const answerMSQ = (solution) => {
  const options = document.querySelectorAll('.choice-row');
  if (solution) {
    options.forEach((option) => {
      const value = option.innerText;
      if (solution.includes(value)) {
        option.querySelector('input').click();
      }
    });
  } else {
    options.forEach(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      options[randomIndex].querySelector('input').click();
    });
  }
};

const waitForAnswer = async () => {
  while (getQuestionState() === 'PENDING') {
    await sleep(600);
  }
};

// Actions
const goToNextQuestion = async () => {
  let nextQuestionButton = await getSpecificButton('Next Question');
  if (nextQuestionButton.disabled) {
    await visitTextBookAndReset();
    nextQuestionButton = await getSpecificButton('Next Question');
  }
  if (nextQuestionButton) nextQuestionButton.click();
};

const visitTextBookAndReset = async () => {
  const textbookButton = await getSpecificButton('Read About the Concept');
  textbookButton.click();
  await sleep(250);
  const returnButton = await getSpecificButton('To Questions');
  returnButton.click();
};

// Cloud data storage
const saveAnswer = async (question) => {
  const answers = [];
  if (question.type.includes('Fill in the Blank')) {
    document.querySelectorAll('.correct-answers').forEach((answer) => answers.push(answer.innerText));
  } else if (question.type.includes('Multiple') || question.type.includes('True or False')) {
    answers.push(...Array.from(document.querySelector('.answer-container').innerText.split('\n')).filter(Boolean));
  } else {
    const options = document.querySelector('.correct-list').children;
    for (let i = 0; i < options.length; i++) {
      const match = options[i];
      const def = match.children[0].innerText;
      const value = match.children[2].innerText.split('\n')[0];
      answers.push(`${def} --> ${value}`);
    }
  }
  pastSavedAnswers[question.prompt] = answers;
};

// Get specific / helper functions
const getSpecificButton = async (buttonText) => {
  const buttons = document.querySelectorAll('button');
  for (const button of buttons) {
    if (button.innerText.includes(buttonText)) {
      return button;
    }
  }
  return null;
};

// If accessing via blackboard
if (window.location.href.includes('https://lms.mheducation.com/mghmiddleware')) {
  sleep(3000).then(() => {
    const category = document.querySelector('#ezt_assignment_category_e');
    if (category && category.innerText === 'SmartBook 2.0') {
      getSpecificButton('Begin').then((button) => button.click());
    }
  });
}

// If reaches the start page
else if (window.location.href.includes('https://learning.mheducation.com')) {
  sleep(3000).then(() => {
    const welcomeHeading = document.querySelector('.welcome-learn__heading');
    if (welcomeHeading) {
      welcomeHeading.innerText = 'Welcome home Cheater!';
    }
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
      if (button.innerText === 'Continue Questions' || button.innerText === 'Start Questions') {
        button.click();
        startSolving();
      }
    }
    startSolving();
  });
}
