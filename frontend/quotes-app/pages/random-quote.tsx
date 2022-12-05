import { GetServerSideProps, NextPage } from 'next'
import { Quote } from '../types';
import { Paper, Typography } from '@mui/material';
import styles from '../styles/Home.module.css'
import { useState } from 'react';
import Link from 'next/link';

const RandomQuote: NextPage<{quote: Quote[]}> = ({quote}) => { 
    const [newQuote, setNewQuote] = useState<Quote[]>([{_id: "", quote_text: "", author_name: "", createdAt: new Date(), updatedAt: new Date(), __v: 0}])

    const getNewQuote = async () => {
        const request = await fetch('http://localhost:4000/api/quotes/random-quote')
        const res = await request.json()

        if(res){
        setNewQuote(res)
        }
    }

    const handleGetNewRandomQuote = () => {
        getNewQuote()
    }
    
    return (
        <div className={styles.container}>
            <div style={{ width: '100%', overflow: 'hidden', textAlign: 'center', position:'absolute', top:'50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
                <Typography>
                    Quote: {newQuote[0].quote_text || quote[0].quote_text}
                </Typography>
                <Typography>
                    Author: -{newQuote[0].author_name || quote[0].author_name}
                </Typography>
                <Link href={"/quotes"} passHref><button>Go to quotes</button></Link>
                <button onClick={handleGetNewRandomQuote}>Get New Quote</button>
            </div>
        </div>
    )
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const res = await fetch("http://localhost:4000/api/quotes/random-quote");
    const result: Quote[]  = await res.json()

    return {
      props: {
        quote: result
      }
    }
}

export default RandomQuote;