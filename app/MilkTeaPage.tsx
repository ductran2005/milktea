"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";

const drinks = [
  {
    name: "Brown Sugar Milk Tea",
    shortName: "Brown Sugar",
    label: "Best seller",
    description:
      "Sua tuoi beo nhe, duong nau keo sanh tao van marble va tran chau den nau mem moi ngay.",
    price: "49K",
    image: "/milktea-assets/real-brown-sugar-cutout.png",
    color: "#d7a85b",
  },
  {
    name: "Matcha Cloud Latte",
    shortName: "Matcha Cloud",
    label: "Japanese matcha",
    description:
      "Matcha xanh thanh, sua tuoi mat lanh, lop vi be beo va tran chau den bong ngot.",
    price: "55K",
    image: "/milktea-assets/real-matcha-cloud-cutout.png",
    color: "#9ebe65",
  },
  {
    name: "Taro Pearl Fresh Milk",
    shortName: "Taro Pearl",
    label: "Creamy taro",
    description:
      "Khoai mon tim thom, sua tuoi min, vi beo diu va tran chau mem dai trong tung ngum.",
    price: "52K",
    image: "/milktea-assets/real-taro-pearl-cutout.png",
    color: "#b990d7",
  },
  {
    name: "Oolong Peach Milk Tea",
    shortName: "Oolong Peach",
    label: "Fruity tea",
    description:
      "Tra oolong rang thom, vi dao vang diu nhe, hau vi sach va mat cho ngay nong.",
    price: "50K",
    image: "/milktea-assets/real-oolong-peach-cutout.png",
    color: "#e2a04d",
  },
];

const steps = [
  ["01", "Brew tea fresh", "Tra duoc u theo me nho de giu mui thom va vi hau ro."],
  ["02", "Cook pearls daily", "Tran chau nau moi trong ngay, giu do bong, dai va mem."],
  ["03", "Serve with balance", "Do ngot, da va topping duoc can chinh theo tung ly."],
];

const rewards = ["Free topping", "Birthday drink", "Size upgrade", "Member-only menu"];

export default function MilkTeaPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDrink = drinks[activeIndex];

  return (
    <main className="site-shell">
      <section className="hero-section" id="home">
        <header className="site-header">
          <a className="brand" href="#home" aria-label="AURATEA home">
            <span>AURATEA</span>
            <small>Bubble Tea</small>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#menu">Menu</a>
            <a href="#story">Story</a>
            <a href="#custom">Custom</a>
            <a href="#rewards">Rewards</a>
          </nav>
          <a className="header-action" href="#menu">
            Order now
          </a>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Premium milk tea</p>
            <h1>
              Tra sua that ngon,
              <span> nhin la muon uong.</span>
            </h1>
            <p className="hero-description">
              AURATEA tap trung vao ly tra sua co cam giac that: chat sua min,
              van duong nau ro, tran chau bong va hinh anh san pham cao cap.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#menu">
                Xem menu
              </a>
              <a className="ghost-button" href="#story">
                Cau chuyen
              </a>
            </div>
          </div>

          <div className="product-stage" aria-label="Featured drinks">
            <div className="stage-orbit" />
            {drinks.map((drink, index) => {
              const offset = (index - activeIndex + drinks.length) % drinks.length;
              const stageClass =
                offset === 0 ? "front" : offset === 1 ? "right" : offset === drinks.length - 1 ? "left" : "hidden";

              return (
                <button
                  aria-label={`Show ${drink.name}`}
                  aria-pressed={index === activeIndex}
                  className={`stage-drink ${stageClass}`}
                  key={drink.name}
                  onClick={() => setActiveIndex(index)}
                  style={{ "--drink-color": drink.color } as CSSProperties}
                  type="button"
                >
                  <Image src={drink.image} alt={drink.name} width={943} height={1668} priority={index === activeIndex} />
                </button>
              );
            })}
          </div>

          <aside className="product-panel">
            <p className="panel-kicker">{activeDrink.label}</p>
            <h2>{activeDrink.name}</h2>
            <p>{activeDrink.description}</p>
            <div className="panel-bottom">
              <strong>{activeDrink.price}</strong>
              <span>regular cup</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="menu-section section-block" id="menu">
        <div className="section-heading">
          <p className="eyebrow">Signature menu</p>
          <h2>Nhung vi ban chay nhat</h2>
        </div>
        <div className="menu-grid">
          {drinks.map((drink, index) => (
            <article className="menu-card" key={drink.name}>
              <span>{drink.label}</span>
              <Image src={drink.image} alt={drink.name} width={943} height={1668} />
              <h3>{drink.shortName}</h3>
              <p>{drink.description}</p>
              <div>
                <strong>{drink.price}</strong>
                <button type="button" onClick={() => setActiveIndex(index)}>
                  View
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section section-block" id="story">
        <div className="story-visual">
          <Image src={activeDrink.image} alt={activeDrink.name} width={943} height={1668} />
        </div>
        <div className="story-content">
          <p className="eyebrow">How we make it</p>
          <h2>Moi ly duoc lam de nhin ngon va uong ngon.</h2>
          <div className="step-list">
            {steps.map(([number, title, text]) => (
              <article className="step-item" key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="custom-section section-block" id="custom">
        <div>
          <p className="eyebrow">Custom your cup</p>
          <h2>De khach chon dung gu cua minh.</h2>
          <p>
            Website co the dung layout nay de ban hang online: chon vi, chon do
            ngot, chon da, them topping va xem gia truoc khi dat.
          </p>
        </div>
        <div className="custom-options">
          {["30% - 100% sugar", "Less ice / normal ice", "Pearl, pudding, cream", "Takeaway or delivery"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="rewards-section section-block" id="rewards">
        <div>
          <p className="eyebrow">Member rewards</p>
          <h2>Khach quay lai nhieu hon voi uu dai don gian.</h2>
        </div>
        <div className="reward-grid">
          {rewards.map((reward) => (
            <article key={reward}>{reward}</article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#home">
          <span>AURATEA</span>
          <small>Bubble Tea</small>
        </a>
        <p>Open daily 09:00 - 22:30</p>
        <p>hello@auratea.vn</p>
      </footer>
    </main>
  );
}
