import './charInfo.scss';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'

import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types'

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        const {charId} = props;

        if(!charId) {
            return;
        }

        clearError();

        getCharacter(charId)
            .then(onCharLoaded)
    }


    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {objectFit: 'cover'};
    if (char.thumbnail.indexOf('image_not_available.jpg') > -1) {
        imgStyle = {objectFit: 'contain'};
    }

    let comEls = [];
    let mesgCommicsNotFound = "Комиксов с данным персонажем нет";
    if (comics.length > 0) {
        for (let i = 0; i < 10; i++) {
            comEls.push(
                <li key={i} className="char__comics-item">
                    {comics[i].name}
                </li>
            );
        }
    }
   

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comEls.length > 0 ? comEls : mesgCommicsNotFound}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;

/*
{
                    comics.length === 0 ? 'Комиксов с данным персонажем нет' :
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
*/