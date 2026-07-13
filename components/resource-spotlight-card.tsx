import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, MessageCircle, Tags } from "lucide-react";

export function ResourceSpotlightCard() {
  return (
    <article className="blog-card spring-fever" aria-labelledby="resource-spotlight-title">
      <div className="title-content">
        <h3 id="resource-spotlight-title">
          <Link href="/resources">10 inspiring photos</Link>
        </h3>
        <div className="intro">
          <Link href="/resources">Inspiration</Link>
        </div>
      </div>
      <div className="card-info">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim...
        <Link href="/resources" className="read-article-link">
          Read Article
          <span className="licon icon-arr icon-black" aria-hidden="true">
            <ArrowRight size={15} strokeWidth={2.4} />
          </span>
        </Link>
      </div>
      <div className="utility-info">
        <ul className="utility-list" aria-label="Article details">
          <li>
            <span className="licon icon-like" aria-hidden="true">
              <Heart size={15} strokeWidth={2.2} />
            </span>
            <Link href="/resources">2</Link>
          </li>
          <li>
            <span className="licon icon-com" aria-hidden="true">
              <MessageCircle size={15} strokeWidth={2.2} />
            </span>
            <Link href="/resources">12</Link>
          </li>
          <li>
            <span className="licon icon-dat" aria-hidden="true">
              <CalendarDays size={15} strokeWidth={2.2} />
            </span>
            03 jun 2017
          </li>
          <li>
            <span className="licon icon-tag" aria-hidden="true">
              <Tags size={15} strokeWidth={2.2} />
            </span>
            <Link href="/resources">Photos</Link>, <Link href="/resources">Nice</Link>
          </li>
        </ul>
      </div>
      <div className="gradient-overlay" />
      <div className="color-overlay" />
    </article>
  );
}
