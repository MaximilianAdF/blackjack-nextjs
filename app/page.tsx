import Image from "next/image";
import card from '../cards/2C.svg'


export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <Image 
      src={card} 
      alt="2 of Clubs"
      width={100}
      height={100}
      />
    </div>
  );
}
