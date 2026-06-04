"use client";

import Marquee from 'react-fast-marquee';

export const InfiniteMarquee = () => {
  const words = [
    'Strategy',
    '✦',
    'Creative Building',
    '✦',
    'Analytics',
    '✦',
    'Automation',
    '✦',
    'Growth Systems',
    '✦',
    'Brand Experience',
    '✦',
    'Execution',
    '✦',
    'Product Thinking',
    '✦',
  ];

  return (
    <section className="relative bg-ink py-8 overflow-hidden">
      <Marquee speed={50} gradient={false}>
        <div className="flex items-center gap-8 px-4">
          {words.map((word, i) => (
            <span
              key={`marquee-${i}`}
              className={`font-fraunces text-3xl ${
                word === '✦'
                  ? 'text-accent'
                  : ['Strategy', 'Automation', 'Execution'].includes(word)
                  ? 'font-instrument italic text-paper'
                  : 'font-light text-paper'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  );
};