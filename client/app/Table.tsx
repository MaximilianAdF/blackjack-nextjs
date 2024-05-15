  "use client";

  import usewindowDimensions from '@/app/utils/window';
  import { FC, useEffect } from "react";
  import Image from "next/image";
  import {io} from "socket.io-client";
  const socket = io("http://localhost:3001");
  
  

  /** TODO: Add grainy look to the suit symbols */
  /** Making this responsive is gonna be fun  */
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
    //* TODO: Fix text positioning on table */
    return (
      <div className="h-screen" style={{ backgroundColor: 'rgb(0, 80, 50)' }}>
        <div className="pattern-container" style={{ zIndex: "-1" }}>
          {pattern}
        </div>
        <div className="dealer-half-circle">
          <div className="dealer-text-container">
            <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" id="circlePath1" d="M 50, 27 a 80, 60 0 0,0 100,0" />
              <text className='dealer-text'>
                <textPath href="#circlePath1" startOffset="50%" textAnchor="middle">
                  BLACKJACK PAYS 3 TO 2
                </textPath>
              </text>
            </svg>
          </div>
        </div>
        <div className="half-ellipse-border-out"></div>
        <div className="half-ellipse-border-in"></div>
        <div className="hollow-half-ellipse">
          <div className="insurance-text-container">
              <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" id="circlePath3" d="M 50, 27 a 80, 45 0 0,0 100,0" />
                  <text className='insurance-text'>
                      <textPath href="#circlePath3" startOffset="50%" textAnchor="middle">
                          INSURANCE PAYS 2 TO 1
                      </textPath>
                  </text>
              </svg>
          </div>
        </div>
        <div className="player-squares">
          <div className="player-square">
          </div>
          <div className="player-square">
          </div>
          <div className="player-square">
          </div>
          <div className="player-square">
          </div>
          <div className="player-square">
          </div>
        </div>
        <div className="dealer-info-container">
          <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" id="circlePath2" d="M 50, 27 a 80, 80 0 0,0 100,0" />
            <text className='dealer-info'>
              <textPath href="#circlePath2" startOffset="50%" textAnchor="middle">
                Dealer must stand on 17 and must draw to 16
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    );
  }

  export default Table;