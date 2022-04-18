import styled from "styled-components";
import { useState, useContext, useReducer } from "react";
import { NavLink } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

// const initialState = {
//     isSaved: isLiked,
//     error: null, 
//   }

//   const reducer = (state, action) => {
//     switch (action.type) {
//       case ("saved"): 
//       return {
//         ...state, 
//         isSaved: true, 
//         error: null,
//       }
//       case ("unsaved"): 
//       return {
//         ...state, 
//         isSaved: false, 
//         error: null,
//       }
//       case ("failed"): 
//       return {
//         ...state,
//         error: action.error,
//       }
//     }
//   }

const PointPreview = ({_id, coverImgSrc, title, type, by, year, description, link, format}) => {
    
    // const [ savedState, dispatch ] = useReducer(reducer, initialState);
    const { state: { currentUser, currentUserStatus }} = useContext(CurrentUserContext);

    const [ saved, setSaved ] = useState(false);

    if (currentUserStatus === "idle") {
        if (currentUser.points.some((point) => point === _id)) {
            setSaved(true);
        }
    }

    
    const toggleSave = () => {

        // console.log ("currentuser", currentUser);
        // if (currentUserStatus === "idle") {

        // const isSaved = currentUser.points.some((point) => point === _id);
        
        // console.log(isSaved, "isSaved");
        
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
                    console.log("saved", data)
                  if (data.success === true) {
                    setSaved(true);
                  }
                })
                .catch((err) => {
                    console.log("couldn't save bookmark");
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
                    console.log("unsaved", data)
                  if (data.success === true) {
                    setSaved(false);
                  }
                })
                .catch((err) => {
                    console.log("couldn't delete bookmark");
                })
        }
    
    }

    //two previews, one for short, one for details
    //depending on type, details button will say IMDB or googlebooks
    return (
        <Wrapper>
            <ShortDisplay>
                <img src={coverImgSrc}/>
                <div>
                    <h3>{title}</h3>
                    <Type>{type}</Type>
                    <p><span>Director: </span>{by}</p>
                    <p><span>Year: </span>{year}</p>
                </div>
            </ShortDisplay>

            {(format === "full" && 
            <FullDisplay>
                <p><span>Description: </span>{description}</p>
                <LinkDiv>
                    <DetailsLink href={link} target="_blank">{(type === "film") ? "imdb" : "google books"}</DetailsLink>
                </LinkDiv>
            </FullDisplay>
            )}
            
            {(currentUserStatus === "idle" && 
            <SaveButton onClick={toggleSave}>
                { (saved) ? (
                    <FaBookmark className="icon" />
                ) : (
                    <FaRegBookmark className="icon"/>
                )}
            </SaveButton>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    width: 75%;
    margin: 20px auto;
    /* border: 5px solid var(--color-secondary); */
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
            /* line-height: 26px; */
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