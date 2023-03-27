'use client';

import { v4 as uuidv4 } from 'uuid';
import style from './Table.module.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function NewTable() {
    function newTable() {
        window.location.pathname = `/t/${uuidv4()}`;
    }

    return (
        <button onClick={newTable} className={style.card}>
            <h2 className={inter.className}>New Table</h2>
        </button>
    )
}
