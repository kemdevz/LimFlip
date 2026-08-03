const express = require('express');

const router = express.Router();

let trackTimerState = {
  status: 'idle',
  startTime: null,
  endTime: null,
  reactionTime: null,
  randomDelay: null
};

let io = null;

const setIo = (socketIo) => {
  io = socketIo;
};

router.post('/start', (req, res) => {
  try {
    if (trackTimerState.status !== 'idle') {
      return res.status(400).json({ error: 'Timer already in use' });
    }

    trackTimerState.randomDelay = Math.floor(Math.random() * 3000) + 2000;
    trackTimerState.status = 'ready';
    trackTimerState.startTime = null;
    trackTimerState.endTime = null;
    trackTimerState.reactionTime = null;

    if (io) {
      io.emit('track-timer', { phase: 'on-your-marks' });

      setTimeout(() => {
        if (trackTimerState.status === 'ready') {
          trackTimerState.status = 'set';
          io.emit('track-timer', { phase: 'set' });
        }
      }, 1000);

      setTimeout(() => {
        if (trackTimerState.status === 'set') {
          trackTimerState.status = 'go';
          trackTimerState.startTime = Date.now();
          io.emit('track-timer', { phase: 'go', startTime: trackTimerState.startTime });
        }
      }, 1000 + trackTimerState.randomDelay);
    }

    res.json({ message: 'Timer started', randomDelay: trackTimerState.randomDelay });
  } catch (error) {
    console.error('Start timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/finish', (req, res) => {
  try {
    if (trackTimerState.status !== 'go' && trackTimerState.status !== 'running') {
      return res.status(400).json({ error: 'Timer not in go state' });
    }

    trackTimerState.endTime = Date.now();
    trackTimerState.reactionTime = trackTimerState.endTime - trackTimerState.startTime;
    trackTimerState.status = 'finished';

    if (io) {
      io.emit('track-timer', { 
        phase: 'finished', 
        reactionTime: trackTimerState.reactionTime 
      });
    }

    res.json({ reactionTime: trackTimerState.reactionTime });
  } catch (error) {
    console.error('Finish timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset', (req, res) => {
  try {
    trackTimerState = {
      status: 'idle',
      startTime: null,
      endTime: null,
      reactionTime: null,
      randomDelay: null
    };

    if (io) {
      io.emit('track-timer', { phase: 'reset' });
    }

    res.json({ message: 'Timer reset' });
  } catch (error) {
    console.error('Reset timer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status', (req, res) => {
  res.json(trackTimerState);
});

module.exports = { router, setIo };
