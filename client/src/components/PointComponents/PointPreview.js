import styled from "styled-components";
import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import { GlobalContext } from "../GlobalContext";

//Preview component that displays Point details used on different pages
const PointPreview = ({_id, coverImgSrc, title, type, by, year, description, link, format, userPoints}) => {
    
    const { state: { currentUser, currentUserStatus} } = useContext(CurrentUserContext);
    const { changeCount, setChangeCount } = useContext(GlobalContext);

    const initialSaveStatus = (userPoints.some((point) => point === _id));
    const [ saved, setSaved ] = useState(initialSaveStatus);

    
    const toggleSave = () => {
        //save
        if (!saved) {
            fetch(`/users/bookmark-point`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser._id, pointId: _id })
            })
                .then(res => res.json())
                .then(data => {
                  if (data.success === true) {
                    setSaved(true);
                    setChangeCount(changeCount+1);
                  }
                })
                .catch((err) => {
                })
        }
        //unsave
        else {
            fetch(`/users/remove-bookmarked-point`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser._id, pointId: _id })
            })
                .then(res => res.json())
                .then(data => {
                  if (data.success === true) {
                    setSaved(false);
                    setChangeCount(changeCount+1);
                  }
                })
                .catch((err) => {
                    console.log("couldn't delete bookmark");
                })
        }
    
    }

    //two previews, one for short, one for details
    if (currentUserStatus === "loading") {
        return <Wrapper></Wrapper>
    }
   
    if (format === "full") {
        return (
            <Wrapper>
                <ShortDisplay>
                    {(coverImgSrc) ? (
                        <img src={coverImgSrc}/>
                    ) : (
                        <div></div>
                    )}
                    
                    <div>
                        <h3>{title}</h3>
                        <Type>{type}</Type>
                        <p><span>{(type === "film") ? "Director: " : "Author: "}</span>{by}</p>
                        <p><span>Year: </span>{year}</p>
                    </div>
                </ShortDisplay>
                <FullDisplay>
                    <p><span>Description: </span>{description}</p>
                    <LinkDiv>
                        <DetailsLink href={link} target="_blank">{(type === "film") ? "imdb" : "google books"}</DetailsLink>
                    </LinkDiv>
                </FullDisplay>

                <SaveButton onClick={toggleSave}>
                { (saved) ? (
                    <FaBookmark className="icon" />
                ) : (
                    <FaRegBookmark className="icon"/>
                )}
                </SaveButton>

            </Wrapper>
        )
    }

    return (
        <Wrapper>

            <NavLink to={`/points/${_id}`}>
            <ShortDisplay>
                {(coverImgSrc) ? (
                        <img src={coverImgSrc}/>
                    ) : (
                        <div></div>
                    )}
                <div>
                    <h3>{title}</h3>
                    <Type>{type}</Type>
                    <p><span>{(type === "film") ? "Director: " : "Author: "}</span>{by}</p>
                    <p><span>Year: </span>{year}</p>
                </div>
            </ShortDisplay>
            </NavLink>

            <SaveButton onClick={toggleSave}>
                { (saved) ? (
                    <FaBookmark className="icon" />
                ) : (
                    <FaRegBookmark className="icon"/>
                )}
            </SaveButton>

        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 75%;
    margin: 20px auto;
    background-color: var(--color-secondary-transparent);
    box-shadow: 3px 3px 5px 3px var(--color-secondary);
    color: white;
    padding: 15px;

    p {
        font-size: 16px;
    }
`;

const ShortDisplay = styled.div`
    display: flex;
 
    img { 
        width: 100px;
        height: 148px;
        margin-right: 10px;
    }

    span {
        font-weight: bold;
    }

    div {
        width: 100%;
        * {
            margin: 5px 0;
        }
 
    }
`;

const FullDisplay = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    text-align: justify;
`;

const Type = styled.p`
    font-style: italic;
    padding-bottom: 5px;
`;

const LinkDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    a {
        padding: 7px;
        margin-top: 10px;
    }
`;

const DetailsLink = styled.a`
    margin: 0 auto;
    margin-top: 15px;
    padding: 1px 10px;
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--color-main);
    border-radius: 20px;
    font-size: 11px;
`;

const SaveButton = styled.button`
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: transparent;

    .icon {
        color: white;
        font-size: 20px;
    }
`;

export default PointPreview;