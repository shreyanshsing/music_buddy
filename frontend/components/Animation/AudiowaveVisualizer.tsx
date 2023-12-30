import { animated, useSprings } from "@react-spring/web";
import { useEffect, useState } from "react";

export default function AudiowaveVisualizer({children}: {children: React.ReactNode}) {

     // Define the number of waves and their properties
    const numberOfWaves = 10
    const [heights, setHeights] = useState(Array.from({ length: numberOfWaves }, (_, i) => 50 + Math.random() * i * 10))
    const [colors, setColors] = useState(Array.from({ length: numberOfWaves }, (_, i) => `hsl(${i * (360 / numberOfWaves)}, 100%, 50%)`))
    // Use useSprings to create animated values for each wave
    const springs = useSprings(
        numberOfWaves,
        heights.map((height) => ({
        from: { height: '0px' },
        to: { height: `${height}px` },
        config: { duration: 1000 },
        loop: { reverse: true },
    })));

    useEffect(() => {
        const timer = setInterval(() => {
            setHeights(Array.from({ length: numberOfWaves }, (_, i) => 50 + Math.floor(Math.random() * 41) * 10));
            setColors(Array.from({ length: numberOfWaves }, (_, i) => `hsl(${i * (360 / numberOfWaves)}, 100%, 50%)`));
        }, 1000)

        // Clean up the timer when the component is unmounted
        return () => clearInterval(timer)
    }, []);

    return (
        <animated.div 
            style={{
                position: 'relative',
                overflow: 'hidden',
                height: '100vh',
                width: '100vw'
          }}
        >
            <div style={{
                position: 'fixed', 
                width: '99vw',
                height: '99vh',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'flex-end', 
                    height: '100%',
                    zIndex: '-1',
                    transform: 'rotate(90deg)',
                    position: 'absolute',
                    top: 0,
                }}>
                    {springs.map((spring, index) => (
                        <animated.div
                            key={index}
                            style={{
                                width: '20px',
                                height: spring.height,
                                backgroundColor: colors[index],
                                margin: '0 20px',
                                borderRadius: '5px'
                            }}
                        />
                    ))}
                </div>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'flex-end',
                    zIndex: '-1',
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    top: 0,
                    transform: 'rotate(270deg)',
                }}>
                    {springs.map((spring, index) => (
                        <animated.div
                            key={index}
                            style={{
                                width: '20px',
                                height: spring.height, 
                                backgroundColor: colors[index],
                                margin: '0 20px',
                                borderRadius: '5px'
                            }}
                        />
                    ))}
                </div>
            </div>
            {children}
        </animated.div>
    )
}
