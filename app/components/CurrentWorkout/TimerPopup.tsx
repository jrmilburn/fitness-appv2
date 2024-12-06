import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause, Close } from '@mui/icons-material';
import { submitSet } from './helper-functions';

function TimerPopup({ sets, onClose, visible, setWorkout }) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(1);
    const [isActivity, setIsActivity] = useState(true); // True for activity, false for rest

    // Derive arrays and cycle count from sets
    const activityTime = sets.map((set) => Number(set.activity) || 0);
    const restTime = sets.map((set) => Number(set.rest) || 0);

    console.log('activityTime:', activityTime);
    console.log('restTime:', restTime);


    const cycles = sets.length;

    const [timeLeft, setTimeLeft] = useState(activityTime[currentCycle - 1]);

    const beepSound = '/sounds/beep.mp3';

    const completeSet = async (index) => {
      const currentSet = sets[index];
      if (!currentSet) return; // Safety check

      await submitSet({
        setId: currentSet.id,
        weight: null, 
        reps: null, 
        activity: currentSet.activity, 
        rest: currentSet.rest, 
        completed: true,
        setWorkout
      });
    };

    // Whenever currentCycle or isActivity changes, reset the timeLeft
    useEffect(() => {
        if (!visible) return; // If the dialog is not visible, do nothing
        const newTime = isActivity
            ? activityTime[currentCycle - 1]
            : restTime[currentCycle - 1];
        setTimeLeft(newTime);
    }, [currentCycle, isActivity, activityTime, restTime, visible]);

    useEffect(() => {
      let timer;
      const beepAudio = new Audio(beepSound);
    
      if (isRunning && visible) {
        timer = setInterval(() => {
          const currentSetIndex = currentCycle - 1; // Define currentSetIndex here
    
          setTimeLeft((prev) => {
            const newTime = prev - 1;
    
            if (newTime <= 1) {
              clearInterval(timer);
              if (isActivity) {
                setIsActivity(false);
              } else {
                // Use currentSetIndex now that it's defined
                completeSet(currentSetIndex);
                setCurrentCycle((prevCycle) => {
                  const nextCycle = prevCycle + 1;
                  if (nextCycle > cycles) {
                    setIsRunning(false);
                    onClose();
                    return prevCycle;
                  }
                  return nextCycle;
                });
                setIsActivity(true);
              }
            } else if (newTime <= 4) {
              beepAudio.play();
            }
    
            return newTime;
          });
        }, 1000);
      }
    
      return () => clearInterval(timer);
    }, [isRunning, isActivity, currentCycle, cycles, onClose, visible, setWorkout]);
  

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleClose = () => {
        setIsRunning(false);
        setTimeout(() => onClose(), 300); // Wait for animation to finish
    };

    return (
        <Dialog
          open={visible}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth={true}
          PaperProps={{
            sx: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
            },
          }}
        >
            <DialogTitle>
                {isActivity ? 'Activity' : 'Rest'} - Cycle {currentCycle}/{cycles}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h1" component="p" align="center">
                {timeLeft}s
              </Typography>
            </DialogContent>

            <DialogActions>
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrow />}
                  size="large"
                >
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="contained"
                  color="secondary"
                  startIcon={<Pause />}
                  size="large"
                >
                  Pause
                </Button>
              )}
              <Button
                onClick={handleClose}
                variant="outlined"
                color="error"
                startIcon={<Close />}
                size="large"
              >
                Close
              </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TimerPopup;
