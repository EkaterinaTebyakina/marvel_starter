import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'

import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        //setCharList(charList => [...charList, ...newCharList]);
        setCharList([...charList, ...newCharList]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }


    const itemRefs = useRef([]);

    const onSetActive = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    
    function renderItems(arr) {

        const elements = arr.map((char, i) => {

            let imgStyle = {objectFit: 'cover'};
            if (char.thumbnail.indexOf('image_not_available.jpg') > -1) {
                imgStyle = {objectFit: 'contain'};
            }

            return (
                <li ref={elem => itemRefs.current[i] = elem}
                    className="char__item" 
                    key={char.id}
                    onClick={() => {
                        onSetActive(i);
                        props.onCharSelected(char.id);

                    }}>
                    <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        })

        return elements;
    }
        

    const elements = renderItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    //const content = !(loading || error) ? elements : null;
    
    return (
        <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {elements}
                {/* {content} */}
            </ul>
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;