import { Libre_Baskerville as FontSans } from "next/font/google";
import { Inter } from "next/font/google"

export const fontSans = FontSans({ 
    weight: ['400','700'],
    style: ['normal', 'italic'],
    subsets: ['latin'], 
    variable: "--font-sans"
});