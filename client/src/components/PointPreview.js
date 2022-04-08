import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

//different hearts when liked and not liked
const PointPreview = ({coverImgSrc, title, type, creator, year, country, format}) => {
    
    //depending on type, details button will say IMDB or googlebooks
    return (
        <Wrapper>
            <img />
            <div>
                <h2>Title</h2>
                <p>film</p>
                <p><span>Director:</span></p>
                <p><span>Year:</span></p>
                <p><span>Country:</span></p>
                {(format === "full" && 
                <LinkDiv>
                    <DetailsLink to="">see more details</DetailsLink>
                </LinkDiv>)}
                
                <LikeButton>
                    <FaRegHeart className="icon"/>
                </LikeButton>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    width: 75%;
    margin: 20px auto;
    /* border: 5px solid var(--color-secondary); */
    background-color: var(--color-secondary-transparent);
    box-shadow: 3px 3px 5px 3px var(--color-secondary);
    color: white;
    padding: 10px;

    img { 
    
    }

    span {
        font-weight: bold;
    }

    div {
        width: 100%;
        * {
            line-height: 26px;
            position: relative;
        }
    }

`;

const LinkDiv = styled.div`
    width: 100%;
    /* border: 1px solid red; */
    display: flex;
    justify-content: center;
`;
const DetailsLink = styled(NavLink)`
    margin: 0 auto;
    margin-top: 15px;
    padding: 1px 10px;
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--color-main);
    border-radius: 20px;
    font-size: 11px;
`;

const LikeButton = styled.button`
    position: absolute;
    top: -25px;
    left: 235px;
    background-color: transparent;

    .icon {
        color: white;
        font-size: 20px;
    }
`;

export default PointPreview;