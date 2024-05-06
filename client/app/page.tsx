import Table from "@/app/Table";
import {io} from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Page() {
  return <Table />;
}