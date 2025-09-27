import { useLocation, useParams } from "react-router-dom";
import type { Room } from "../types/Room";

export function useRoomDetail() {
  const { state } = useLocation();
  const { roomId } = useParams();

  const room = state as Room | undefined;

  return { room, roomId };
}
