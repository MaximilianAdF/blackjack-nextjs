  "use client";

  import usewindowDimensions from '@/app/window';
  import Image from "next/image";
  import { FC } from "react";

  /** TODO: Add grainy look to the suit symbols */
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
    for (let j = 0; j < height/70; j++) {
      for (let i = 0; i < width/70; i++) {
        pattern.push(
          <div key={"pattern row:"+j+" col:"+i} className="flex justify-center items-center" style={{ position: "relative", top: `${j * 100 + 70}px`, left: `${-100*(Math.floor((width/70)/2)-i)}px` }}>
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
    return (
      <div className="h-screen" style={{ backgroundColor: 'rgb(0, 80, 50)' }}>
        <div className="pattern-container" style={{ zIndex: "-1" }}>
          {pattern}
        </div>
        <div className="dealer-half-circle"></div>
        <div className="half-ellipse-border-out"></div>
        <div className="half-ellipse-border-in"></div>
        <div className="hollow-half-ellipse"></div> 
      </div>
    );
  }

  export default Table;