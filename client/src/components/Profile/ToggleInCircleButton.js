import styled from "styled-components";
import { useState, useContext } from "react";
import { CurrentUserContext } from "./CurrentUserContext";

const ToggleInCircleButton = ({friendId, format}) => {

    const { state: { currentUser, currentUserStatus }} = useContext(CurrentUserContext);

    const [ inCircle, setInCircle ] = useState(currentUser.circle.some((friend) => friend === friendId));
    
    const toggleInCircle = () => {

        if (!inCircle) {
            fetch(`/users/add-user-to-circle`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({ userId: currentUser._id, friendId: friendId })
        })
            .then(res => res.json())
            .then(data => {
                console.log("added friend", data)
              if (data.success === true) {
                setInCircle(true);
              }
            })
            .catch((err) => {
                console.log("couldn't add friend");
            })
        }
        else {
            fetch(`/users/remove-user-from-circle`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser._id, friendId: friendId })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("removed friend", data)
                  if (data.success === true) {
                    setInCircle(false);
                  }
                })
                .catch((err) => {
                    console.log("couldn't remove friend");
                })
        }
        
    }

    return (
        <Wrapper>
            <button large={(format === "large") ? "large" : undefined} onClick={toggleInCircle} 
            className={(inCircle) ? "isFriend" : ""}>{(inCircle) ? "remove from circle" : "add to circle"}</button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin: 0 auto;
    button {
        font-size: ${props => (props.large) ? "20px" : "14px"};
        /* border: 2px solid var(--color-secondary); */
        background-color: white;
        color: var(--color-main);
        padding: 5px;
        border-radius: 15px;
        width: ${props => (props.large) ? "300px" : "110px"};
    }

    .isFriend {
        background-color: var(--color-secondary);
        color: white;
    }

`;
export default ToggleInCircleButton;