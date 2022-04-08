import { createGlobalStyle } from "styled-components";

//some colours - navy purple #645986
//grey with slight violet tinge #DAE0F2
//pewter blue - #85AAC1
//light brown - #A99985
//667761 deep sage
export default createGlobalStyle`
  :root {
    --color-main: #998FC7; 
    --color-main-transparent: RGBA(153, 143, 199, 0.5);
    /* --color-secondary: RGBA(122, 166, 242, 0.4);  */
    --color-secondary: RGBA(170, 170, 170);
    --color-secondary-transparent: RGBA(170, 170, 170, 0.4);
    /* --color-secondary: RGBA(137, 166, 251, 0.4);   */
    /* --color-secondary: RGB(242, 120, 75); */
    --color-background: #998FC7; 
    --color-text: #FFFFFF; 
    --font-heading: 'Advent Pro', Arial, Helvetica, sans-serif;
    --font-subheading: 'Ubuntu', Arial, Helvetica, sans-serif;
    --font-body: 'Abel', Arial, Helvetica, sans-serif;
  }

  /* http://meyerweb.com/eric/tools/css/reset/
      v2.0 | 20110126
      License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      font-size: 100%;
      vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
      display: block;
  }
  body {
      line-height: 1;
  }
  ol, ul {
      list-style: none;
  }
  blockquote, q {
      quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
      content: '';
      content: none;
  }

  a {
      text-decoration: none;
      cursor: pointer;
      color: white;
      font-family: var(--font-subheading);

      &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }

      &:hover {
          color: var(--color-secondary);
      }



  }

  button {
      border: none;
      color: white;
      background-color: var(--color-main);
      cursor: pointer;
      border-radius: 7px;
      transition: 0.1s ease-in-out;
      font-family: var(--font-heading);
    
      &:hover {
        transform: scale(1.05);
    }
  }

  div {
      border-radius: 15px;
  }
  
  h1, h2 {
    font-family: var(--font-heading);
    font-weight: bold;
    color: white;
    }

h3, h4, h5 {
    font-family: var(--font-subheading);
    font-weight: lighter;
    color: white;
}

p, span {
    font-family: var(--font-body);
    color: white;
}

h1 {
    font-size: 40px;
    letter-spacing: 4px;
    font-weight: bold;
}

h2 {
    font-size: 30px;
    font-family: var(--font-body);
}

h3 { 
    font-size: 24px;
}

h4 { 
    font-size: 20px;
}

p {
    font-size: 18px;
}

`;
