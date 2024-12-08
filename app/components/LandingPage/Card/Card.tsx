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
        <motion.div className={styles.card} style={{scale, top: `calc(-10% + ${i * 50}px)`}}>
            <div className='bg-background-secondary rounded-xl w-full h-full border-border p-4'>
                <h2 className='inter-bold text-xl '>{card.title}</h2>
                <p className='inter text-md'>{card.description}</p>
                <div className={styles.imageContainer}>
                <motion.div style={{scale: imageScale}} className={styles.inner}>
                    <Image 
                        fill
                        src={card.image}
                        alt='image'/>
                </motion.div>
            </div>
            </div>
        </motion.div>
        </div>
    )
}