"use client";

import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  PointerEvent,
} from "react";
import { DragState } from "../types/layout.types";

export default function Drag({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef<DragState>({
    pointerId: null,
    offsetX: 0,
    offsetY: 0,
    frameWidth: 0,
    frameHeight: 0,
    containerLeft: 0,
    containerTop: 0,
    containerWidth: 0,
    containerHeight: 0,
  });

  useEffect(() => {
    const recenter = () => {
      const container = containerRef.current;
      const frame = frameRef.current;
      if (!container || !frame) return;

      const containerRect = container.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();

      setPosition({
        x: (containerRect.width - frameRect.width) / 2,
        y: 100,
      });
    };

    recenter();
    window.addEventListener("resize", recenter);
    return () => window.removeEventListener("resize", recenter);
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!frameRef.current || !containerRef.current) return;

      const frameRect = frameRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      dragStateRef.current = {
        pointerId: event.pointerId,
        offsetX: event.clientX - frameRect.left,
        offsetY: event.clientY - frameRect.top,
        frameWidth: frameRect.width,
        frameHeight: frameRect.height,
        containerLeft: containerRect.left,
        containerTop: containerRect.top,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
      };

      frameRef.current.setPointerCapture(event.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (dragState.pointerId !== event.pointerId) return;

      const relativeX =
        event.clientX - dragState.containerLeft - dragState.offsetX;
      const relativeY =
        event.clientY - dragState.containerTop - dragState.offsetY;

      const maxX = Math.max(dragState.containerWidth - dragState.frameWidth, 0);
      const maxY = Math.max(
        dragState.containerHeight - dragState.frameHeight,
        0
      );

      const clamp = (value: number, max: number) =>
        Math.min(Math.max(value, 0), max);
      const snap = 6;

      const clampedX = clamp(relativeX, maxX);
      const clampedY = clamp(relativeY, maxY);

      setPosition({
        x: clamp(Math.round(clampedX / snap) * snap, maxX),
        y: clamp(Math.round(clampedY / snap) * snap, maxY),
      });
    },
    []
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;
    dragStateRef.current.pointerId = null;
    frameRef.current?.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <div
      ref={frameRef}
      className="border active:cursor-grabbing cursor-grab border-black w-[90vw] sm:w-80 absolute bg-white z-10 text-black font-fash flex h-80 p-3 text-sm text-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative w-full h-full overflow-y-scroll whitespace-pre-line p-4">{`3:02 a.m. 

Your eyes sting. Code still warm from the last compile. Eighteen-hour loops, muscle memory and caffeine. You promise yourself one more commit before collapse. Then the phone lights up. Other side of the world, someone still lives in daylight. You know the voice. Ex-TradFi, ex-everything.

The ghost that once moved billions through the glass towers of Paris, New York, London. Whale of a trader. Pulling strings on a planet-sized marionette. Now they talk in chains and consensus. They escaped the vaults. They understand what decentralized actually feels like. No custodians, no masters. Just math humming in public.

You’re both half awake, half legend. And you’re deep into explaining your code. About those fashion economies built on ERC-1155 physical rights. You talk about fatigue. About whether supplier futures are even worth it.

You tell them the new idea: physical-rights futures. Not theory. You already built the first lines. Something different, something cooler.

What if, you say, in that strange in-between, purchase and fulfillment, the rights were live, granted, guaranteed… but the 1155s stayed dormant until delivery. What if those waiting tokens carried weight. Buyers trading anticipation for anticipation’s sake. Swapping, speculating, predicting the future stitched into cotton and code.

You describe garments as cross woven things: half cloth, half contract. Each piece threaded between order books and sewing tables. The 721 parent is what you wear, while the child supplies gain their own on-chain texture. Liquid, tradable, interoperable.

And then you hit pause. “If I include fulfillment futures, maybe we need something on the supply side too?”

There’s silence. Then laughter. A quiet… knowing.

He says it like, “Ha”. You hear it like him leaning back, the old trader waking up. You wait, thoughts hovering like static.

An exhale, slow, through the line.
“You know, they just deciphered some Babylonian tablets”, he begins. “Four thousand years old. Do you know what they found?”

More silence. More static.

“It’s simple, really. They used eclipses to predict the death of kings, the collapse of harvests, the fate of empires… Four thousand years ago, civilization hedged against the sky.”

And that’s all you need to hear.

If the Babylonian map of the world included futures, so must we. Suppliers, too, need a hedge. They mint futures on FGO — perpetual or deadline.

Only now it’s more open. Different. More diffuse. Spreading to every corner of the p2p map, between indie designers, suppliers, fulfillers, fashion collectors. A liquidity ground up, stitched for a kind of market predicted by no one ever before.
`}</div>
    </div>
  );
}
