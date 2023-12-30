import { Box, IconButton, Slider, Tooltip, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { PLAYER_IMG_SRC } from "../data";
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { TinyText } from "../styled";
import { OnProgressProps } from "react-player/base";
import { FastForwardRounded, FastRewindRounded } from "@mui/icons-material";
import ChatSection from "./ChatSection";

interface IProps {
    link: string;
}

export default function CustomPlayer({link}: IProps) {

    const [start, setStart] = useState<boolean>(false)
    const playerRef = useRef<ReactPlayer>(null)
    const [totalDuration, setTotalDuration] = useState<number>(0)
    const [currentDuration, setCurrentDuration] = useState<number>(0)
    const [volume, setVolume] = useState<number>(1)
    const [error, setError] = useState<boolean>(false)

    function formatDuration(value: number) {
        const minute = Math.floor(value / 60);
        const secondLeft = Math.floor(value - minute * 60).toFixed(0);
        return `${minute}:${Number(secondLeft) < 10 ? `0${secondLeft}` : secondLeft}`;
    }

    const getPlayPauseIcon = () => {
        switch (start) {
            case true:
                return (
                    <Tooltip title={'Pause'}>
                        <PauseIcon sx={{color: 'white'}} />
                    </Tooltip>
                )
            case false:
                return (
                    <Tooltip title={'play'}>
                        <PlayArrowIcon sx={{color: 'white'}} />
                    </Tooltip>
                )
            default:
                return (
                    <div />
                )
        }
    }

    const handleOnReady = (player: ReactPlayer) => {
        setTotalDuration(player.getDuration())
    }

    const getVolumeButton = () => {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap:'1rem',
                width: '80%',
                margin: '0.1rem auto'
            }}>
                <IconButton onClick={() => setVolume(0)}>
                    <VolumeOffIcon sx={{color: 'white'}}/>
                </IconButton>
                <Slider 
                    min={0} 
                    onChange={(_, newValue) => {
                        setVolume(newValue as number);
                    }}
                    value={volume}
                    max={1}
                    step={0.01}
                    size={'small'}
                    sx={{color: 'white'}}
                />
                <IconButton onClick={() => setVolume(1)}>
                    <VolumeUpIcon sx={{color: 'white'}}/>
                </IconButton>
            </Box>
        )
    }

    const getDurationLabels = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap:'1rem',
                    width: '80%',
                    margin: '1rem auto'
                }}
            >
                <TinyText>{formatDuration(currentDuration)}</TinyText>
                    <Slider
                        aria-label="time-indicator"
                        value={currentDuration}
                        min={0}
                        step={1}
                        size={'small'}
                        max={totalDuration}
                        sx={{color: 'white'}}
                        onChange={(_, value) => {
                            if (playerRef?.current) {
                                playerRef?.current.seekTo(value as number)
                                setCurrentDuration(value as number)
                            }
                        }}
                    />
                <TinyText>-{formatDuration(totalDuration - currentDuration)}</TinyText>
            </Box>
        )
    }

    const getPlayPauseButtons = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: 'fit-content',
                    gap: '2rem',
                    margin: '0px auto'
                }}
            >
                <IconButton onClick={() => {
                    if (playerRef?.current) {
                        if ((currentDuration - 5) >= 0) {
                            playerRef?.current.seekTo((currentDuration - 5) as number)
                            setCurrentDuration((currentDuration - 5) as number)
                        } else {
                            playerRef?.current.seekTo(0)
                            setCurrentDuration(0)
                        }
                    }
                }} aria-label="previous song">
                    <FastRewindRounded sx={{color: 'white'}}/>
                </IconButton>
                <IconButton onClick={() => setStart(!start)}>
                    {getPlayPauseIcon()}
                </IconButton>
                <IconButton onClick={() => {
                    if (playerRef?.current) {
                        if ((currentDuration + 5) <= totalDuration) {
                            playerRef?.current.seekTo((currentDuration + 5) as number)
                            setCurrentDuration((currentDuration + 5) as number)
                        } else {
                            playerRef?.current.seekTo(totalDuration)
                            setCurrentDuration(totalDuration)
                        }
                    }
                }} aria-label="next song">
                    <FastForwardRounded sx={{color: 'white'}}/>
                </IconButton>
            </Box>
        )
    }

    const switchContent = () => {
        if (error) {
            return (
                <Box>
                    <Typography color={'red'} gutterBottom>Unable to play the video that you have provided please try again.</Typography>
                </Box>
            )
        } else {
            return (
                <ReactPlayer
                    url={link}
                    style={{
                        margin: 'auto',
                        width: '100%',
                        height: '100%',
                        position: 'static',
                        border: '5px solid white',
                        borderRadius: '5px'
                    }}
                    playing={start}
                    onPlay={() => setStart(true)}
                    onPause={() => setStart(false)}
                    onReady={handleOnReady}
                    ref={playerRef}
                    onError={() => setError(true)}
                    volume={volume}
                    onEnded={() => {
                        setStart(false)
                    }}
                    muted={volume === 0}
                    onProgress={(state: OnProgressProps) => setCurrentDuration(state.playedSeconds)}
                    playIcon={
                        <img src={`${PLAYER_IMG_SRC}`} alt={'player-img'} />
                    }
                    light={false}
                />
            )
        }
    }

    return (
        <Box sx={{
            margin: '0rem auto',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {switchContent()}
            <Box sx={{
                width: '80%',
                color: 'white',
                backgroundColor: '#6a4ea0',
                border: '5px solid white',
                borderTop: '0px',
                borderRadius: '0px 0px 5px 5px',
                margin: 'auto',
                marginTop: '-20px'
            }}>
                {getDurationLabels()}
                {getPlayPauseButtons()}
                {getVolumeButton()}
            </Box>
            <ChatSection />
        </Box>
    )
}