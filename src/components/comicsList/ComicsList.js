import './comicsList.scss';
import useMarvelService from '../../services/MarvelService'
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicEnded, setComicEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        //console.log('request');
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const onComicsLoaded = (newComics) => {
        //console.log(newComics);
        let ended = false;
        if (newComics.length < 8) {
            ended = true;
        }

        setComics([...comics, ...newComics]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicEnded(ended);
    }

    function renderItems(comics) {
        const elements = comics.map(comic => {
            return (
                <li className="comics__item" key={comic.id}>
                    <Link to={`/comics/${comic.id}`}>
                        <img src={comic.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{comic.title}</div>
                        <div className="comics__item-price">{comic.price}$</div>
                    </Link>
                </li>
            )
        });

        return elements;
    }

    const elements = renderItems(comics);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            <ul className="comics__grid">
                {errorMessage}
                {spinner}
                {elements}
            </ul>
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': comicEnded ? 'none' : 'block'}} 
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;