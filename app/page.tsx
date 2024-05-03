import Image from "next/image";
import card from '../assets/cards/2C.svg';
import chip from '../assets/chips/1000C.svg'


export default function Home() {
  return (
    <><div className="flex items-center justify-center">
      <Image
        src={card}
        alt="2 of Clubs"
        width={100}
        height={100} />
    </div><div className="flex items-center justify-center">
        <Image
          src={chip}
          alt="1000 Chip"
          width={100}
          height={100} />
      </div></>
  );
}
