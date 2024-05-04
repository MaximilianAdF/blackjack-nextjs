import Image from "next/image";


/** TODO: Add grainy look to the suit symbols */
export default function Home() {
  const suitPaths = [
    require("../assets/suits/DiamondPattern.png"),
    require("../assets/suits/ClubPattern.png"),
    require("../assets/suits/SpadePattern.png"),
    require("../assets/suits/HeartPattern.png"),
  ];

  const pattern_row = [];
  const pattern_col = [];
  for (let i = 0; i < 1; i++) {
    pattern_row.push(
      <div key={`pattern`+i} className="grid grid-cols-2 gap-6">
        {suitPaths.map((path, index) =>
          index % 2 === 0 ? (
            <div key={index} className="mix-blend-soft-light">
              <Image key={index} src={path.default} alt="suit" width={30} height={30} />
            </div>
          ) : null
        )}
      </div>
    )
    pattern_col.push(
      <div key={`pattern`+i} className="grid gap-6">
        {suitPaths.map((path, index) => (
          index % 2 !== 0 ? (
            <div key={index} className="">
              <Image key={index} src={path.default} alt="suit" width={30} height={30} />
            </div>
          ) : null
        ))}
      </div>
    
    )
  }

  //* TODO: Add grainy look to the background */
  return (
    <div className="h-screen flex justify-center items-center" style={{ backgroundColor: 'rgb(0, 80, 50)'}}>
      <div className="absolute m-auto">
        {pattern_row}
      </div>
      <div className="absolute m-auto">
        {pattern_col}
      </div>
    </div>
  );
}
