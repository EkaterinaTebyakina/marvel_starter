import { useHttp } from "../hooks/http.hook";
import { useState } from "react";

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=391d85306d79b04a17651e5644965b76';
    const _baseOffset = 210;

    // getResource = async (url) => {
    //     let res = await fetch(url);

    //     if(!res.ok) {
    //         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    //     }

    //     return await res.json();
    // }

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        //const res = await request(`${_apiBase}comics?limit=9&{_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id = 331) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: editDiscription(char.description),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const editDiscription = (desc) => {
        if (desc) {
            return desc = desc.length > 150 ? desc.slice(0, 146) + '...' : desc;
        } else {
            return 'К сожалению, описание отсутствует :с';
        }        
    }

    const _transformComic = (comic) => {
        return {
            id: comic.id,
            title: comic.title,
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            price: comic.prices[0].price || 'not available',
            url: comic.urls[0].url,
            description: editDiscription(comic.description),
            pageCount: comic.pageCount,
            language: comic.textObjects.language || 'en-us'
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic}
}

export default useMarvelService;