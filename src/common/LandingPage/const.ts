import React from 'react';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '400px',
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(to right, #001e60, #3498db)'
};

const CAROUSEL_IMGs = [
  '../../src/assets/suss_happylearning-1.jpg',
  '../../src/assets/suss_outdoorwithstudents.jpeg',
  '../../src/assets/suss-happylearning-2.jpg'
];

const INTRO_PARTs = [
  {
    title: 'Earning Points',
    intro:
      'You will earn points as you progress through AdLeS. The points earned will form part of your OCAS, and will be made known to you via Canvas.'
  },
  {
    title: 'Adaptivity',
    intro:
      'It is important for you to put in your best effort as AdLeS will dynamically adjust the level of learning materials and MCQ presented based on how you interact with it, with the aim of determining the most efficient learning pathway for you in your subsequent logins.'
  },
  {
    title: 'Termination',
    intro:
      'In the unlikely event that you get too many MCQ wrong, AdLeS will recommend that you contact your instructor. You will be unable to proceed further or earn more points.'
  },
  {
    title: 'Accessing Learning Materials',
    intro:
      'A set of basic learning materials remains accessible to you at all times. You can access it by clicking "Learning Materials" at the top right hand menu of the screen.'
  },
  {
    title: 'Tracking Your Progress',
    intro:
      'At any time, you can log off (by clicking the button at the top right menu of the screen) and log in later as AdLeS records your interactions with it (e.g., last MCQ attempted).'
  },
  {
    title: 'Questionnaire Upon Completion',
    intro:
      'Upon completing AdLeS, you will be invited to fill in a short questionnaire on AdLeS.'
  }
];

export { contentStyle, CAROUSEL_IMGs, INTRO_PARTs };
