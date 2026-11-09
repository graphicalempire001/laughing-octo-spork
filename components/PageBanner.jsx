import Reveal from './Reveal';

export default function PageBanner({ eyebrow, title, em, text }) {
  return (
    <section className="page-banner">
      <div className="container">
        <Reveal className="eyebrow">{eyebrow}</Reveal>
        <Reveal as="h1" className="sec-title" delay={0.08}>{title} <em>{em}</em></Reveal>
        {text && <Reveal as="p" anim="fadeIn" className="sec-sub" delay={0.16}>{text}</Reveal>}
      </div>
    </section>
  );
}
