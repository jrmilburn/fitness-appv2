import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause, Close } from '@mui/icons-material';
import { submitSet } from './helper-functions';

function TimerPopup({ sets, onClose, visible, setWorkout }) {
    // Find the first incomplete set
    const firstIncompleteIndex = sets.findIndex((set) => !set.completed);
    const initialCycle = firstIncompleteIndex !== -1 ? firstIncompleteIndex + 1 : 1;

    const [isRunning, setIsRunning] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(initialCycle);
    const [isActivity, setIsActivity] = useState(true);
    const [activityTime, setActivityTime] = useState([]);
    const [restTime, setRestTime] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);

    // Derive arrays from sets
    useEffect(() => {
      const newActivityTime = sets.map((set) => Number(set.activity) || 0);
      const newRestTime = sets.map((set) => Number(set.rest) || 0);
      setActivityTime(newActivityTime);
      setRestTime(newRestTime);
    }, [sets]);

    // Update timeLeft whenever the currentCycle or times change
    useEffect(() => {
      if (activityTime.length > 0 && currentCycle - 1 < activityTime.length) {
        setTimeLeft(isActivity ? activityTime[currentCycle - 1] : restTime[currentCycle - 1]);
      }
    }, [activityTime, restTime, currentCycle, isActivity]);

    const cycles = sets.length;
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

    useEffect(() => {
      let timer;
      const beepAudio = new Audio(beepSound);
    
      if (isRunning && visible) {
        timer = setInterval(() => {
          const currentSetIndex = currentCycle - 1;
    
          setTimeLeft((prev) => {
            const newTime = prev - 1;
    
            if (newTime < 1) {
              clearInterval(timer);
              if (isActivity) {
                // Switch to rest
                setIsActivity(false);
                return restTime[currentSetIndex];
              } else {
                // Complete set and move to next cycle
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
            } else if (newTime < 4) {
              beepAudio.play();
            }
    
            return newTime;
          });
        }, 1000);
      }
    
      return () => clearInterval(timer);
    }, [isRunning, isActivity, currentCycle, cycles, onClose, visible, setWorkout, restTime, activityTime]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleClose = () => {
      setIsRunning(false);
      setTimeout(() => onClose(), 300);
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
