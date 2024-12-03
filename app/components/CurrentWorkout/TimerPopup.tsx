import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { PlayArrow, Pause, Close } from '@mui/icons-material';


function TimerPopup({ activityTime, restTime, cycles, onClose, visible }) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentCycle, setCurrentCycle] = useState(1);
    const [isActivity, setIsActivity] = useState(true); // True for activity, false for rest
    const [timeLeft, setTimeLeft] = useState(activityTime);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // End of activity or rest
                        clearInterval(timer);
                        if (isActivity) {
                            // Switch to rest
                            setIsActivity(false);
                            setTimeLeft(restTime);
                        } else {
                            // Switch to activity or complete cycle
                            setCurrentCycle((prevCycle) => {
                                if (prevCycle >= cycles) {
                                    // All cycles completed
                                    setIsRunning(false);
                                    onClose();
                                    return prevCycle;
                                }
                                return prevCycle + 1;
                            });
                            setIsActivity(true);
                            setTimeLeft(activityTime);
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, isActivity, timeLeft, restTime, activityTime, cycles, onClose]);

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
                <Typography variant="h3" component="p" align="center">
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
                    >
                        Start
                    </Button>
                ) : (
                    <Button
                        onClick={handlePause}
                        variant="contained"
                        color="secondary"
                        startIcon={<Pause />}
                    >
                        Pause
                    </Button>
                )}
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="error"
                    startIcon={<Close />}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TimerPopup;
