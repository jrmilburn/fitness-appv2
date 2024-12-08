import React, { useRef } from 'react'
import styles from './Card.module.css'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function Card({ card, i, range, targetScale, progress }) {

    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return(
        <div className={styles.cardContainer} ref={container}>
        <motion.div className={styles.card} style={{scale, top: `calc(-5% + ${i * 75}px)`}}>
            <div className='rounded-xl w-full h-full border-border p-8 flex flex-col gap-8' style={{backgroundColor: card.backgroundColor}}>
            <h2 className='inter-bold text-xl text-left w-full border-b border-highlight'>{card.title}</h2>

                <div className='flex h-full w-full gap-8'>
                <div className='flex flex-col gap-4 flex-1'>
                    <p className='inter text-md text-left'>{card.description}</p>
                    <button className='text-left'>See more</button>
                </div>
                <div className={styles.imageContainer}>
                <motion.div style={{scale: imageScale}} className={styles.inner}>
                    <Image 
                        fill
                        src={card.image}
                        alt='image'/>
                </motion.div>
            </div>
            </div>
            </div>
        </motion.div>
        </div>
    )
}