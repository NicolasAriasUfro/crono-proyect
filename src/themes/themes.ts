
export const moraCremaTheme = {
    dark: false,
    colors: {
        background: "#F7F6FE",
        surface: "#15202b",
        primary: "#7262BC",
        primary_light_1: "#8b84d0",
        primary_light_2: "#B9BBE8",
        primary_light_3: "#d4d6f1",
        secondary: "#EF85E6",
        secondary_light_1: "#fad4f9",
        secondary_light_2: "#fdeafd",
        error: "#f44336",
        info: "#2196F3",
        success: "#F06090",
        success_light_1: "#f8a9c5",
        warning: "#fb8c00",
        front_light: "#b9bce8"
    },
    variables: {
        primary: "#7262BC",
        "black-text": "#0C0524",
    },
};

export const frutosRojosTheme = {
    dark: false,
    colors: {
        background: "#F3D2D2",
        surface: "#15202b",
        primary: "#af0505",
        primary_light_1: "#500000",
        primary_light_2: "#ff9595",
        primary_light_3: "#ffdddd",
        secondary: "#F28787",
        secondary_light_1: "#f7aaaa",
        secondary_light_2: "#f28787",
        error: "#f44336",
        info: "#2196F3",
        success: "#FB5050",
        success_light_1: "#ffc7c7",
        warning: "#fb8c00",
        front_light: "#ffc1c1"
    },
};

export const chirimoyaAlegreTheme = {
    dark: true,
    colors: {
        background: "#F7F5F3",
        surface: "#15202b",
        primary: "#F7CFAA",
        primary_light_1: "#E5811D",
        primary_light_2: "#E5811D",
        primary_light_3: "#faebcb",
        secondary: "#FF8F1F",
        secondary_light_1: "#6C4E41",
        secondary_light_2: "#e1cda7",
        error: "#f44336",
        info: "#2196F3",
        success: "#E5811D",
        success_light_1: "#6C4E41",
        warning: "#fb8c00",
        front_light: "#faebcb"
    },
};

export const mentaTheme = {
    dark: true,
    colors: {
        background: "#F2F0DB",
        surface: "#15202b",
        primary: "#89DFA0",
        primary_light_1: "#1c4b2b",
        primary_light_2: "#E5811D",
        primary_light_3: "#f4e9cd",
        secondary: "#FF8F1F",
        secondary_light_1: "#6C4E41",
        secondary_light_2: "#e1cda7",
        error: "#f44336",
        info: "#2196F3",
        success: "#1c4b2b",
        success_light_1: "#6C4E41",
        warning: "#fb8c00",
        front_light: "#c3efce"
    },
};

export const coffeeTheme = {
    dark: true,
    colors: {
        background: "#151000",
        surface: "#15202b",
        primary: "#D2BA99",
        primary_light_1: "#5c4032",
        primary_light_2: "#e1cda7",
        primary_light_3: "#331b15",
        secondary: "#6C4E41",
        secondary_light_1: "#6C4E41",
        secondary_light_2: "#e1cda7",
        error: "#f44336",
        info: "#2196F3",
        success: "#C39351",
        success_light_1: "#6C4E41",
        warning: "#fb8c00",
        front_light: "#5a3529"
    },
};

import moraCremaImg from '@/assets/mora-crema.jpg';
import frutosRojosImg from '@/assets/frutos-rojos.jpg';
import coffeeImg from '@/assets/coffee.jpg';
import mentaImg from '@/assets/menta.jpg';
import chirimoyaAlegreImg from '@/assets/chirimoya-alegre.jpg';

export const temasArray: {name: string; src: string;}[] = [
    {
        name: "moraCremaTheme",
        src: moraCremaImg,
    },
    {
        name: "frutosRojosTheme",
        src: frutosRojosImg,
    },
    {
        name: "coffeeTheme",
        src: coffeeImg,
    },
    {
        name: "mentaTheme",
        src: mentaImg,
    },
    {
        name: "chirimoyaAlegreTheme",
        src: chirimoyaAlegreImg,
    },
];