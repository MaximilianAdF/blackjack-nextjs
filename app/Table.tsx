  "use client";

  import usewindowDimensions from '@/app/window';
  import Image from "next/image";
  import { FC } from "react";

  /** TODO: Add grainy look to the suit symbols */
  /** TODO: Make the pattern responsive  in size to screen dimensions & make pattern-container into grid for fixed amount of pattern */
  /** Making this responsive in  */
  const Table: FC = () => {
    const suitPaths = [
      require("../assets/suits/DiamondPattern.png"),
      require("../assets/suits/ClubPattern.png"),
      require("../assets/suits/SpadePattern.png"),
      require("../assets/suits/HeartPattern.png"),
    ];

    // Get the height and width of the window
    const { height, width } = usewindowDimensions();

    const pattern = [];
    //Horizontal & vertical background pattern
    for (let j = 0; j < height/100; j++) {
      for (let i = 0; i < width/100; i++) {
        pattern.push(
          <div key={"pattern row:"+j+" col:"+i} className="flex justify-center items-center" style={{ position: "relative", top: `${j * 100 + 70}px`, left: `${-100*(Math.floor((width/100)/2)-i)}px` }}>
            <div className="absolute m-auto mix-blend-screen opacity-15">
              <div className="dot"></div>
              <div className="line1"></div>
              <div key={`pattern-col`} className="grid grid-cols-2 gap-6">
                {suitPaths.map((path, index) =>
                  index % 2 === 0 ? (
                    <div key={index} className="">
                      <Image key={index} src={path.default} alt="suit" width={30} height={30} />
                    </div>
                  ) : null
                )}
              </div>
            </div>
            <div className="absolute m-auto mix-blend-screen opacity-15">
              <div className="line2"></div>
              <div key={`pattern-row`} className="grid gap-6">
                {suitPaths.map((path, index) => (
                  index % 2 !== 0 ? (
                    <div key={index} className="">
                      <Image key={index} src={path.default} alt="suit" width={30} height={30} />
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          </div>
        )
      }
    }

    //* TODO: Add grainy look to the background */
    //* TODO: Add spot for insurance on tbale
    //* TODO: Add text on table */
    return (
      <div className="h-screen" style={{ backgroundColor: 'rgb(0, 80, 50)' }}>
        <div className="pattern-container" style={{ zIndex: "-1"}}>
          {pattern}
        </div>
        <div className="dealer-half-circle">
          <svg className="dealer-text-shape" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" id="circlePath" d="M 50, 27 a 80, 60 0 0,0 100,0" />
            <text className='dealer-text'>
              <textPath href="#circlePath" startOffset="50%" text-anchor="middle">
                BLACKJACK PAYS 3 TO 2
              </textPath>
            </text>
          </svg>
        </div>
        <div className="half-ellipse-border-out"></div>
        <div className="half-ellipse-border-in"></div>
        <div className="hollow-half-ellipse"></div>
        <div className="player-squares">
          <div className="player-square"></div>
          <div className="player-square"></div>
          <div className="player-square"></div>
          <div className="player-square"></div>
          <div className="player-square"></div>
        </div>
      </div>
    );
  }

  export default Table;