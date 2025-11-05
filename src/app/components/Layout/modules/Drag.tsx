"use client";

import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  PointerEvent,
  useContext,
} from "react";
import { DragState, Language } from "../types/layout.types";
import { INFO } from "@/app/lib/constants";
import { AppContext } from "@/app/lib/providers/Providers";
import Image from "next/image";

export default function Drag({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const context = useContext(AppContext);
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
      className="border active:cursor-grabbing cursor-grab border-black w-[90vw] sm:w-80 absolute bg-white z-10 text-black flex flex-col font-fash h-80 p-3 text-sm text-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="overflow-y-auto flex-1 whitespace-pre-line p-4 mb-2">
        {INFO[context?.selectedLanguage! as Language]}
        <div className="mt-6 flex flex-col gap-6 items-center justify-center">
          <div className="w-full flex justify-center text-center flex-col gap-2 items-center">
            <div className="relative w-full max-w-xs">
              <Image
                alt="Le trader rouennais"
                layout="responsive"
                width={436}
                height={711}
                src={"/images/trader.png"}
                draggable={false}
              />
            </div>
            <div className="text-lg">
              Le trader de Rouen
            </div>
          </div>
          <div
            className="cursor-pointer underline"
            onClick={() => window.open("https://digitalax.xyz")}
          >
            www.digitalax.xyz
          </div>
        </div>
      </div>
    </div>
  );
}
